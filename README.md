# LostLink

**Smart Campus Lost & Found Platform**

LostLink is a full-stack MERN application that helps students report, search, match, verify, and recover lost belongings on campus. It uses weighted similarity matching to connect LOST and FOUND reports and secure ownership verification to confirm claims.

---

## Objective

On most campuses, lost-and-found relies on physical notice boards, word of mouth, or scattered social media posts. There is no centralized system where students can report lost items, discover found items, and get automatically notified of possible matches.

**LostLink** solves this by providing a single platform that centralizes reports, applies smart matching to surface potential matches, and enforces a verification workflow before any item changes hands.

---

## Problem Statement

- Lost items are reported in disconnected channels (WhatsApp groups, notice boards, social media).
- Found items sit unclaimed because the owner never sees the post.
- There is no structured way to match a lost report with a found report.
- There is no verification mechanism to confirm ownership before handoff.
- Students waste time and items go unreturned.

---

## Solution

LostLink introduces a structured, campus-wide lost-and-found workflow:

1. **Report** — Students report lost or found items with detailed information (category, location, description, date, distinguishing features).
2. **Search & Filter** — Other students can search and filter reports server-side by title, category, location, date, and status.
3. **Smart Matching** — A weighted similarity algorithm automatically compares LOST and FOUND reports across category (30%), location (25%), description (25%), and date (20%) to surface high-confidence matches.
4. **Claim & Verify** — A claimant must answer a verification question set by the finder. The answer is verified server-side and never exposed to the frontend.
5. **Approve & Resolve** — The finder approves or rejects the claim. Approved claims mark the item as recovered.

---

## Key Features

| Feature | Description |
|---------|-------------|
| User Authentication | Register, login, JWT-based session management with bcrypt password hashing |
| Lost & Found Reporting | Multi-step form with item details, distinguishing features, photos, ownership proof, and contact preferences |
| Smart Search | Server-side search by title, description, category, location, and brand |
| Advanced Filters | Filter by type (LOST/FOUND), category, status, and date |
| Weighted Matching | Category 30%, Location 25%, Description 25%, Date 20% — with match strength labels |
| Ownership Verification | Finder-set verification question; answer verified server-side, never exposed to frontend |
| Claim Workflow | Claim → Pending → Finder approves/rejects → Resolved or Active |
| Dashboard | Overview of reports, matches, claims, and recovered items |
| Responsive UI | Mobile-first design with collapsible filters and adaptive layouts |
| Rate Limiting | Auth endpoints rate-limited to 20 requests per 15 minutes |

---

## Technologies

### Frontend

| Technology | Purpose |
|------------|---------|
| React 19 | UI library |
| Vite 8 | Build tool and dev server |
| Tailwind CSS 4 | Utility-first styling |
| React Router 7 | Client-side routing |
| Axios | HTTP client with interceptors |
| Lucide React | Icon library |

### Backend

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express 5 | Web framework (async error handling built-in) |
| Mongoose 9 | MongoDB ODM |
| JWT | Authentication tokens |
| bcryptjs | Password hashing |
| express-rate-limit | Auth endpoint rate limiting |

### Database

| Technology | Purpose |
|------------|---------|
| MongoDB | Primary database |
| MongoDB Atlas | Cloud-hosted option |

---

## Implementation Details

### Matching Algorithm

LostLink uses a deterministic weighted scoring system:

| Factor | Weight | Scoring |
|--------|--------|---------|
| Category | 30% | Same category = 30, different = 0 |
| Location | 25% | Exact match = 25, similar = partial, different = 0 |
| Description | 25% | Jaccard keyword similarity (normalized, stop-word filtered) |
| Date | 20% | Same day = 20, 1 day apart = 15, 2 days = 10, 3 days = 5 |

**Match Strength Labels:**
- 90–100%: Very Strong Match
- 75–89%: Strong Match
- 60–74%: Possible Match
- Below 60%: Not displayed

Only opposite item types (LOST ↔ FOUND) are compared. Resolved items are excluded.

### Claim Verification Flow

```
User claims FOUND item
    ↓
Enters verification answer
    ↓
Backend verifies answer (never exposed to frontend)
    ↓
Correct → Claim PENDING
    ↓
Finder approves → Claim APPROVED → Item RESOLVED
Finder rejects  → Claim REJECTED  → Item ACTIVE
```

