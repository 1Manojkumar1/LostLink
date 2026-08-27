# 09 — UI/UX Guidelines

> LostLink interface principles, patterns, and implementation rules

---

## 1. Design Philosophy

| Principle | Application |
|-----------|-------------|
| **Trustworthy** | Clear status, no fake data, explicit verification |
| **Precise** | Technical typography for scores/IDs, exact labels |
| **Fast** | Minimal animations, instant feedback, backend filtering |
| **Calm** | Dark mode, grayscale dominant, indigo only for actions |
| **Useful** | Every element serves a purpose, no decoration |

**Not:** Playful, gamified, flashy, corporate-heavy, generic, AI-generated

---

## 2. Color System (Dark Mode Only)

### Base Palette
| Token | Hex | Usage |
|-------|-----|-------|
| `bg` | `#09090B` | Page background |
| `surface` | `#18181B` | Cards, containers |
| `surface-elevated` | `#27272A` | Hover, active states |
| `surface-subtle` | `#1C1C1F` | Nested surfaces |
| `border` | `#27272A` | Card borders |
| `border-subtle` | `#1C1C1F` | Subtle dividers |

### Text
| Token | Hex | Usage |
|-------|-----|-------|
| `text` | `#FAFAFA` | Primary text, headings |
| `text-secondary` | `#A1A1AA` | Descriptions, metadata |
| `text-muted` | `#71717A` | Labels, timestamps |
| `text-disabled` | `#52525B` | Disabled content |

### Primary Accent (Indigo - Use Sparingly ~5%)
| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#818CF8` | Primary buttons, links, active |
| `primary-hover` | `#A5B4FC` | Hover state |
| `primary-dim` | `#6366F1` | Secondary accent |

### Semantic Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `success` | `#34D399` | FOUND, Verified, Resolved |
| `warning` | `#FBBF24` | Pending, Claims |
| `error` | `#F87171` | LOST, Errors, Destructive |
| `info` | `#38BDF8` | Info, Matches |

**Rule:** Color never sole indicator — always pair with text/icon.

