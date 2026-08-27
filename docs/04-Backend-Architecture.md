# 04 — Backend Architecture

> Express.js + Mongoose + MongoDB Atlas

---

## 1. Technology Stack

| Layer | Choice | Version | Rationale |
|-------|--------|---------|-----------|
| **Runtime** | Node.js | 20+ LTS | Non-blocking I/O, long-term support |
| **Framework** | Express.js | 4.x | Mature, middleware pattern, wide adoption |
| **Database** | MongoDB | 7.x | Flexible schema, Atlas free tier |
| **ODM** | Mongoose | 8.x | Schema validation, middleware, TypeScript support |
| **Auth** | JWT + bcryptjs | — | Stateless, secure password hashing |
| **Validation** | express-validator | 7.x | Middleware-based, chainable |
| **CORS** | cors | 2.x | Cross-origin for frontend dev |
| **Env** | dotenv | 16.x | Environment config |
| **Images** | Cloudinary | 2.x | Free tier, CDN, transformations |

---

## 2. Server Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    EXPRESS SERVER                            │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                 MIDDLEWARE STACK                        │ │
│  │  cors() → express.json() → authMiddleware → validators │ │
│  └────────────────────────────┬────────────────────────────┘ │
│                               │                               │
│  ┌────────────────────────────┴────────────────────────────┐ │
│  │                      ROUTES                              │ │
│  │  /api/auth  •  /api/items  •  /api/claims               │ │
│  └────────────────────────────┬────────────────────────────┘ │
│                               │                               │
│        ┌──────────────────────┼──────────────────────┐       │
│        ▼                      ▼                      ▼       │
│  ┌───────────┐          ┌───────────┐          ┌───────────┐ │
│  │  Auth     │          │  Item     │          │  Claim    │ │
│  │ Controller│          │ Controller│          │ Controller│ │
│  └─────┬─────┘          └─────┬─────┘          └─────┬─────┘ │
│        │                      │                      │       │
│        │              ┌───────┴───────┐              │       │
│        │              ▼               ▼              │       │
│        │       ┌───────────┐   ┌────────────┐        │       │
│        │       │   Item    │   │  Matching  │        │       │
│        │       │  Service  │   │  Service   │        │       │
│        │       └─────┬─────┘   └─────┬──────┘        │       │
│        │             │               │                │       │
│        ▼             ▼               ▼                ▼       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                     MODELS (Mongoose)                   │ │
│  │  User  •  Item  •  Claim                                │ │
│  └────────────────────────────┬────────────────────────────┘ │
│                               │                               │
│                               ▼                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                   MONGODB ATLAS                         │ │
│  │  users  •  items  •  claims                             │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Directory Structure

```
server/
├── server.js                      # Entry point, Express setup, DB connect
├── package.json
├── .env                           # Environment variables (gitignored)
│
├── config/
│   └── db.js                      # Mongoose connection
│
├── models/
│   ├── User.js                    # User schema, methods
│   ├── Item.js                    # Item schema, indexes, statics
│   └── Claim.js                   # Claim schema
│
├── controllers/
│   ├── authController.js          # register, login, me
│   ├── itemController.js          # CRUD, search, matches
│   └── claimController.js         # create, approve, reject, list
│
├── routes/
│   ├── authRoutes.js              # POST /register, /login, GET /me
│   ├── itemRoutes.js              # CRUD + GET /:id/matches
│   └── claimRoutes.js             # POST, GET, PUT /:id/approve|reject
│
├── middleware/
│   ├── authMiddleware.js          # JWT verification, attach user
│   ├── errorMiddleware.js         # Centralized error handler
│   └── validationMiddleware.js    # express-validator helpers
│
├── services/
│   └── matchingService.js         # findMatches, calculateScore
│
└── utils/
    ├── textSimilarity.js          # Keyword similarity algorithm
    └── dateSimilarity.js          # Date proximity scoring
```

---

## 4. Middleware Stack

```js
// server.js
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging (dev)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/claims', claimRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler (must be last)
app.use(errorMiddleware);
```

### Auth Middleware (authMiddleware.js)

```js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    req.user = user;
    req.userId = user._id;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired' });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
    return res.status(500).json({ success: false, message: 'Auth error' });
  }
};
```

### Error Middleware (errorMiddleware.js)

```js
const errorMiddleware = (err, req, res, next) => {
  console.error('Error:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ success: false, message: messages.join(', ') });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({ success: false, message: `${field} already exists` });
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'Invalid ID format' });
  }

  // express-validator errors
  if (err.array) {
    return res.status(400).json({ success: false, message: err.array()[0].msg });
  }

  // Default
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
};
```

---

## 5. Controllers

### Auth Controller (authController.js)

