# 08 — Claim Verification System

> Secure ownership verification flow for FOUND items

---

## 1. Overview

The claim verification system ensures only legitimate owners can recover lost items. It uses a **challenge-response** mechanism where the finder sets a verification question/answer during FOUND item reporting, and claimants must answer correctly to submit a claim.

**Security Properties:**
- Verification answer **never** exposed to frontend
- Verification happens **server-side only**
- Answer normalized (trim + lowercase) for comparison
- Claims tracked with status: PENDING → APPROVED/REJECTED
- Only finder can approve/reject

---

## 2. Data Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   FINDER    │     │  BACKEND    │     │  CLAIMANT   │     │  BACKEND    │
│  (Reporter) │     │  (Storage)  │     │  (Owner)    │     │ (Verification)
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │                   │
       │ 1. Report FOUND   │                   │                   │
       │ Item + Q + A ────►│                   │                   │
       │                   │  Store:           │                   │
       │                   │ verificationAnswer │                   │
       │                   │ (hashed? no - exact)              │
       │                   │                   │                   │
       │                   │                   │ 2. View Item     │
       │                   │◄── verificationQ ─│                   │
       │                   │                   │                   │
       │                   │                   │ 3. Claim + Answer│
       │                   │◄──────────────────│                   │
       │                   │                   │                   │
       │                   │ 4. Verify:        │                   │
       │                   │ normalize(answer) │                   │
       │                   │ === storedAnswer  │                   │
       │                   │                   │                   │
       │                   │ 5. Create Claim   │                   │
       │                   │ status: PENDING   │                   │
       │                   │ Item: CLAIM_PENDING                 │
       │                   │─────────────────►│                   │
       │                   │                   │                   │
       │ 6. Dashboard:    │                   │                   │
       │ Pending Claim ───►│                   │                   │
       │                   │                   │                   │
       │ 7. Approve/Reject│                   │                   │
       │ ────────────────►│                   │                   │
       │                   │ 8. Update:        │                   │
       │                   │ Claim: APPROVED   │                   │
       │                   │ Item: RESOLVED    │                   │
       │                   │                   │                   │
