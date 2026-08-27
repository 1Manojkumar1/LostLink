# 03 — Frontend Architecture

> React 18 + JavaScript + Vite 5 + Tailwind CSS 3

---

## 1. Technology Stack

| Layer | Choice | Version | Rationale |
|-------|--------|---------|-----------|
| **Framework** | React | 18.x | Hooks, concurrent features, ecosystem |
| **Language** | JavaScript | ES2022+ | Simplicity, no compile step |
| **Build** | Vite | 5.x | ESM-native, instant HMR, simple config |
| **Styling** | Tailwind CSS | 3.x | Utility-first, design tokens in config |
| **Routing** | React Router | 6.x | Client-side routing, code splitting |
| **Icons** | Lucide React | 0.4xx | Monoline, consistent, tree-shakeable |
| **HTTP** | Axios | 1.x | Interceptors, auth header management |
| **State** | React Context API | — | Auth only, no Redux needed |

### Why Not X

| Considered | Why Not |
|------------|---------|
| TypeScript | Plain JS for hackathon speed, simpler onboarding |
| Next.js | SPA sufficient, no SSR/SSG needed |
| Zustand/Redux | State is local; only auth is global |
| CSS Modules | Tailwind eliminates per-component CSS |

---

## 2. Project Structure

```
client/
├── index.html                     # Entry HTML, viewport, fonts
├── vite.config.js                 # React plugin, path aliases, proxy
├── tailwind.config.js             # Design tokens, dark mode
├── postcss.config.js              # Tailwind + autoprefixer
├── package.json
├── public/
│   └── favicon.svg                # LostLink logo
└── src/
    ├── main.jsx                   # React root, StrictMode, router
    ├── App.jsx                    # Routes, AuthProvider, layout
    ├── index.css                  # Tailwind imports, global styles
    │
    ├── context/
    │   └── AuthContext.jsx        # Auth state, login, logout, register
    │
    ├── services/
    │   ├── api.js                 # Axios instance, interceptors
    │   ├── authService.js         # register, login, me
    │   ├── itemService.js         # getItems, getItem, createItem, getMatches
    │   └── claimService.js        # createClaim, approveClaim, rejectClaim
    │
    ├── components/
    │   ├── Navbar.jsx             # Fixed top nav, user menu
    │   ├── ItemCard.jsx           # Item display (LOST/FOUND)
    │   ├── SearchBar.jsx          # Search input with icon
    │   ├── FilterPanel.jsx        # Type, category, location, date, status
    │   ├── MatchCard.jsx          # Match score, reasons, actions
    │   ├── ClaimModal.jsx         # Verification question, answer input
    │   ├── StatusBadge.jsx        # LOST/FOUND/CLAIM_PENDING/RESOLVED
    │   ├── Button.jsx             # Primary, ghost, surface, danger
    │   ├── Input.jsx              # Form input with label, error
    │   ├── Modal.jsx              # Reusable modal wrapper
    │   ├── EmptyState.jsx         # No results, actionable
    │   ├── LoadingState.jsx       # Skeletons, spinners
    │   └── StatCard.jsx           # Dashboard metric card
    │
    ├── pages/
    │   ├── Home.jsx               # Landing: hero, search, recent items
    │   ├── Login.jsx              # Email/password, link to register
    │   ├── Register.jsx           # Name/email/password, validation
    │   ├── BrowseItems.jsx        # Grid + search + filters + pagination
    │   ├── ReportItem.jsx         # Unified LOST/FOUND form
    │   ├── ItemDetails.jsx        # Image, info, matches, claim action
    │   ├── Matches.jsx            # List of possible matches
    │   └── Dashboard.jsx          # Stats, my items, matches, claims
    │
    ├── hooks/
    │   ├── useAuth.js             # AuthContext consumer
    │   ├── useItems.js            # Item fetch/state
    │   └── useDebounce.js         # Search debounce
    │
    └── utils/
        ├── formatDate.js          # Date formatting
        ├── formatMatchScore.js    # Score badge color/label
        └── cn.js                  # clsx + tailwind-merge helper
```

---

## 3. Routing

| Route | Component | Auth Required | Purpose |
|-------|-----------|---------------|---------|
| `/` | Home | No | Landing, hero, recent items |
| `/login` | Login | No | Authentication |
| `/register` | Register | No | Account creation |
| `/items` | BrowseItems | No | Search, filter, browse |
| `/items/:id` | ItemDetails | No | Item info, matches, claim |
| `/report` | ReportItem | Yes | Create LOST/FOUND |
| `/matches` | Matches | Yes | User's possible matches |
| `/dashboard` | Dashboard | Yes | My items, claims, recovered |
| `/admin` | AdminDashboard | Admin | Optional admin panel |

```jsx
// App.jsx
<BrowserRouter>
  <AuthProvider>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/items" element={<BrowseItems />} />
      <Route path="/items/:id" element={<ItemDetails />} />
      <Route path="/report" element={<ProtectedRoute><ReportItem /></ProtectedRoute>} />
      <Route path="/matches" element={<ProtectedRoute><Matches /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    </Routes>
  </AuthProvider>
</BrowserRouter>
```

---

## 4. Component Architecture

### Pattern: Page Components
- Default exports
- Compose reusable components
- Handle data fetching via services
- Manage local UI state (modals, filters, forms)

### Pattern: Reusable Components
- Single responsibility
- Props for variants (type, size, state)
- No direct API calls — receive data via props
- Tailwind only, no CSS files