### Security Measures

- Passwords hashed with bcryptjs
- JWT authentication on protected routes
- Verification answers never returned in API responses
- Regex injection prevention on search queries
- Rate limiting on authentication endpoints
- Owner-only access to sensitive item fields
- CORS restricted to configured origins

### Item Status Lifecycle

```
ACTIVE → CLAIM_PENDING → RESOLVED
                       → ACTIVE (if rejected)
```

Additional statuses: POTENTIAL_MATCH, FOUND, CLAIMED, RETURNED, CLOSED.

---

## Local Setup

### Prerequisites

- Node.js 20+
- MongoDB (local via MongoDB Compass or MongoDB Atlas)

### 1. Clone & Install

```bash
git clone <repository-url>
cd LostLink

# Backend
cd server && npm install

# Frontend
cd ../client && npm install
```

### 2. Environment Variables

```bash
cp .env.example server/.env
cp client/.env.example client/.env
```

Edit `server/.env`:

```
MONGO_URI=mongodb://localhost:27017/lostlink
JWT_SECRET=your-secret-here-min-32-chars
PORT=5000
CLIENT_URL=http://localhost:5173
```

Edit `client/.env` (optional — Vite proxy handles /api in dev):

```
VITE_API_URL=
```

### 3. Start Development

```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Health check: http://localhost:5000/api/health

---

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/register | Register new user | No |
| POST | /api/auth/login | Login | No |
| GET | /api/auth/me | Get current user | Yes |

### Items

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/items | Create item | Yes |
| GET | /api/items | List items (search/filter/pagination) | No |
| GET | /api/items/:id | Get item details | No |
| PUT | /api/items/:id | Update item | Yes (owner) |
| DELETE | /api/items/:id | Delete item | Yes (owner) |
| GET | /api/items/mine | Get user's items | Yes |
| GET | /api/items/my-matches | Get matches for user's items | Yes |
| GET | /api/items/:id/matches | Get matches for item | No |

### Claims

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/claims | Submit claim | Yes |
| GET | /api/claims/mine | Get user's claims | Yes |
| GET | /api/claims/incoming | Get claims on user's items | Yes |
| PATCH | /api/claims/:id/approve | Approve claim | Yes (finder) |
| PATCH | /api/claims/:id/reject | Reject claim | Yes (finder) |

---

## Project Structure

```
LostLink/
├── client/
│   ├── src/
│   │   ├── components/     # Navbar, ItemCard, MatchCard, FilterPanel, etc.
│   │   ├── pages/          # Home, Login, Register, BrowseItems, ItemDetails,
│   │   │                   # ReportItem, MyReports, Matches, Claims, Dashboard
│   │   ├── context/        # AuthContext
│   │   ├── services/       # api.js, authService, itemService, claimService
│   │   └── utils/          # constants, formatDate
│   ├── .env.example
│   └── package.json
├── server/
│   ├── config/             # db.js
│   ├── models/             # User.js, Item.js, Claim.js
│   ├── controllers/        # authController, itemController, claimController
│   ├── routes/             # authRoutes, itemRoutes, claimRoutes
│   ├── services/           # matchingService.js
│   ├── middleware/          # authMiddleware, errorHandler, rateLimiter
│   ├── utils/              # helpers.js
│   ├── .env.example
│   └── server.js
├── .env.example
├── .gitignore
├── ARCHITECTURE.md
├── DESIGN.md
├── AGENTS.md
├── PRD.md
└── README.md
```

---

## Future Scope

| Enhancement | Description |
|-------------|-------------|
| AI Image Similarity | Use computer vision to match item photos |
| OCR for IDs | Extract text from ID cards found with items |
| Semantic Text Embeddings | Replace keyword matching with embedding-based similarity |
| Email/SMS Notifications | Alert students when a potential match is found |
| QR-based Item Tags | Generate QR codes for items to speed up identification |
| Multi-campus Support | Extend to multiple institutions |
| Mobile Application | React Native companion app |
| Push Notifications | Real-time match alerts |

---

## References

- [MongoDB Documentation](https://www.mongodb.com/docs/)
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [JSON Web Tokens](https://jwt.io/introduction)

---

## License

MIT