```

---

## 3. FOUND Item Reporting (Setting Verification)

### Request
```json
POST /api/items
{
  "title": "Black HP Laptop",
  "type": "FOUND",
  "verificationQuestion": "What color is the sticker on the laptop?",
  "verificationAnswer": "blue star"
}
```

### Storage
```javascript
// Item document
{
  type: 'FOUND',
  verificationQuestion: 'What color is the sticker on the laptop?',
  verificationAnswer: 'blue star',  // select: false in schema
  // ...
}
```

### Public GET Response (Critical: Answer Excluded)
```json
GET /api/items/:id
{
  "success": true,
  "data": {
    "item": {
      "_id": "...",
      "title": "Black HP Laptop",
      "type": "FOUND",
      "verificationQuestion": "What color is the sticker on the laptop?",
      // verificationAnswer: NEVER INCLUDED
    }
  }
}
```

---

## 4. Claim Submission (Verification)

### Request
```json
POST /api/claims
Authorization: Bearer <claimant_token>
{
  "itemId": "65a1b2c3d4e5f6789012347",
  "answer": "Blue Star"
}
```

### Server-Side Verification Logic
```javascript
// controllers/claimController.js
exports.createClaim = async (req, res, next) => {
  try {
    const { itemId, answer } = req.body;
    const claimantId = req.userId;
    
    // 1. Fetch item (includes verificationAnswer due to select:false override)
    const item = await Item.findById(itemId).select('+verificationAnswer');
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    
    // 2. Business rule checks
    if (item.type !== 'FOUND') {
      return res.status(400).json({ success: false, message: 'Only FOUND items can be claimed' });
    }
    if (item.status === 'RESOLVED') {
      return res.status(400).json({ success: false, message: 'Item already resolved' });
    }
    if (item.status === 'CLAIM_PENDING') {
      return res.status(400).json({ success: false, message: 'Claim already pending' });
    }
    if (item.userId.toString() === claimantId) {
      return res.status(400).json({ success: false, message: 'Cannot claim your own item' });
    }
    
    // 3. Verify answer (NORMALIZED COMPARISON)
    const submitted = answer.trim().toLowerCase();
    const correct = item.verificationAnswer.trim().toLowerCase();
    
    if (submitted !== correct) {
      return res.status(422).json({ success: false, message: 'Incorrect verification answer' });
    }
    
    // 4. Check duplicate pending claim
    const existing = await Claim.findOne({ itemId, claimantId, status: 'PENDING' });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Claim already pending' });
    }
    
    // 5. Create claim
    const claim = await Claim.create({
      itemId,
      claimantId,
      answer: submitted,  // Store normalized
      status: 'PENDING',
    });
    
    // 6. Update item status
    item.status = 'CLAIM_PENDING';
    await item.save();
    
    res.status(201).json({ success: true, data: { claim } });
  } catch (err) { next(err); }
};
```

### Response (Success)
```json
{
  "success": true,
  "data": {
    "claim": {
      "_id": "65a1b2c3d4e5f6789012349",
      "itemId": "65a1b2c3d4e5f6789012347",
      "claimantId": "65a1b2c3d4e5f6789012345",
      "answer": "blue star",
      "status": "PENDING",
      "createdAt": "2024-01-22T14:30:00.000Z"
    }
  }
}
```

### Response (Incorrect Answer)
```json
{
  "success": false,
  "message": "Incorrect verification answer"
}
```

---

## 5. Claim Approval/Rejection (Finder Actions)

### Approve Claim
```javascript
// PUT /api/claims/:id/approve
exports.approveClaim = async (req, res, next) => {
  try {
    const claim = await Claim.findById(req.params.id).populate('itemId');
    if (!claim) return res.status(404).json({ success: false, message: 'Claim not found' });
    
    // Authorization: Only finder (item owner) can approve
    if (claim.itemId.userId.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    if (claim.status !== 'PENDING') {
      return res.status(400).json({ success: false, message: 'Claim not pending' });
    }
    
    claim.status = 'APPROVED';
    await claim.save();
    
    // Resolve item
    claim.itemId.status = 'RESOLVED';
    await claim.itemId.save();
    
    res.json({ success: true, data: { claim } });
  } catch (err) { next(err); }
};
```

### Reject Claim
```javascript
// PUT /api/claims/:id/reject
exports.rejectClaim = async (req, res, next) => {
  try {
    const claim = await Claim.findById(req.params.id).populate('itemId');
    if (!claim) return res.status(404).json({ success: false, message: 'Claim not found' });
    
    if (claim.itemId.userId.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    if (claim.status !== 'PENDING') {
      return res.status(400).json({ success: false, message: 'Claim not pending' });
    }
    
    claim.status = 'REJECTED';
    await claim.save();
    
    // Revert item to ACTIVE only if NO other pending claims
    const otherPending = await Claim.findOne({ 
      itemId: claim.itemId._id, 
      status: 'PENDING' 
    });
    if (!otherPending) {
      claim.itemId.status = 'ACTIVE';
      await claim.itemId.save();
    }
    
    res.json({ success: true, data: { claim } });
  } catch (err) { next(err); }
};
```

---

## 6. Frontend Implementation

### ClaimModal Component
```jsx
// components/ClaimModal.jsx
import { useState } from 'react';
import { Modal, Button, Input } from './ui';
import { claimService } from '../services/claimService';

export default function ClaimModal({ item, isOpen, onClose, onSuccess }) {
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!answer.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      await claimService.createClaim(item._id, answer);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit claim');
    } finally {
      setLoading(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Verify Ownership">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <p className="text-text-secondary mb-4">
            To claim this item, answer the verification question provided by the finder.
          </p>
          <div className="bg-surface-elevated p-4 rounded-input mb-4">
            <p className="font-medium">Question:</p>
            <p className="mt-1 text-text">{item.verificationQuestion}</p>
          </div>
        </div>
        
        <div>
          <label className="label">Your Answer</label>
          <Input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter your answer"
            error={error}
            disabled={loading}
            autoFocus
          />
        </div>
        
        {error && <p className="text-error text-sm">{error}</p>}
        
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            Submit Verification
          </Button>
        </div>
      </form>
    </Modal>
  );
}
```

### Finder Dashboard - Pending Claims
```jsx
// pages/Dashboard.jsx - Pending Claims Section
function PendingClaimsSection({ claims }) {
  const handleApprove = async (claimId) => {
    await claimService.approveClaim(claimId);
    // Refresh or optimistic update
  };
  
  const handleReject = async (claimId) => {
    await claimService.rejectClaim(claimId);
  };
  
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Pending Claims</h2>
      {claims.length === 0 ? (
        <EmptyState 
          title="NO PENDING CLAIMS" 
          description="Claims for your found items will appear here."
        />
      ) : (
        <div className="space-y-3">
          {claims.map(claim => (
            <div key={claim._id} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{claim.itemId.title}</p>
                  <p className="text-sm text-text-secondary">
                    Claimed by {claim.claimantId.name} · {formatDate(claim.createdAt)}
                  </p>
                  <p className="text-sm text-text-muted mt-1">
                    Answer: "{claim.answer}"
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="danger" onClick={() => handleReject(claim._id)}>
                    Reject
                  </Button>
                  <Button variant="primary" onClick={() => handleApprove(claim._id)}>
                    Approve
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
```

---

## 7. Security Considerations

| Threat | Mitigation |
|--------|------------|
| Answer harvesting via API | `verificationAnswer` has `select: false`, never in public responses |
| Answer in network tab | Only sent during claim submission (POST), not in GET |
| Brute force claims | Rate limit: 10 claims/min/user |
| Case sensitivity confusion | Normalized comparison (trim + lowercase) |
| Duplicate claims | Unique index on (itemId, claimantId, status:PENDING) |
| Finder self-approval | Auth check: `claim.itemId.userId === req.userId` |
| Claim on resolved item | Status check before claim creation |

---

## 8. Answer Normalization Rules

```javascript
function normalizeAnswer(answer) {
  return answer
    .trim()                    // Remove whitespace
    .toLowerCase()             // Case insensitive
    .replace(/\s+/g, ' ')      // Collapse multiple spaces
    .replace(/[.,;:!?]+$/, ''); // Remove trailing punctuation
}
```

**Examples:**
| User Input | Normalized |
|------------|------------|
| "Blue Star" | "blue star" |
| "  BLUE STAR  " | "blue star" |
| "Blue Star." | "blue star" |
| "blue star" | "blue star" |

---

## 9. Status Flow Summary

```
Item: ACTIVE
    │
    ▼ (Valid claim submitted)
Item: CLAIM_PENDING
    │
    ├─► Approve ───► Claim: APPROVED, Item: RESOLVED
    │
    └─► Reject ───► Claim: REJECTED
                      │
                      └─► Other pending? → Item: CLAIM_PENDING
                          No pending? → Item: ACTIVE
```

---

## 10. Testing Checklist

- [ ] FOUND item requires verificationQuestion + verificationAnswer
- [ ] GET /api/items/:id never returns verificationAnswer
- [ ] Claim with correct answer → PENDING, Item → CLAIM_PENDING
- [ ] Claim with incorrect answer → 422 error
- [ ] Claim on own item → 400 error
- [ ] Claim on RESOLVED item → 400 error
- [ ] Duplicate pending claim → 400 error
- [ ] Finder approve → Claim APPROVED, Item RESOLVED
- [ ] Finder reject → Claim REJECTED, Item ACTIVE (if no other pending)
- [ ] Non-finder approve/reject → 403 error
- [ ] Answer normalization works (case, spaces, punctuation)