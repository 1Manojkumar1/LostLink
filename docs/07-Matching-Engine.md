# 07 — Matching Engine

> Deterministic weighted similarity algorithm for LOST ↔ FOUND item matching

---

## 1. Overview

The matching engine is the core differentiator of LostLink. It compares LOST and FOUND items across four dimensions using a deterministic weighted algorithm — no external AI APIs, no machine learning models, no vector databases required for MVP.

**Key Principles:**
- Deterministic: Same inputs always produce same score
- Transparent: Reasons for match are explained
- Fast: In-memory calculation, single DB query
- Threshold: Only scores ≥ 60% displayed

---

## 2. Scoring Algorithm

### Weight Distribution

| Dimension | Weight | Max Points |
|-----------|--------|------------|
| Category | 30% | 30 |
| Location | 25% | 25 |
| Description | 25% | 25 |
| Date | 20% | 20 |
| **Total** | **100%** | **100** |

### Score Thresholds

| Score Range | Label | Display |
|-------------|-------|---------|
| 90-100 | VERY STRONG MATCH | ✓✓✓ |
| 75-89 | STRONG MATCH | ✓✓ |
| 60-74 | POSSIBLE MATCH | ✓ |
| < 60 | No Match | Hidden |

---

## 3. Dimension Scoring Details

### 3.1 Category Similarity (30 pts)

```javascript
// Exact match only
function calculateCategoryScore(itemA, itemB) {
  return itemA.category === itemB.category ? 30 : 0;
}
```

- Same category → 30 points
- Different category → 0 points
- Categories: Electronics, Accessories, Documents, Clothing, Books, Keys, Bags, Sports, Other

### 3.2 Location Similarity (25 pts)

```javascript
function calculateLocationScore(itemA, itemB) {
  const locA = normalizeLocation(itemA.location);
  const locB = normalizeLocation(itemB.location);
  
  if (locA === locB) return 25;                    // Exact match
  if (locA.includes(locB) || locB.includes(locA)) return 20; // Substring
  if (sharedBuilding(locA, locB)) return 15;       // Same building
  if (sharedCampusArea(locA, locB)) return 10;     // Same area (e.g., "North Campus")
  return 0;
}

function normalizeLocation(loc) {
  return loc.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\b(floor|level|room|building|hall|center)\b/g, '')
    .trim();
}
```

| Match Type | Points | Example |
|------------|--------|---------|
| Exact (normalized) | 25 | "Central Library" ≈ "central library" |
| Substring | 20 | "Central Library 2nd Floor" ≈ "Central Library" |
| Same building | 15 | "Engineering Bldg A" ≈ "Engineering Building A" |
| Same campus area | 10 | "North Campus Library" ≈ "North Campus Gym" |
| Different | 0 | "Library" vs "Cafeteria" |

### 3.3 Description Similarity (25 pts)

**Algorithm:** Token-based Jaccard similarity with stop word removal

```javascript
// utils/textSimilarity.js
const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
  'is', 'was', 'are', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
  'i', 'you', 'he', 'she', 'it', 'we', 'they', 'my', 'your', 'his', 'her', 'its', 'our', 'their',
  'this', 'that', 'these', 'those', 'am', 'not', 'so', 'if', 'then', 'than', 'as', 'from'
]);

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 1 && !STOP_WORDS.has(w));
}

function jaccardSimilarity(tokensA, tokensB) {
  const setA = new Set(tokensA);
  const setB = new Set(tokensB);
  const intersection = [...setA].filter(x => setB.has(x)).length;
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

function calculateDescriptionScore(itemA, itemB) {
  const tokensA = tokenize(itemA.description);
  const tokensB = tokenize(itemB.description);
  const similarity = jaccardSimilarity(tokensA, tokensB);
  return Math.round(similarity * 25);
}
```

**Examples:**

| Description A | Description B | Tokens A | Tokens B | Jaccard | Score |
|---------------|---------------|----------|----------|---------|-------|
| "black hp laptop blue sticker" | "black laptop hp with blue sticker" | [black, hp, laptop, blue, sticker] | [black, laptop, hp, blue, sticker] | 1.0 | 25 |
| "red iphone 13 pro max" | "iphone 13 red case" | [red, iphone, 13, pro, max] | [iphone, 13, red, case] | 0.5 | 13 |
| "silver macbook air m2" | "black dell xps laptop" | [silver, macbook, air, m2] | [black, dell, xps, laptop] | 0.0 | 0 |

