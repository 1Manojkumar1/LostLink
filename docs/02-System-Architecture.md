# 02 — System Architecture

> High-level architecture for the LostLink smart campus Lost-and-Found platform.

---

## 1. Architecture Overview

LostLink follows a **modular monolithic MERN architecture**. The frontend and backend are separate deployable units communicating via REST API. All shared state lives in MongoDB. The matching engine runs in-process as a service — no separate microservices, message queues, or external AI dependencies for the MVP.

```
┌─────────────────────────────────────────────────────────────┐
│                        USERS                                 │
│              Students / Campus Staff                         │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                     REACT FRONTEND                          │
│              Vite + React Router + Tailwind CSS             │
│                                                              │
│   Home  •  Login/Register  •  Browse  •  Report             │
│   Item Details  •  Matches  •  Dashboard                    │
└──────────────────────────┬──────────────────────────────────┘
                           │
                      HTTP / REST
                           │
                        Axios
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    EXPRESS REST API                         │
│                      Node.js + Express.js                   │
│                                                              │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│   │  Auth    │  │  Items   │  │  Claims  │                 │
│   │ Routes   │  │ Routes   │  │ Routes   │                 │
│   └────┬─────┘  └────┬─────┘  └────┬─────┘                 │
│        │             │             │                        │
│        ▼             ▼             ▼                        │
│   ┌──────────────────────────────────────┐                 │
│   │           MIDDLEWARE                  │                 │
│   │  Auth  •  Validation  •  Error       │                 │
│   └──────────────────┬───────────────────┘                 │
│                      │                                      │
│        ┌─────────────┼─────────────┐                        │
│        ▼             ▼             ▼                        │
│   ┌─────────┐  ┌───────────┐ ┌──────────┐                  │
│   │ Auth    │  │  Item     │ │  Claim   │                  │
│   │ Service │  │  Service  │ │ Service  │                  │
│   └────┬────┘  └─────┬─────┘ └────┬─────┘                  │
│        │             │            │                          │
│        │      ┌──────┴──────┐     │                          │
│        │      ▼             ▼     │                          │
│        │ ┌─────────┐  ┌─────────┐ │                          │
│        │ │ Matching│  │  Text/  │ │                          │
│        │ │ Service │  │  Date   │ │                          │
│        │ │         │  │  Utils  │ │                          │
│        │ └────┬────┘  └────┬────┘ │                          │
│        └───┼──────────────┼──────┘                          │
│            │              │                                 │
│            ▼              ▼                                 │
│      ┌──────────────────────────┐                           │
│      │         MONGOOSE         │                           │
│      └───────────┬──────────────┘                           │
│                  │                                          │
│                  ▼                                          │
│      ┌──────────────────────────┐                           │
│      │       MONGODB ATLAS      │                           │
│      │                          │                           │
│      │  users  •  items  •  claims                         │
│      └──────────────────────────┘                           │
│                                                              │
│      Optional:                                              │
│      ┌──────────────────────────┐                           │
│      │      CLOUDINARY          │                           │
│      │    Item Images (URLs)    │                           │
│      └──────────────────────────┘                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Architecture Principles

| Principle | Application |
|-----------|-------------|
| **Simplicity First** | Use simplest tech that solves requirement. No microservices, GraphQL, Redis, Kafka, Elasticsearch, vector DBs for MVP. |
| **Separation of Concerns** | Routes → Controllers → Services → Models. Matching logic in dedicated service. |
| **Security by Default** | Auth, authorization, validation, claim verification on backend. Never trust frontend userId. |
| **API-First Communication** | Frontend ↔ Backend via REST. Axios for HTTP. |
| **MVP Before Advanced** | Core workflow complete before optional features (images, admin, notifications). |
| **Backend Filtering** | Search/filter in MongoDB queries, not client-side. |

---

## 3. Technology Stack

| Layer | Technology | Version | Rationale |
|-------|------------|---------|-----------|
| **Frontend Framework** | React | 18.x | Mature, ecosystem, hooks |
| **Build Tool** | Vite | 5.x | Fast HMR, ESM-native |
| **Styling** | Tailwind CSS | 3.x | Utility-first, design tokens, no CSS files |
| **Routing** | React Router | 6.x | Client-side routing, nested routes |
| **HTTP Client** | Axios | 1.x | Interceptors, request/response handling |
| **State** | React Context API | — | Auth state only, no Redux |
| **Icons** | Lucide React | 0.4xx | Consistent monoline, tree-shakeable |
| **Backend Runtime** | Node.js | 20+ LTS | Non-blocking I/O |
| **Backend Framework** | Express.js | 4.x | Mature, middleware pattern |
| **Database** | MongoDB | 7.x | Flexible schema, Atlas free tier |
| **ODM** | Mongoose | 8.x | Schema validation, middleware |
| **Auth** | JWT + bcryptjs | — | Stateless auth, secure passwords |
| **Validation** | express-validator | 7.x | Request validation middleware |
| **Image Storage** | Cloudinary | — | Free tier, CDN, transformations |

---

## 4. Repository Structure

```
LostLink/
├── client/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── ItemCard.jsx
│       │   ├── SearchBar.jsx
│       │   ├── FilterPanel.jsx
│       │   ├── MatchCard.jsx
│       │   ├── ClaimModal.jsx
│       │   └── StatusBadge.jsx
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── BrowseItems.jsx
│       │   ├── ReportItem.jsx
│       │   ├── ItemDetails.jsx
│       │   ├── Matches.jsx
│       │   └── Dashboard.jsx
│       ├── context/
│       │   └── AuthContext.jsx
│       ├── services/
│       │   ├── api.js
│       │   ├── authService.js
│       │   ├── itemService.js
│       │   └── claimService.js
│       ├── hooks/
│       ├── utils/
│       ├── App.jsx
│       └── main.jsx
│   └── package.json
├── server/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Item.js
│   │   └── Claim.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── itemController.js
│   │   └── claimController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── itemRoutes.js
│   │   └── claimRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── validationMiddleware.js
│   ├── services/
│   │   └── matchingService.js
│   ├── utils/
│   │   ├── textSimilarity.js
│   │   └── dateSimilarity.js
│   ├── server.js
│   └── package.json
├── docs/
├── .gitignore
├── README.md
└── AGENTS.md
```

---

## 5. Data Flow Overview

### Item Reporting Flow
```
ReportItem.jsx → itemService.createItem() → Axios POST /api/items
→ Auth Middleware → Validation → itemController.createItem()
→ Item Model → MongoDB → Response → Frontend → Success
```

### Search/Filter Flow
```
BrowseItems.jsx → SearchBar/FilterPanel → itemService.getItems(params)
→ Axios GET /api/items?search=&type=&category=...
→ itemController.getItems() → MongoDB Query → Filtered Results
→ ItemCard components
```

### Matching Flow
```
ItemDetails.jsx → GET /api/items/:id/matches
→ itemController.getMatches() → matchingService.findMatches(item)
→ MongoDB: find opposite-type active items
→ Calculate scores (category, location, description, date)
→ Filter ≥60%, sort desc → Return matches → MatchCard
```

### Claim Verification Flow
```
ClaimModal → User enters answer → POST /api/claims
→ Auth Middleware → claimController.createClaim()
→ Find item → Verify answer (server-side) → Create Claim (PENDING)
→ Finder Dashboard → Approve/Reject → Item status update
```

---

## 6. Key Architectural Decisions

| Decision | Rationale | ADR |
|----------|-----------|-----|
| MERN stack | Team familiarity, hackathon speed | ADR-001 |
| REST over GraphQL | Simpler, sufficient for CRUD + matching | ADR-002 |
| In-process matching service | No external deps, deterministic, fast | ADR-003 |
| JWT + bcrypt | Stateless, secure, no session store | ADR-004 |
| Cloudinary for images | Free tier, CDN, no binary in MongoDB | ADR-005 |
| React Context for auth | Simple, no Redux needed | ADR-006 |
| Backend filtering | Scalable, avoids large client payloads | ADR-007 |
| Verification answer server-only | Security: prevent answer harvesting | ADR-008 |

---

## 7. Failure Modes & Mitigations

| Failure | Impact | Mitigation |
|---------|--------|------------|
| MongoDB Atlas unavailable | All writes/reads fail | Connection retry, graceful error UI |
| Cloudinary upload fails | Image not stored | Optional image, item still created |
| JWT secret compromised | Auth bypass | Rotate secret, short expiry (24h) |
| Matching service slow | Match API timeout | In-memory calc, single DB query, limit candidates |
| Invalid verification answer | Claim rejected | Clear error message, retry allowed |

---

## 8. Scalability Considerations (Post-MVP)

| Bottleneck | Current Approach | Future Upgrade |
|------------|------------------|----------------|
| Matching O(n) | Fetch all opposite-type, calc in memory | Elasticsearch / vector similarity |
| Large item lists | No pagination (hackathon scale) | Pagination + cursor-based |
| Single server | Monolithic | Horizontal scaling with load balancer |
| Image storage | Cloudinary free tier | S3 + CDN or Cloudinary paid |