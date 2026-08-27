# LostLink — Client

React frontend for the LostLink campus Lost-and-Found platform.

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2 | UI library |
| Vite | 8.2 | Build tool and dev server |
| Tailwind CSS | 4.3 | Utility-first styling |
| React Router | 7.18 | Client-side routing |
| Axios | 1.20 | HTTP client |
| Lucide React | 1.34 | Icon library |

## Setup

```bash
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`. In dev mode, Vite proxies `/api` requests to `http://localhost:5000`.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL. Leave empty in dev (Vite proxy handles `/api`). Set in production (e.g. `https://lostlink-api.onrender.com/api`) |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run oxlint linter |

## Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Top navigation with auth state
│   │   ├── ItemCard.jsx        # Item preview card for lists
│   │   ├── MatchCard.jsx       # Match result card with score
│   │   ├── ClaimCard.jsx       # Claim status card
│   │   ├── ClaimModal.jsx      # Claim submission modal
│   │   ├── SearchBar.jsx       # Search input
│   │   ├── FilterPanel.jsx     # Type/category/status/date filters
│   │   ├── StatusBadge.jsx     # Color-coded status labels
│   │   ├── StatCard.jsx        # Dashboard stat display
│   │   ├── LoadingState.jsx    # Reusable loading spinner
│   │   ├── EmptyState.jsx      # Empty list placeholder
│   │   ├── ProtectedRoute.jsx  # Auth route guard
│   │   ├── ErrorBoundary.jsx   # React error boundary
│   │   └── Logo.jsx            # LostLink logo component
│   ├── pages/
│   │   ├── Home.jsx            # Landing page with hero + recent items
│   │   ├── Login.jsx           # Login form
│   │   ├── Register.jsx        # Registration form
│   │   ├── BrowseItems.jsx     # Search + filter + item grid
│   │   ├── ReportItem.jsx      # 10-step multi-step report form
│   │   ├── ItemDetails.jsx     # Full item view with matches
│   │   ├── MyReports.jsx       # User's own reports
│   │   ├── Matches.jsx         # Matches across user's items
│   │   ├── Claims.jsx          # Outgoing + incoming claims
│   │   ├── Dashboard.jsx       # Stats overview
│   │   └── NotFound.jsx        # 404 page
│   ├── context/
│   │   └── AuthContext.jsx     # Auth state (user, token, login/logout)
│   ├── services/
│   │   ├── api.js              # Axios instance with interceptors
│   │   ├── authService.js      # Auth API calls
│   │   ├── itemService.js      # Items API calls
│   │   ├── claimService.js     # Claims API calls
│   │   └── matchService.js     # Matches API calls
│   ├── utils/
│   │   ├── constants.js        # Categories, statuses, form steps
│   │   └── formatDate.js       # Date formatting utilities
│   ├── index.css               # Tailwind v4 config + design tokens
│   ├── App.jsx                 # Router + route definitions
│   └── main.jsx                # Entry point
├── public/
├── .env.example
├── vite.config.js
└── package.json
```

## Pages

| Route | Page | Auth Required | Description |
|-------|------|---------------|-------------|
| `/` | Home | No | Hero section + recently reported items |
| `/login` | Login | No | Email/password login |
| `/register` | Register | No | Name/email/password registration |
| `/items` | BrowseItems | No | Search + filter all items |
| `/items/:id` | ItemDetails | No | Full item details + matches |
| `/report` | ReportItem | Yes | Multi-step report form |
| `/my-reports` | MyReports | Yes | User's own reported items |
| `/matches` | Matches | Yes | Potential matches across user's items |
| `/claims` | Claims | Yes | Outgoing + incoming claims |
| `/dashboard` | Dashboard | Yes | Stats overview |

## Design System

Defined in `src/index.css` using Tailwind v4 CSS variables:

| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#09090B` | Page background |
| `--surface` | `#18181B` | Card backgrounds |
| `--surface-elevated` | `#27272A` | Elevated cards, inputs |
| `--border` | `#27272A` | Borders, dividers |
| `--primary` | `#818CF8` | Buttons, links, accents |
| `--text` | `#FAFAFA` | Primary text |
| `--secondary-text` | `#A1A1AA` | Secondary text |
| `--muted` | `#71717A` | Muted text |
| `--success` | `#34D399` | Success states |
| `--warning` | `#FBBF24` | Warning states |
| `--error` | `#F87171` | Error states |

Typography: Inter (UI), JetBrains Mono (technical). 8px spacing rhythm.

## Key Features

### 10-Step Report Form (`ReportItem.jsx`)

1. Report Type (Lost/Found)
2. Basic Info (title, category)
3. Description
4. Item Details (brand, model, color, size)
5. Date & Time
6. Location
7. Identification (serial, IMEI, markings)
8. Photos & Proof
9. Ownership & Security (FOUND items get verification question)
10. Review & Submit

Per-step validation. File upload with image previews.

### Smart Filtering (`FilterPanel.jsx`)

- Type filter (LOST/FOUND tabs)
- Category dropdown
- Status dropdown (ACTIVE, CLAIM_PENDING, RESOLVED, etc.)
- Date filter
- Collapsible on mobile with toggle

### Batch API Calls

Dashboard, Matches, and Claims pages use batch endpoints (`/items/mine`, `/items/my-matches`, `/claims/incoming`) to minimize API requests.

### Auth Interceptors (`api.js`)

- **Request:** Attaches JWT from `localStorage` (`lostlink_token`)
- **Response:** On 401, clears token and redirects to `/login`
- **Error normalization:** All errors rejected as `{ message, status }`

### Error Handling

- `ErrorBoundary` wraps the app for React rendering errors
- `ProtectedRoute` redirects unauthenticated users to `/login`
- `NotFound` uses React Router `<Link>` for client-side navigation

## Deployment

1. Set `VITE_API_URL` in `.env` to your deployed backend URL
2. Run `npm run build` — outputs to `dist/`
3. Deploy `dist/` to any static host (Vercel, Netlify, Cloudflare Pages)
4. For SPA routing, configure host to redirect all routes to `index.html`