### Status Colors
| Status | Color | Badge | Icon |
|--------|-------|-------|------|
| LOST | `error` (#F87171) | Red badge | ⬤ |
| FOUND | `success` (#34D399) | Green badge | ⬤ |
| POSSIBLE MATCH | `primary` (#818CF8) | Indigo badge | ⬤ |
| CLAIM PENDING | `warning` (#FBBF24) | Yellow badge | ⬤ |
| VERIFIED | `success` | Green badge | ✓ |
| RESOLVED | `info` (#38BDF8) | Blue badge | ✓ |

---

## 3. Typography

### Font Stack
- **Primary:** Inter (UI, headings, body, buttons)
- **Mono:** JetBrains Mono (scores, IDs, timestamps, technical)

### Scale
| Level | Size | Weight | Line Height | Tracking | Usage |
|-------|------|--------|-------------|----------|-------|
| Hero | 56px | 700 | 64px | -0.025em | Landing headline |
| Section | 36px | 600 | 40px | -0.02em | Main headings |
| Subsection | 20px | 600 | 28px | -0.01em | Card titles |
| Body | 14px | 400 | 22px | 0 | Main UI text |
| Caption | 13px | 400 | 20px | 0 | Descriptions |
| Code | 13px | 400 | 20px | 0 | Technical info |
| Label | 12px | 500 | 16px | 0.02em | Form labels |
| Tiny | 11px | 500 | 16px | 0.05em | Section labels |
| Badge | 10-11px | 500 | 16px | 0.05em | Status badges |

### Rules
- Headlines: negative letter spacing
- Body: 14px for density
- Technical: JetBrains Mono
- Status labels: uppercase + tracking
- Min size: 10px
- No oversized text in dashboards
- Weight over color for hierarchy

---

## 4. Spacing System

**Base Unit:** 8px

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 4px | Tight internal |
| `sm` | 8px | Component spacing |
| `md` | 16px | Standard |
| `lg` | 24px | Section/card |
| `xl` | 32px | Major |
| `2xl` | 48px | Page padding |
| `section` | 80-120px | Landing sections |

All spacing multiples of 8px.

---

## 5. Layout

### Container
- Max width: 1200px
- Centered horizontally
- Desktop padding: 24px

### Grid
- **Desktop:** 12-column
- **Tablet (640-1024px):** 8-column, 16px margins
- **Mobile (<640px):** 4-column, full-width cards

### Responsive Breakpoints
| Breakpoint | Width | Behavior |
|------------|-------|----------|
| Mobile | < 640px | Single column, collapse nav, stack forms |
| Tablet | 640-1024px | 2-col layouts, collapsible filters |
| Desktop | > 1024px | Full layout, 12-col grid |
| Wide | > 1280px | Max 1200px content |

---

## 6. Components

### Buttons
| Variant | Background | Border | Text | Usage |
|---------|------------|--------|------|-------|
| Primary | `#818CF8` | None | `#09090B` | Main actions |
| Ghost | Transparent | `#27272A` | `#A1A1AA` | Secondary |
| Surface | `#18181B` | `#27272A` | `#FAFAFA` | View details |
| Danger | `#F87171` | None | White | Delete, Reject |

**Radius:** 8px | **Font:** 14px Medium | **No:** glow, gradients, scale transforms, excessive animation

### Cards
- Background: `#18181B`
- Border: `1px solid #27272A`
- Radius: 12px
- Padding: 24px (standard), 16px (compact)
- Hover: Subtle shift to `#1C1C1F`

### Inputs
- Background: `#09090B` or `#18181B`
- Border: `1px solid #27272A`
- Radius: 8px
- Focus: Border `#818CF8` (no glow, no shadow)

### Badges
- Radius: 9999px (pill)
- Size: 10-11px, Medium, Uppercase, Tracking-wide

### Modals
- Background: `#18181B`
- Border: `1px solid #27272A`
- Radius: 12px
- Padding: 24px
- Backdrop: `bg-black/50`

---

## 7. Icons

**Library:** Lucide React
**Style:** Monoline, 1.5px stroke, consistent sizing, single color

| Size | Usage |
|------|-------|
| 16px | Inline info |
| 20px | Buttons |
| 24px | Navigation |

**Icons inherit text color** — never multi-colored.

### Key Icons
| Action | Icon |
|--------|------|
| Report Lost | PackageX |
| Report Found | PackageCheck |
| Search | Search |
| Location | MapPin |
| Date | CalendarDays |
| Category | Tags |
| Match | GitCompare |
| Verification | ShieldCheck |
| Claim | Hand |
| Recovered | CheckCircle2 |
| Delete | Trash2 |
| Dashboard | LayoutDashboard |
| User | UserCircle |

**Rule:** Icons support text, never replace labels alone.

---

## 8. Key Page Patterns

### Landing Page (`/`)
```
LOST SOMETHING?
FIND IT FASTER.

[Report Lost Item] [Report Found Item]

Search Lost & Found

Recently Reported Items (4-6 cards)

Problem → Solution → How It Works → Demo
```

### Item Card
```
[IMAGE] (4:3 or 1:1, 8-12px radius)

LOST/FOUND badge
Title
Category
Location · Date
[View Details]

Optional: Match Score 94%
```

### Item Detail (Desktop)
```
┌──────────────┬────────────────────┐
│   IMAGE      │ ITEM INFORMATION   │
│  (40%)       │                    │
│              │ Title              │
│              │ Category · Type    │
│              │ Location           │
│              │ Date               │
│              │                    │
│              │ [Claim Item]       │
└──────────────┴────────────────────┘

POSSIBLE MATCHES
[MatchCard] [MatchCard] ...
```

### Match Card
```
POSSIBLE MATCH
Title

MATCH SCORE
94% ━━━━━━━━━━━━━━━

✓ Same category
✓ Similar location
✓ Similar description
✓ Same date

[View Item] [Claim Item]
```

### Dashboard
```
Dashboard
Good morning, [Name]

┌─────────┐ ┌─────────┐ ┌─────────┐
│ LOST 04 │ │ FOUND 03│ │RECOVERED 02│
└─────────┘ └─────────┘ └─────────┘

POSSIBLE MATCHES
┌─────────────────────────────────┐
│ Black HP Laptop          94%    │
│ Electronics · Library           │
│ ✓ Same category                 │
│ ✓ Similar location              │
│ [View Match]                    │
└─────────────────────────────────┘

MY REPORTS / MY CLAIMS / RECOVERED
```

---

## 9. States

### Loading
- Skeletons for cards/lists
- Inline spinners for actions
- No full-screen spinners unless critical

### Empty States
```
NO REPORTS YET
Start by reporting a lost or found item.

[Report Lost] [Report Found]
```

### Error States
```
SOMETHING WENT WRONG
We couldn't load the items. Please try again.

[Try Again]
```

### Success States
```
REPORT SUBMITTED
Your lost item has been added to LostLink.

[View Item]
```

---

## 10. Forms

**Every form field has:**
- Label (not placeholder only)
- Input
- Validation (real-time + submit)
- Error state (inline)
- Loading state
- Success feedback where applicable

### Report Form (Unified)
```
[ LOST ] [ FOUND ]  ← Toggle

Item Name *
Category *
Description *
Location *
Date *
Image (optional)

[FOUND only:]
Verification Question *
Verification Answer *

[Submit Report]
```

---

## 11. Navigation

### Desktop
```
LostLink                    [Report Lost] [Report Found]  [User Avatar]
Browse  Matches  Dashboard
```

### Mobile (<640px)
```
LostLink  ☰
─────────────
Browse
Matches
Dashboard
Report Lost
Report Found
─────────────
[User Menu]
```

---

## 12. Animations (Minimal)

| Animation | Usage | Duration |
|-----------|-------|----------|
| `fade-in` | Content appear | 0.2s ease |
| `slide-up` | Small reveal | 0.3s ease |
| `pulse-dot` | Live indicators | 2s ease-in-out |
| Hover | Buttons/cards | 150ms |

**Never Animate:** Page transitions, layout shifts, large objects, card bounce, button grow, blobs, gradients, excessive dashboard elements.

---

## 13. Accessibility

- Keyboard navigation (tab order, focus visible)
- Semantic HTML (button, nav, main, section, article)
- Form labels (explicit `<label for>`)
- Alt text for images
- Contrast ratios (WCAG AA)
- Status not color-only (text + icon + color)
- Focus ring: `#818CF8`, 2px, offset 2px

---

## 14. Information Hierarchy

### Search Results
1. Image
2. LOST/FOUND badge
3. Title
4. Category
5. Location
6. Date
7. Status
8. Action

### Match Results
1. Match score (JetBrains Mono)
2. Title
3. LOST/FOUND type
4. Matching reasons
5. Location/Date
6. View/Claim action

### Dashboard
1. Current user
2. Key stats
3. Possible matches (actionable)
4. Pending claims (actionable)
5. My reports
6. Recovered

---

## 15. Anti-Patterns (Never Do)

- Giant gradients / glowing buttons
- Glassmorphism / frosted glass
- Decorative blobs / floating 3D
- Excessive shadows
- Oversized typography
- Generic SaaS layouts
- Fake statistics / activity feeds
- Excessive animations
- Rainbow colors
- Excessive rounded containers
- Decorative illustrations without function
- Huge heroes pushing content below fold