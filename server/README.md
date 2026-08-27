# LostLink — Server

REST API backend for the LostLink campus Lost-and-Found platform.

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 20+ | Runtime |
| Express | 5.2 | Web framework (async error handling) |
| Mongoose | 9.9 | MongoDB ODM |
| JWT | 9.0 | Authentication tokens |
| bcryptjs | 3.0 | Password hashing |
| express-rate-limit | 7.5 | Auth endpoint throttling |

## Setup

```bash
npm install
cp .env.example .env   # configure MONGO_URI, JWT_SECRET, CLIENT_URL
npm run dev
```

Server runs on `http://localhost:5000`. Health check: `GET /api/health`.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGO_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | JWT signing secret (min 32 chars) |
| `PORT` | No | Server port (default: 5000) |
| `CLIENT_URL` | No | Comma-separated allowed CORS origins |

## Project Structure

```
server/
├── config/
│   └── db.js              # MongoDB connection
├── models/
│   ├── User.js            # User schema (student/admin roles)
│   ├── Item.js            # Item schema (35+ fields, 9 statuses)
│   └── Claim.js           # Claim schema (PENDING/APPROVED/REJECTED)
├── controllers/
│   ├── authController.js  # Register, login, getMe
│   ├── itemController.js  # CRUD, search, batch endpoints
│   └── claimController.js # Claims, approve, reject
├── routes/
│   ├── authRoutes.js
│   ├── itemRoutes.js
│   └── claimRoutes.js
├── services/
│   └── matchingService.js # Weighted similarity algorithm
├── middleware/
│   ├── authMiddleware.js  # JWT verification
│   ├── errorHandler.js    # Global error handler
│   └── rateLimiter.js     # express-rate-limit config
├── utils/
│   └── helpers.js         # escapeRegex, serializeItem, parsePageLimit
├── server.js              # Express entry point
└── .env                   # (gitignored)
```

## API Reference

### Authentication

Rate limited: 20 requests / 15 minutes.

| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| POST | /api/auth/register | `{ name, email, password }` | `{ token, user }` |
| POST | /api/auth/login | `{ email, password }` | `{ token, user }` |
| GET | /api/auth/me | — | `{ token: null, user }` |

All auth responses share the shape `{ success, data: { token, user: { id, name, email, role } } }`.

### Items

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/items | Yes | Create item |
| GET | /api/items | No | List/search items |
| GET | /api/items/:id | No | Get item details |
| PUT | /api/items/:id | Yes (owner) | Update item |
| DELETE | /api/items/:id | Yes (owner) | Delete item |
| GET | /api/items/mine | Yes | Get current user's items |
| GET | /api/items/my-matches | Yes | Get matches across user's items |
| GET | /api/items/:id/matches | No | Get matches for specific item |

**Query parameters for GET /api/items:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | string | Search title, description, category, location, brand |
| `type` | string | LOST or FOUND |
| `category` | string | One of the defined categories |
| `location` | string | Filter by location |
| `status` | string | Filter by status |
| `date` | string | Filter by date (ISO format) |
| `page` | number | Page number (default: 1) |
| `limit` | number | Results per page (default: 12, max: 100) |

### Claims

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/claims | Yes | Submit claim (requires correct verification answer) |
| GET | /api/claims/mine | Yes | Get user's submitted claims |
| GET | /api/claims/incoming | Yes | Get claims on user's found items |
| PATCH | /api/claims/:id/approve | Yes (finder) | Approve claim |
| PATCH | /api/claims/:id/reject | Yes (finder) | Reject claim |

### Claim Flow

```
POST /api/claims { itemId, answer }
  → Backend verifies answer (case-insensitive, trimmed)
  → Correct: claim created as PENDING, item → CLAIM_PENDING
  → Incorrect: 400 "Incorrect verification answer"

PATCH /api/claims/:id/approve
  → Only item owner can approve
  → Claim → APPROVED, item → RESOLVED
  → All other pending claims on same item → REJECTED

PATCH /api/claims/:id/reject
  → Only item owner can reject
  → Claim → REJECTED
  → Item → ACTIVE (unless another claim is already APPROVED)
```

## Matching Algorithm

Located in `services/matchingService.js`.

| Factor | Weight | Logic |
|--------|--------|-------|
| Category | 30 | Exact match = 30, else 0 |
| Location | 25 | Jaccard similarity on normalized tokens; thresholds at 0.7, 0.4 |
| Description | 25 | Jaccard similarity on keyword tokens (stop words filtered) |
| Date | 20 | Same day = 20, 1 day = 15, 2 days = 10, 3 days = 5 |

**Threshold:** 60 points minimum to appear in results.
**Limit:** Top 5 matches returned.
**Opposite types only:** LOST items match against FOUND items and vice versa.
**Resolved items excluded** from candidate pool.

## Data Models

### User

| Field | Type | Notes |
|-------|------|-------|
| name | String | Required |
| email | String | Required, unique, lowercase |
| password | String | bcrypt hashed, select: false |
| role | String | `student` or `admin` |

### Item

| Field | Type | Notes |
|-------|------|-------|
| title | String | Required, max 100 chars |
| description | String | Required, max 2000 chars |
| category | String | Enum: 9 categories |
| type | String | LOST or FOUND |
| location | String | Required, max 200 chars |
| date | Date | Required |
| brand | String | Optional, max 100 chars |
| model | String | Optional |
| color | String | Optional |
| distinctiveFeatures | String | Optional, max 500 chars |
| verificationQuestion | String | For FOUND items |
| verificationAnswer | String | Hidden from public responses (`select: false`) |
| status | String | 9 possible values |
| userId | ObjectId | Reference to User |
| photos | [String] | Array of image URLs |
| securityInfo | Object | deviceLocked, cardBlocked, idReported, otherMeasures |
| contactName/Phone/Email | String | Private, owner-only |
| privacySettings | Object | Controls field visibility |
| notifications | Object | inApp, email, sms |

**Database indexes:** type+status, category, location, date, userId, createdAt.

### Claim

| Field | Type | Notes |
|-------|------|-------|
| itemId | ObjectId | Reference to Item |
| claimantId | ObjectId | Reference to User |
| answer | String | The submitted answer |
| status | String | PENDING, APPROVED, REJECTED |

## Security

- Passwords hashed with bcryptjs
- JWT tokens expire after 7 days
- Verification answers never returned in public API responses
- Owner-only fields (serial, IMEI, contact, security) only serialized for item owners
- Regex injection prevented via `escapeRegex()` utility
- Auth endpoints rate-limited (20 req/15 min)
- CORS restricted to configured `CLIENT_URL` origins
- Global error handler catches unhandled errors
- MongoDB connection failure exits process with code 1

## Deployment

1. Set `MONGO_URI` to MongoDB Atlas connection string
2. Set `JWT_SECRET` to a strong random string (min 32 chars)
3. Set `CLIENT_URL` to your frontend URL(s), comma-separated
4. Run `npm start` (runs `node server.js`)