```js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashed });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({
      success: true,
      data: { user: { id: user._id, name: user.name, email: user.email }, token },
    });
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.json({
      success: true,
      data: { user: { id: user._id, name: user.name, email: user.email }, token },
    });
  } catch (err) { next(err); }
};

exports.me = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json({ success: true, data: { user } });
  } catch (err) { next(err); }
};
```

### Item Controller (itemController.js)

```js
const Item = require('../models/Item');
const matchingService = require('../services/matchingService');

exports.createItem = async (req, res, next) => {
  try {
    const itemData = { ...req.body, userId: req.userId };
    const item = await Item.create(itemData);
    res.status(201).json({ success: true, data: { item } });
  } catch (err) { next(err); }
};

exports.getItems = async (req, res, next) => {
  try {
    const { search, type, category, location, status, date, page = 1, limit = 20 } = req.query;
    const query = { status: { $ne: 'RESOLVED' } };

    if (search) {
      query.$text = { $search: search };
    }
    if (type) query.type = type;
    if (category) query.category = category;
    if (location) query.location = { $regex: location, $options: 'i' };
    if (status) query.status = status;
    if (date) {
      const d = new Date(date);
      const nextDay = new Date(d.getTime() + 24 * 60 * 60 * 1000);
      query.date = { $gte: d, $lt: nextDay };
    }

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      Item.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).populate('userId', 'name'),
      Item.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: { items, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) } },
    });
  } catch (err) { next(err); }
};

exports.getItemById = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id).populate('userId', 'name email');
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

    // Never expose verificationAnswer
    const { verificationAnswer, ...safeItem } = item.toObject();
    res.json({ success: true, data: { item: safeItem } });
  } catch (err) { next(err); }
};

exports.updateItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    if (item.userId.toString() !== req.userId) return res.status(403).json({ success: false, message: 'Unauthorized' });

    Object.assign(item, req.body);
    await item.save();
    res.json({ success: true, data: { item } });
  } catch (err) { next(err); }
};

exports.deleteItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    if (item.userId.toString() !== req.userId) return res.status(403).json({ success: false, message: 'Unauthorized' });

    await item.deleteOne();
    res.json({ success: true, message: 'Item deleted' });
  } catch (err) { next(err); }
};

exports.getMatches = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

    const matches = await matchingService.findMatches(item);
    res.json({ success: true, data: { matches } });
  } catch (err) { next(err); }
};
```

### Claim Controller (claimController.js)

```js
const Claim = require('../models/Claim');
const Item = require('../models/Item');

exports.createClaim = async (req, res, next) => {
  try {
    const { itemId, answer } = req.body;
    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    if (item.type !== 'FOUND') return res.status(400).json({ success: false, message: 'Only FOUND items can be claimed' });
    if (item.status === 'RESOLVED') return res.status(400).json({ success: false, message: 'Item already resolved' });
    if (item.userId.toString() === req.userId) return res.status(400).json({ success: false, message: 'Cannot claim own item' });

    // Verify answer (case-insensitive, trimmed)
    const normalizedAnswer = answer.trim().toLowerCase();
    const normalizedCorrect = item.verificationAnswer.trim().toLowerCase();
    if (normalizedAnswer !== normalizedCorrect) {
      return res.status(400).json({ success: false, message: 'Incorrect verification answer' });
    }

    // Check duplicate claim
    const existing = await Claim.findOne({ itemId, claimantId: req.userId, status: 'PENDING' });
    if (existing) return res.status(400).json({ success: false, message: 'Claim already pending' });

    const claim = await Claim.create({
      itemId,
      claimantId: req.userId,
      answer: normalizedAnswer,
      status: 'PENDING',
    });

    // Update item status
    item.status = 'CLAIM_PENDING';
    await item.save();

    res.status(201).json({ success: true, data: { claim } });
  } catch (err) { next(err); }
};

exports.getMyClaims = async (req, res, next) => {
  try {
    const claims = await Claim.find({ claimantId: req.userId })
      .populate('itemId')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: { claims } });
  } catch (err) { next(err); }
};

exports.getClaimsForMyItems = async (req, res, next) => {
  try {
    const myItems = await Item.find({ userId: req.userId }).select('_id');
    const itemIds = myItems.map(i => i._id);
    const claims = await Claim.find({ itemId: { $in: itemIds } })
      .populate('itemId')
      .populate('claimantId', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: { claims } });
  } catch (err) { next(err); }
};

exports.approveClaim = async (req, res, next) => {
  try {
    const claim = await Claim.findById(req.params.id).populate('itemId');
    if (!claim) return res.status(404).json({ success: false, message: 'Claim not found' });
    if (claim.itemId.userId.toString() !== req.userId) return res.status(403).json({ success: false, message: 'Unauthorized' });
    if (claim.status !== 'PENDING') return res.status(400).json({ success: false, message: 'Claim not pending' });

    claim.status = 'APPROVED';
    await claim.save();

    claim.itemId.status = 'RESOLVED';
    await claim.itemId.save();

    res.json({ success: true, data: { claim } });
  } catch (err) { next(err); }
};

exports.rejectClaim = async (req, res, next) => {
  try {
    const claim = await Claim.findById(req.params.id).populate('itemId');
    if (!claim) return res.status(404).json({ success: false, message: 'Claim not found' });
    if (claim.itemId.userId.toString() !== req.userId) return res.status(403).json({ success: false, message: 'Unauthorized' });
    if (claim.status !== 'PENDING') return res.status(400).json({ success: false, message: 'Claim not pending' });

    claim.status = 'REJECTED';
    await claim.save();

    // Check if other pending claims exist
    const otherPending = await Claim.findOne({ itemId: claim.itemId._id, status: 'PENDING' });
    if (!otherPending) {
      claim.itemId.status = 'ACTIVE';
      await claim.itemId.save();
    }

    res.json({ success: true, data: { claim } });
  } catch (err) { next(err); }
};
```

