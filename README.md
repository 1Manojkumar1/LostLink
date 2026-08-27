# LostLink

Smart Campus Lost & Found Platform

LostLink is a MERN-stack campus Lost-and-Found platform that helps students report, discover, match, verify, and recover lost belongings. It uses weighted similarity matching to connect LOST and FOUND reports and secure ownership verification to confirm claims.

## Features

- **Authentication** — Register, login, JWT-based session management
- **Lost & Found Reporting** — Report lost or found items with category, location, date, and description
- **Search & Filtering** — Server-side search by title, description, category, location with type/category/status filters
- **Smart Matching** — Weighted similarity scoring (category 30%, location 25%, description 25%, date 20%) with match strength labels and reasons
- **Ownership Verification** — Found items require a verification question; claimants must answer correctly
- **Claims & Recovery** — Claim flow with finder approval/rejection, automatic item resolution
- **Dashboard** — Overview of reports, matches, claims, and recovered items

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, React Router, Axios, Lucide React
- **Backend:** Node.js, Express.js, Mongoose
- **Database:** MongoDB
- **Auth:** JWT, bcryptjs

## Architecture

```
React (Vite)
    ↓
Axios → Express REST API
            ↓
        Mongoose → MongoDB
```

## Local Setup

### Prerequisites

- Node.js 20+
- MongoDB (local or Atlas)

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
```

Edit `server/.env`:

```
MONGO_URI=mongodb://localhost:27017/lostlink
JWT_SECRET=your-secret-here
PORT=5000
CLIENT_URL=http://localhost:5173
```

### 3. Start Development

```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

- Backend: http://localhost:5000
- Frontend: http://localhost:5173
- Health check: http://localhost:5000/api/health

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |

### Items

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/items | Create item (auth) |
| GET | /api/items | List items (search/filter/pagination) |
| GET | /api/items/:id | Get item details |
| PUT | /api/items/:id | Update item (owner) |
| DELETE | /api/items/:id | Delete item (owner) |
| GET | /api/items/mine | Get user's items (auth) |
| GET | /api/items/:id/matches | Get matches for item |

### Claims

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/claims | Submit claim (auth) |
| GET | /api/claims/mine | Get user's claims (auth) |
| GET | /api/claims/item/:itemId | Get claims on item (owner) |
| PATCH | /api/claims/:id/approve | Approve claim (finder) |
| PATCH | /api/claims/:id/reject | Reject claim (finder) |

## Matching Algorithm

LostLink uses a weighted scoring system to match LOST and FOUND items:

| Factor | Weight | Scoring |
|--------|--------|---------|
| Category | 30% | Same = 30, different = 0 |
| Location | 25% | Exact = 25, similar = partial, different = 0 |
| Description | 25% | Keyword Jaccard similarity |
| Date | 20% | Same day = 20, 1 day = 15, 2 days = 10, 3 days = 5 |

**Match Strength:**
- 90-100%: Very Strong Match
- 75-89%: Strong Match
- 60-74%: Possible Match
- Below 60%: Not displayed

Only opposite item types (LOST ↔ FOUND) are compared. Resolved items are excluded.

## Claim Verification Flow

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

## Project Structure

```
LostLink/
├── client/
│   └── src/
│       ├── components/    # Navbar, ItemCard, MatchCard, ClaimCard, ClaimModal, etc.
│       ├── pages/         # Home, Login, Register, BrowseItems, ItemDetails,
│       │                  # ReportItem, MyReports, Matches, Claims, Dashboard, NotFound
│       ├── services/      # api.js, authService, itemService, matchService, claimService
│       ├── context/       # AuthContext
│       └── index.css      # Tailwind + design tokens
├── server/
│   ├── config/            # db.js
│   ├── models/            # User.js, Item.js, Claim.js
│   ├── controllers/       # authController, itemController, claimController
│   ├── routes/            # authRoutes, itemRoutes, claimRoutes
│   ├── services/          # matchingService.js
│   ├── middleware/         # authMiddleware.js
│   └── server.js
├── .env.example
├── .gitignore
└── README.md
```

## License

MIT
