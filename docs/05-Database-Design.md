# 05 — Database Design

> MongoDB + Mongoose schemas for LostLink

---

## 1. Collections Overview

| Collection | Purpose | Est. Documents (MVP) |
|------------|---------|---------------------|
| `users` | Authentication, ownership | 100-500 |
| `items` | Lost/Found reports | 500-2000 |
| `claims` | Ownership claims | 200-1000 |

---

## 2. User Schema

```javascript
// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name max 50 chars'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Valid email required'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password min 8 chars'],
    select: false, // Never returned by default
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student',
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes
userSchema.index({ email: 1 }, { unique: true });

// Virtuals
userSchema.virtual('items', {
  ref: 'Item',
  localField: '_id',
  foreignField: 'userId',
});

userSchema.virtual('claims', {
  ref: 'Claim',
  localField: '_id',
  foreignField: 'claimantId',
});

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Instance method
userSchema.methods.comparePassword = async function(candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

### User Document Example

```json
{
  "_id": "65a1b2c3d4e5f6789012345",
  "name": "Alex Chen",
  "email": "alex@university.edu",
  "password": "$2a$12$...",
  "role": "student",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

---

## 3. Item Schema

```javascript
// models/Item.js
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title max 100 chars'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [2000, 'Description max 2000 chars'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    enum: {
      values: ['Electronics', 'Accessories', 'Documents', 'Clothing', 'Books', 'Keys', 'Bags', 'Sports', 'Other'],
      message: 'Invalid category',
    },
  },
  type: {
    type: String,
    required: [true, 'Type is required'],
    enum: {
      values: ['LOST', 'FOUND'],
      message: 'Type must be LOST or FOUND',
    },
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    maxlength: [100, 'Location max 100 chars'],
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
  },
  image: {
    type: String, // Cloudinary URL
    trim: true,
    default: null,
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'CLAIM_PENDING', 'RESOLVED'],
    default: 'ACTIVE',
  },
  // Verification fields (FOUND items only)
  verificationQuestion: {
    type: String,
    trim: true,
    maxlength: [200, 'Question max 200 chars'],
  },
  verificationAnswer: {
    type: String,
    trim: true,
    maxlength: [100, 'Answer max 100 chars'],
    select: false, // CRITICAL: Never returned by default
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes
itemSchema.index({ userId: 1 });
itemSchema.index({ type: 1 });
itemSchema.index({ category: 1 });
itemSchema.index({ location: 1 });
itemSchema.index({ status: 1 });
itemSchema.index({ date: -1 });
itemSchema.index({ createdAt: -1 });
// Text search index
itemSchema.index({
  title: 'text',
  description: 'text',
  category: 'text',
  location: 'text',
}, {
  weights: { title: 10, description: 5, category: 3, location: 2 },
  name: 'item_text_search',
});

// Compound indexes for common queries
itemSchema.index({ type: 1, status: 1, createdAt: -1 });
itemSchema.index({ category: 1, type: 1, status: 1 });
itemSchema.index({ location: 1, type: 1, status: 1 });

// Virtuals
itemSchema.virtual('claims', {
  ref: 'Claim',
  localField: '_id',
  foreignField: 'itemId',
});

itemSchema.virtual('matches', {
  ref: 'Item',
  localField: '_id',
  foreignField: '_id',
  justOne: false,
});

// Ensure verification fields only for FOUND
itemSchema.pre('validate', function(next) {
  if (this.type === 'FOUND') {
    if (!this.verificationQuestion) {
      this.invalidate('verificationQuestion', 'Verification question required for FOUND items');
    }
    if (!this.verificationAnswer) {
      this.invalidate('verificationAnswer', 'Verification answer required for FOUND items');
    }
  }
  next();
});

module.exports = mongoose.model('Item', itemSchema);
```

### Item Document Example

```json
{
  "_id": "65a1b2c3d4e5f6789012346",
  "title": "Black HP Laptop",
  "description": "Black HP laptop with blue star sticker near the HP logo. Charger included.",
  "category": "Electronics",
  "type": "LOST",
  "location": "Central Library - 2nd Floor Study Area",
  "date": "2024-01-20T00:00:00.000Z",
  "image": "https://res.cloudinary.com/xxx/image/upload/v123/lostlink/laptop.jpg",
  "status": "ACTIVE",
  "verificationQuestion": null,
  "verificationAnswer": null,
  "userId": "65a1b2c3d4e5f6789012345",
  "createdAt": "2024-01-21T09:15:00.000Z",
  "updatedAt": "2024-01-21T09:15:00.000Z"
}
```

---

## 4. Claim Schema

```javascript
// models/Claim.js
const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true,
  },
  claimantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  answer: {
    type: String,
    required: [true, 'Answer is required'],
    trim: true,
    maxlength: [100, 'Answer max 100 chars'],
  },
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
    default: 'PENDING',
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes
claimSchema.index({ itemId: 1 });
claimSchema.index({ claimantId: 1 });
claimSchema.index({ status: 1 });
claimSchema.index({ itemId: 1, claimantId: 1, status: 1 }, { unique: true }); // Prevent duplicate pending

// Virtuals
claimSchema.virtual('item', {
  ref: 'Item',
  localField: 'itemId',
  foreignField: '_id',
  justOne: true,
});

claimSchema.virtual('claimant', {
  ref: 'User',
  localField: 'claimantId',
  foreignField: '_id',
  justOne: true,
});

module.exports = mongoose.model('Claim', claimSchema);
```

### Claim Document Example

```json
{
  "_id": "65a1b2c3d4e5f6789012347",
  "itemId": "65a1b2c3d4e5f6789012346",
  "claimantId": "65a1b2c3d4e5f6789012348",
  "answer": "blue star sticker",
  "status": "PENDING",
  "createdAt": "2024-01-22T14:30:00.000Z",
  "updatedAt": "2024-01-22T14:30:00.000Z"
}
```

---

## 5. Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│      USER       │       │      ITEM       │       │     CLAIM       │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ _id (PK)        │◄──────│ userId (FK)     │       │ claimantId (FK) │
│ name            │       │ _id (PK)        │◄──────│ itemId (FK)     │
│ email (unique)  │       │ title           │       │ answer          │
│ password (hash) │       │ description     │       │ status          │
│ role            │       │ category        │       └────────┬────────┘
│ createdAt       │       │ type (LOST/FOUND)│              │
│ updatedAt       │       │ location        │              │
└─────────────────┘       │ date            │              │
                          │ image (URL)     │              │
                          │ status          │              │
                          │ verificationQ   │              │
                          │ verificationA*  │              │
                          │ createdAt       │              │
                          │ updatedAt       │              │
                          └─────────────────┘              │
                                                           │
                    * verificationAnswer has select:false │
                    (never returned in queries)           │
                                                           │
                         ┌─────────────────┐              │
                         │    INDEXES      │              │
                         ├─────────────────┤              │
                         │ users.email     │◄─────────────┘
                         │ items.userId    │
                         │ items.type      │
                         │ items.category  │
                         │ items.location  │
                         │ items.status    │
                         │ items.text      │
                         │ items.compound  │
                         │ claims.itemId   │
                         │ claims.claimant │
                         │ claims.compound │
                         └─────────────────┘
```

---

## 6. Data Lifecycle

### Item Status Transitions

```
CREATED (POST /api/items)
    │
    ▼
ACTIVE (default)
    │
    ├─► CLAIM_PENDING (claim submitted, verified)
    │        │
    │        ├─► APPROVED ──► RESOLVED
    │        │
    │        └─► REJECTED ──► ACTIVE (if no other pending)
    │
    └─► RESOLVED (admin/manual)
```

### Claim Status Transitions

```
CREATED (POST /api/claims) ──► PENDING
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
               APPROVED                         REJECTED
                    │                               │
                    ▼                               ▼
              Item: RESOLVED                Item: ACTIVE*
                                                   *if no other pending
```

---

## 7. Query Patterns & Index Strategy

| Query | Index Used |
|-------|------------|
| `Item.find({ userId })` | `userId` |
| `Item.find({ type, status })` | compound `type+status+createdAt` |
| `Item.find({ category, type, status })` | compound `category+type+status` |
| `Item.find({ $text: { $search } })` | text index |
| `Item.find({ location: /regex/i, type, status })` | compound `location+type+status` |
| `Claim.find({ itemId })` | `itemId` |
| `Claim.find({ claimantId })` | `claimantId` |
| `Claim.find({ itemId, claimantId, status: PENDING })` | unique compound |
| `User.find({ email })` | unique `email` |

---

## 8. Migration / Seed Strategy

### Development Seed (server/utils/seed.js)

```javascript
const User = require('../models/User');
const Item = require('../models/Item');
const Claim = require('../models/Claim');
const mongoose = require('mongoose');

const categories = ['Electronics', 'Accessories', 'Documents', 'Clothing', 'Books', 'Keys', 'Bags', 'Sports', 'Other'];
const locations = ['Central Library', 'Student Center', 'Engineering Building', 'Cafeteria', 'Gym', 'Parking Lot', 'Dormitory'];
const types = ['LOST', 'FOUND'];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  // Clear
  await Promise.all([User.deleteMany(), Item.deleteMany(), Claim.deleteMany()]);

  // Users
  const users = await User.insertMany([
    { name: 'Alex Chen', email: 'alex@test.edu', password: 'password123' },
    { name: 'Jordan Kim', email: 'jordan@test.edu', password: 'password123' },
    { name: 'Taylor Smith', email: 'taylor@test.edu', password: 'password123' },
  ]);

  // Items
  const items = [];
  for (let i = 0; i < 20; i++) {
    const type = types[Math.floor(Math.random() * 2)];
    const item = {
      title: `${type === 'LOST' ? 'Lost' : 'Found'} ${categories[Math.floor(Math.random() * categories.length)]}`,
      description: `Sample ${type.toLowerCase()} item description with details.`,
      category: categories[Math.floor(Math.random() * categories.length)],
      type,
      location: locations[Math.floor(Math.random() * locations.length)],
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      userId: users[Math.floor(Math.random() * users.length)]._id,
    };
    if (type === 'FOUND') {
      item.verificationQuestion = 'What color is the case?';
      item.verificationAnswer = 'blue';
    }
    items.push(item);
  }
  await Item.insertMany(items);

  console.log('Seed complete');
  process.exit(0);
}