---

## 6. Routes

### Auth Routes (authRoutes.js)

```js
const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8 }).withMessage('Password min 8 chars'),
], authController.register);

router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
], authController.login);

router.get('/me', authMiddleware, authController.me);

module.exports = router;
```

### Item Routes (itemRoutes.js)

```js
const express = require('express');
const { body, query, param } = require('express-validator');
const itemController = require('../controllers/itemController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Public
router.get('/', [
  query('search').optional().trim(),
  query('type').optional().isIn(['LOST', 'FOUND']),
  query('category').optional().trim(),
  query('location').optional().trim(),
  query('status').optional().isIn(['ACTIVE', 'CLAIM_PENDING', 'RESOLVED']),
  query('date').optional().isISO8601(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
], itemController.getItems);

router.get('/:id', [param('id').isMongoId()], itemController.getItemById);
router.get('/:id/matches', [param('id').isMongoId()], itemController.getMatches);

// Protected
router.post('/', authMiddleware, [
  body('title').trim().notEmpty().withMessage('Title required'),
  body('description').trim().notEmpty().withMessage('Description required'),
  body('category').trim().notEmpty().withMessage('Category required'),
  body('type').isIn(['LOST', 'FOUND']).withMessage('Type must be LOST or FOUND'),
  body('location').trim().notEmpty().withMessage('Location required'),
  body('date').isISO8601().withMessage('Valid date required'),
  body('verificationQuestion').if(body('type').equals('FOUND')).trim().notEmpty().withMessage('Verification question required for FOUND'),
  body('verificationAnswer').if(body('type').equals('FOUND')).trim().notEmpty().withMessage('Verification answer required for FOUND'),
], itemController.createItem);

router.put('/:id', authMiddleware, [param('id').isMongoId()], itemController.updateItem);
router.delete('/:id', authMiddleware, [param('id').isMongoId()], itemController.deleteItem);

module.exports = router;
```

### Claim Routes (claimRoutes.js)

```js
const express = require('express');
const { body, param } = require('express-validator');
const claimController = require('../controllers/claimController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, [
  body('itemId').isMongoId().withMessage('Valid itemId required'),
  body('answer').trim().notEmpty().withMessage('Answer required'),
], claimController.createClaim);

router.get('/', authMiddleware, claimController.getMyClaims);
router.get('/my-items', authMiddleware, claimController.getClaimsForMyItems);

router.put('/:id/approve', authMiddleware, [param('id').isMongoId()], claimController.approveClaim);
router.put('/:id/reject', authMiddleware, [param('id').isMongoId()], claimController.rejectClaim);

module.exports = router;
```

---

## 7. Server Entry (server.js)

```js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');
const claimRoutes = require('./routes/claimRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/claims', claimRoutes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// 404
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

// Error handler
app.use(errorMiddleware);

// DB & Start
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGTERM', async () => {
  await mongoose.connection.close();
  process.exit(0);
});
```

---

## 8. Environment Variables (.env)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/lostlink

# Auth
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRES_IN=24h

# Frontend
CLIENT_URL=http://localhost:5173

# Cloudinary (optional)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

## 9. Key Implementation Notes

1. **Never expose verificationAnswer** — Explicitly excluded in `getItemById`
2. **Ownership checks** — Every mutating operation verifies `userId`
3. **Server-side verification** — Answer compared in controller, never sent to client
4. **Text search** — Uses MongoDB `$text` index on title, description, category, location
5. **Indexes** — Compound indexes for common query patterns (see 05-Database-Design.md)
6. **Validation** — Both express-validator (request) and Mongoose (schema)
7. **Error handling** — Centralized, consistent response format