### 3.4 Date Similarity (20 pts)

```javascript
// utils/dateSimilarity.js
function calculateDateScore(itemA, itemB) {
  const dateA = new Date(itemA.date);
  const dateB = new Date(itemB.date);
  
  // Normalize to date only (ignore time)
  dateA.setHours(0, 0, 0, 0);
  dateB.setHours(0, 0, 0, 0);
  
  const diffMs = Math.abs(dateA - dateB);
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 20;      // Same day
  if (diffDays === 1) return 15;      // 1 day apart
  if (diffDays === 2) return 10;      // 2 days apart
  if (diffDays === 3) return 5;       // 3 days apart
  return 0;                            // > 3 days apart
}
```

| Days Apart | Points |
|------------|--------|
| 0 | 20 |
| 1 | 15 |
| 2 | 10 |
| 3 | 5 |
| ≥ 4 | 0 |

---

## 4. Matching Service Implementation

```javascript
// services/matchingService.js
const Item = require('../models/Item');
const { calculateDescriptionScore } = require('../utils/textSimilarity');
const { calculateDateScore } = require('../utils/dateSimilarity');

class MatchingService {
  async findMatches(item, options = {}) {
    const { limit = 10, minScore = 60 } = options;
    
    // 1. Determine opposite type
    const oppositeType = item.type === 'LOST' ? 'FOUND' : 'LOST';
    
    // 2. Fetch candidate items (single query)
    const candidates = await Item.find({
      type: oppositeType,
      status: { $ne: 'RESOLVED' },
      _id: { $ne: item._id },
    }).select('title category type location date description verificationQuestion userId').lean();
    
    if (candidates.length === 0) return [];
    
    // 3. Calculate scores for all candidates
    const matches = candidates.map(candidate => {
      const categoryScore = this.calculateCategoryScore(item, candidate);
      const locationScore = this.calculateLocationScore(item, candidate);
      const descriptionScore = calculateDescriptionScore(item, candidate);
      const dateScore = calculateDateScore(item, candidate);
      
      const totalScore = categoryScore + locationScore + descriptionScore + dateScore;
      
      if (totalScore < minScore) return null;
      
      return {
        itemId: candidate._id,
        title: candidate.title,
        category: candidate.category,
        type: candidate.type,
        location: candidate.location,
        date: candidate.date,
        score: totalScore,
        reasons: this.generateReasons(categoryScore, locationScore, descriptionScore, dateScore),
      };
    }).filter(Boolean);
    
    // 4. Sort by score descending
    matches.sort((a, b) => b.score - a.score);
    
    // 5. Limit results
    return matches.slice(0, limit);
  }
  
  calculateCategoryScore(itemA, itemB) {
    return itemA.category === itemB.category ? 30 : 0;
  }
  
  calculateLocationScore(itemA, itemB) {
    const locA = this.normalizeLocation(itemA.location);
    const locB = this.normalizeLocation(itemB.location);
    
    if (locA === locB) return 25;
    if (locA.includes(locB) || locB.includes(locA)) return 20;
    if (this.sharedBuilding(locA, locB)) return 15;
    if (this.sharedCampusArea(locA, locB)) return 10;
    return 0;
  }
  
  normalizeLocation(loc) {
    return loc.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\b(floor|level|room|building|bldg|hall|center|centre)\b/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
  
  sharedBuilding(locA, locB) {
    const buildings = ['library', 'engineering', 'science', 'arts', 'business', 'medical', 'student center', 'cafeteria', 'gym', 'stadium', 'dorm', 'residence'];
    return buildings.some(b => locA.includes(b) && locB.includes(b));
  }
  
  sharedCampusArea(locA, locB) {
    const areas = ['north', 'south', 'east', 'west', 'central', 'main', 'upper', 'lower'];
    return areas.some(a => locA.includes(a) && locB.includes(a));
  }
  
  generateReasons(categoryScore, locationScore, descriptionScore, dateScore) {
    const reasons = [];
    if (categoryScore === 30) reasons.push('Same category');
    if (locationScore >= 20) reasons.push('Similar location');
    else if (locationScore >= 10) reasons.push('Nearby location');
    if (descriptionScore >= 20) reasons.push('Similar description');
    else if (descriptionScore >= 10) reasons.push('Some description overlap');
    if (dateScore === 20) reasons.push('Same date');
    else if (dateScore >= 10) reasons.push('Close date');
    return reasons;
  }
}

module.exports = new MatchingService();
```