### Pattern: Service Layer
- All API calls in `services/*.js`
- Components call service functions
- Services handle Axios, errors, transform responses

### State Management

**Global (Context):**
- `user` — current user object
- `isAuthenticated` — boolean
- `login()`, `logout()`, `register()` — auth actions

**Local (useState/useReducer):**
- Form inputs
- Search query, filters
- Modal visibility
- Loading/error states
- Pagination

---

## 5. Styling Architecture

### Tailwind Config (tailwind.config.js)

```js
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#09090B',
        surface: '#18181B',
        'surface-elevated': '#27272A',
        'surface-subtle': '#1C1C1F',
        border: '#27272A',
        'border-subtle': '#1C1C1F',
        text: '#FAFAFA',
        'text-secondary': '#A1A1AA',
        'text-muted': '#71717A',
        'text-disabled': '#52525B',
        primary: '#818CF8',
        'primary-hover': '#A5B4FC',
        'primary-dim': '#6366F1',
        success: '#34D399',
        warning: '#FBBF24',
        error: '#F87171',
        info: '#38BDF8',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        card: '12px',
        button: '8px',
        input: '8px',
        badge: '9999px',
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '48px',
      },
    },
  },
  plugins: [],
};
```

### Global Styles (index.css)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html { @apply bg-bg text-text antialiased; }
  body { @apply font-sans text-base leading-relaxed; }
  * { @apply border-border; }
  :focus-visible { @apply outline-none ring-2 ring-primary ring-offset-2 ring-offset-bg; }
}

@layer components {
  .card { @apply bg-surface border rounded-card p-lg; }
  .card-hover { @apply hover:bg-surface-subtle transition-colors duration-150; }
  .btn-primary { @apply bg-primary text-bg font-medium rounded-button px-md py-sm transition-colors hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed; }
  .btn-ghost { @apply border text-text-secondary rounded-button px-md py-sm hover:bg-surface-elevated hover:text-text transition-colors; }
  .btn-danger { @apply bg-error text-white font-medium rounded-button px-md py-sm hover:brightness-110; }
  .input { @apply bg-bg border rounded-input px-sm py-sm text-text placeholder:text-muted focus:border-primary focus:outline-none; }
  .badge { @apply px-xs py-[2px] rounded-badge text-badge font-medium uppercase tracking-wide; }
}
```

### Design Rules

1. **No CSS files per component** — Tailwind utilities only
2. **No inline styles** except dynamic values (e.g., `style={{ width: `${pct}%` }}`)
3. **Color tokens** — Use semantic names (`bg-surface`, `text-primary`), not raw hex
4. **Typography** — 14px body, JetBrains Mono for scores/IDs/timestamps
5. **Spacing** — 8px base unit, multiples only

---

## 6. Key Pages Detail

### Home (`/`)
- Hero: "LOST SOMETHING? FIND IT FASTER."
- Primary actions: Report Lost / Report Found
- Search bar (links to `/items`)
- Recently reported items (4-6 cards)

### Browse Items (`/items`)
- SearchBar (top, full width)
- FilterPanel (collapsible on mobile)
- ItemCard grid (responsive: 1/2/3/4 columns)
- Pagination / infinite scroll
- EmptyState when no results

### Report Item (`/report`)
- Toggle: [ LOST ] [ FOUND ]
- Single form, conditional fields
- FOUND: Verification question + answer (required)
- Image upload (optional, Cloudinary)
- Submit → redirect to item details

### Item Details (`/items/:id`)
- Desktop: Image left (40%), info right (60%)
- Mobile: Stacked
- Status badge, type badge
- Description, location, date, category
- Matches section (if any) → MatchCard list
- Claim action (if FOUND, not own item, not resolved)

### Matches (`/matches`)
- User's items with possible matches
- MatchCard: score, reasons, view/claim
- Grouped by user's item

### Dashboard (`/dashboard`)
- StatCards: Lost, Found, Matches, Recovered
- Tabs/Sections: My Lost, My Found, Matches, Pending Claims, Recovered
- Each section: ItemCard list with appropriate actions

---

## 7. Build & Dev

| Command | Purpose |
|---------|---------|
| `npm run dev` | Vite dev server (port 5173) |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve production build |
| `npm run lint` | ESLint (if configured) |

### Path Aliases (vite.config.js)

```js
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
    '@components': path.resolve(__dirname, './src/components'),
    '@pages': path.resolve(__dirname, './src/pages'),
    '@services': path.resolve(__dirname, './src/services'),
    '@hooks': path.resolve(__dirname, './src/hooks'),
    '@utils': path.resolve(__dirname, './src/utils'),
    '@context': path.resolve(__dirname, './src/context'),
  },
}
```

---

## 8. Performance Budget

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.0s |
| Largest Contentful Paint | < 2.5s |
| Total JS (gzipped) | < 300KB |
| Total CSS (gzipped) | < 50KB |
| Lighthouse Performance | > 90 |
| Build time | < 10s |

---

## 9. Future Considerations

| Trigger | Action |
|---------|--------|
| Real-time updates needed | Add Socket.IO client, `useSocket` hook |
| Complex form state | Add React Hook Form |
| Server state caching | Add TanStack Query |
| Global UI state (toasts, modals) | Add Zustand |
| E2E testing | Add Playwright |
| Component testing | Add Vitest + React Testing Library |