seed();
```

---

## 9. Data Validation Rules

| Field | Validation |
|-------|------------|
| User.email | Unique, valid format, lowercase |
| User.password | Min 8 chars, bcrypt hash (cost 12) |
| Item.title | Required, 1-100 chars |
| Item.description | Required, 1-2000 chars |
| Item.category | Enum (9 values) |
| Item.type | Enum: LOST, FOUND |
| Item.location | Required, 1-100 chars |
| Item.date | Required, valid Date |
| Item.status | Enum: ACTIVE, CLAIM_PENDING, RESOLVED |
| Item.verificationQ | Required if FOUND, 1-200 chars |
| Item.verificationA | Required if FOUND, 1-100 chars, select:false |
| Claim.answer | Required, 1-100 chars |
| Claim.status | Enum: PENDING, APPROVED, REJECTED |
| Claim unique | (itemId, claimantId, status:PENDING) unique |

---

## 10. Security Considerations

1. **Password** — Never logged, never returned, bcrypt cost 12
2. **verificationAnswer** — `select: false` in schema, explicitly excluded in queries
3. **JWT** — Short expiry (24h), HS256, secret in env
4. **ObjectId validation** — All params validated via express-validator
5. **Ownership** — Checked in controllers before mutating
6. **Text search** — Sanitized via Mongoose, no injection risk