---

## 5. Controller Integration

```javascript
// controllers/itemController.js
exports.getMatches = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    
    const matches = await matchingService.findMatches(item);
    res.json({ success: true, data: { matches } });
  } catch (err) { next(err); }
};
```

---

## 6. API Response Format

```json
{
  "success": true,
  "data": {
    "matches": [
      {
        "itemId": "65a1b2c3d4e5f6789012347",
        "title": "Black HP Laptop",
        "category": "Electronics",
        "type": "FOUND",
        "location": "Central Library - 2nd Floor",
        "date": "2024-01-21T00:00:00.000Z",
        "score": 94,
        "reasons": [
          "Same category",
          "Similar location",
          "Similar description",
          "Same date"
        ]
      }
    ]
  }
}
```

---

## 7. Frontend Display (MatchCard)

```jsx
// components/MatchCard.jsx
export default function MatchCard({ match }) {
  const getScoreColor = (score) => {
    if (score >= 90) return 'text-success';
    if (score >= 75) return 'text-primary';
    return 'text-warning';
  };
  
  const getScoreLabel = (score) => {
    if (score >= 90) return 'VERY STRONG MATCH';
    if (score >= 75) return 'STRONG MATCH';
    return 'POSSIBLE MATCH';
  };
  
  return (
    <div className="card card-hover">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <StatusBadge type={match.type} />
            <span className="font-mono text-lg font-bold {getScoreColor(match.score)}">
              {match.score}%
            </span>
            <span className="badge bg-surface-elevated text-xs">{getScoreLabel(match.score)}</span>
          </div>
          <h3 className="text-lg font-semibold">{match.title}</h3>
          <p className="text-sm text-text-secondary mt-1">
            {match.category} · {match.location} · {formatDate(match.date)}
          </p>
          <div className="mt-3 space-y-1">
            {match.reasons.map((reason, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-text-secondary">
                <CheckIcon className="w-4 h-4 text-success flex-shrink-0" />
                {reason}
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Button variant="surface" onClick={() => navigate(`/items/${match.itemId}`)}>
            View Item
          </Button>
          {match.type === 'FOUND' && (
            <Button variant="primary" onClick={() => openClaimModal(match.itemId)}>
              Claim Item
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
```

---

## 8. Performance Characteristics

| Metric | Target |
|--------|--------|
| Candidates fetched | ≤ 500 (active opposite-type) |
| Score calculation | < 5ms per candidate |
| Total response time | < 200ms |
| Memory usage | < 10MB for 500 candidates |

**Optimization Notes:**
- Single DB query with lean() for plain objects
- In-memory calculation, no N+1 queries
- Early filter by status and type in DB
- Limit candidates if needed (add `.limit(500)`)
- No external API calls

---

## 9. Testing Scenarios

| Scenario | Expected Score | Label |
|----------|---------------|-------|
| Same category, exact location, identical description, same date | 100 | VERY STRONG |
| Same category, same building, similar desc, 1 day apart | 90 | VERY STRONG |
| Same category, nearby location, partial desc, 2 days apart | 70 | POSSIBLE MATCH |
| Different category, same location, similar desc, same date | 50 | Hidden |
| Same category, different location, different desc, 5 days apart | 30 | Hidden |

---

## 10. Future Enhancements (Post-MVP)

| Enhancement | Approach |
|-------------|----------|
| Semantic similarity | Text embeddings (sentence-transformers) |
| Image similarity | Perceptual hashing / CLIP embeddings |
| Fuzzy location | Geocoding + radius search |
| User feedback | Reinforce weights from approve/reject |
| Cross-category | Configurable category affinity matrix |