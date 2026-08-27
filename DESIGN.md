# Design System — LostLink

> Engineering-grade design for a smart campus Lost-and-Found platform.

## Brand

LostLink is a centralized campus Lost-and-Found platform that helps students report, discover, match, verify, and recover lost belongings.

The design communicates **trust, clarity, and quiet efficiency** — the interface should feel like a reliable campus utility rather than a social media platform.

The UI should make the most important actions immediately obvious:

- Report Lost Item
- Report Found Item
- Search Items
- View Possible Matches
- Claim Item
- Verify Ownership
- Resolve Item

**Design inspiration:**

Linear, Vercel, GitHub, Raycast, Slack, Discord, Arc Browser, modern university portals.

The interface should feel:

- Professional
- Minimal
- Trustworthy
- Information-dense
- Fast
- Modern
- Easy to navigate

### Core visual idea

> "Find what you lost. Return what you found."

The design should visually reinforce the journey:

    LOST
      ↓
    SEARCH
      ↓
    MATCH
      ↓
    VERIFY
      ↓
    RECOVER

---

# Anti-Patterns

Never use:

- Giant gradients
- Glowing buttons
- Glassmorphism
- Frosted glass cards
- Decorative blobs
- Floating 3D objects
- Excessive shadows
- Oversized typography
- Generic AI-generated SaaS layouts
- Fake statistics
- Fake activity feeds
- Excessive animations
- Rainbow colors
- Excessive rounded containers
- Decorative illustrations that do not communicate functionality
- Huge hero sections that push functionality below the fold

Every visual element should have a purpose.

---

# Color Palette

## Base

| Token | Hex | Usage |
|---|---|---|
| `bg` | `#09090B` | Application background |
| `surface` | `#18181B` | Cards, sidebars, containers |
| `surface-elevated` | `#27272A` | Hover states, active elements |
| `surface-subtle` | `#1C1C1F` | Nested surfaces |
| `border` | `#27272A` | Structural borders |
| `border-subtle` | `#1C1C1F` | Nested borders |

---

# Text

| Token | Hex | Usage |
|---|---|---|
| `text` | `#FAFAFA` | Primary text, headlines |
| `text-secondary` | `#A1A1AA` | Descriptions, metadata |
| `text-muted` | `#71717A` | Labels, timestamps, secondary metadata |
| `text-disabled` | `#52525B` | Disabled content |

---

# Primary Accent

LostLink uses indigo as the primary interaction color.

| Token | Hex | Usage |
|---|---|---|
| `primary` | `#818CF8` | Primary actions, links, active states |
| `primary-hover` | `#A5B4FC` | Primary hover state |
| `primary-dim` | `#6366F1` | Secondary accent |

Indigo should be used sparingly.

Approximately 95% of the interface should remain grayscale.

---

# Semantic Colors

| Token | Hex | Usage |
|---|---|---|
| `success` | `#34D399` | Found, verified, recovered |
| `warning` | `#FBBF24` | Pending claims, warnings |
| `error` | `#F87171` | Lost, errors, destructive actions |
| `info` | `#38BDF8` | Information, match information |

Color must never be the only way information is communicated.

Always pair colors with:

- Text
- Icons
- Labels
- Status indicators

---

# LostLink Status Colors

LostLink has domain-specific states.

## LOST

Use:

`#F87171`

Display:

    LOST

Use a red semantic indicator and clear text.

---

## FOUND

Use:

`#34D399`

Display:

    FOUND

---

## POSSIBLE MATCH

Use:

`#818CF8`

Display:

    POSSIBLE MATCH

---

## CLAIM PENDING

Use:

`#FBBF24`

Display:

    CLAIM PENDING

---

## VERIFIED

Use:

`#34D399`

Display:

    VERIFIED

---

## RESOLVED

Use:

`#38BDF8`

Display:

    RESOLVED

---

# Usage Rules

- Grayscale dominates the interface.
- Indigo represents primary interaction.
- Green represents successful recovery/verification.
- Red represents lost state, errors, or destructive actions.
- Yellow represents pending/warning states.
- Blue represents informational or resolved states.
- Never use more than one strong accent color in the same component.
- Avoid colored backgrounds covering large areas.
- Use semantic colors primarily for badges, indicators, icons, and small highlights.

---

# Typography

## Font Stack

### Primary

Inter

Use for:

- Navigation
- Headlines
- Body text
- Buttons
- Forms
- Item information

### Monospace

JetBrains Mono

Use for:

- Match scores
- Item IDs
- Timestamps
- Technical information
- Status codes
- Debug information
- Verification-related technical labels

---

# Typography Scale

| Level | Size | Weight | Line Height | Tracking | Usage |
|---|---|---|---|---|---|
| Hero | 56px | 700 | 64px | -0.025em | Landing headline |
| Section | 36px | 600 | 40px | -0.02em | Main section headings |
| Subsection | 20px | 600 | 28px | -0.01em | Card titles |
| Body | 14px | 400 | 22px | 0 | Main UI text |
| Caption | 13px | 400 | 20px | 0 | Descriptions/metadata |
| Code | 13px | 400 | 20px | 0 | Technical information |
| Label | 12px | 500 | 16px | 0.02em | Form labels |
| Tiny | 11px | 500 | 16px | 0.05em | Uppercase section labels |
| Badge | 10–11px | 500 | 16px | 0.05em | Status badges |

---

# Typography Rules

- Headlines use negative letter spacing.
- Body text uses 14px.
- Technical information uses JetBrains Mono.
- Status labels may use uppercase text.
- Never use font sizes smaller than 10px.
- Do not use oversized text for ordinary dashboard content.
- Maintain high information density.
- Use font weight rather than color to establish hierarchy where possible.

---

# Spacing

Base unit:

8px

All major spacing should use multiples of 8px.

| Token | Value | Usage |
|---|---|---|
| `xs` | 4px | Tight internal spacing |
| `sm` | 8px | Component spacing |
| `md` | 16px | Standard spacing |
| `lg` | 24px | Section/card spacing |
| `xl` | 32px | Major spacing |
| `2xl` | 48px | Page padding |
| `section` | 80–120px | Major landing sections |

---

# Layout Grid

## Container

Maximum width:

1200px

Centered horizontally.

Desktop side padding:

24px

---

## Desktop

12-column grid.

Use for:

- Dashboard
- Item browsing
- Search results
- Landing page sections

---

## Tablet

8-column grid.

Reduce page margins to:

16px

---

## Mobile

4-column grid.

Cards become full-width.

Navigation collapses.

Forms become single-column.

---

# Elevation and Depth

Do not use drop shadows as the primary depth mechanism.

Do not use glassmorphism.

Do not use background blur for cards.

Depth should come from:

- Tonal layering
- Borders
- Spacing
- Contrast

---

# Surface Levels

| Level | Background | Usage |
|---|---|---|
| 0 | `#09090B` | Page background |
| 1 | `#18181B` | Cards, sidebar, containers |
| 2 | `#27272A` | Hover, active, nested surfaces |

---

# Borders

Standard border:

`1px solid #27272A`

Nested border:

`1px solid #1C1C1F`

Never use thick decorative borders.

---

# Shapes

| Element | Radius |
|---|---|
| Cards | 12px |
| Buttons | 8px |
| Inputs | 8px |
| Search bars | 8px |
| Badges | 9999px |
| Modals | 12px |
| Dropdowns | 8px |
| Images | 8px or 12px |

Do not make every element excessively rounded.

---

# Buttons

## Primary

Background:

`#818CF8`

Text:

`#09090B`

Radius:

8px

Font:

14px / Medium

Examples:

    Report Lost Item
    Report Found Item
    Search
    Claim Item

---

## Ghost

Background:

transparent

Border:

`1px solid #27272A`

Text:

`#A1A1AA`

Examples:

    Cancel
    Back
    Clear Filters

---

## Surface

Background:

`#18181B`

Border:

`1px solid #27272A`

Text:

`#FAFAFA`

Examples:

    View Details
    View Matches
    Dashboard

---

## Danger

Background:

`#F87171`

Text:

white

Use only for destructive actions:

    Delete Item
    Reject Claim

---

# Button Rules

- No glow effects.
- No gradient backgrounds.
- No scale transforms.
- No excessive animation.
- Hover should subtly change brightness.
- Disabled buttons should visibly communicate disabled state.
- Primary action should be visually dominant.
- Avoid having multiple competing primary buttons in one section.

---

# Cards

Standard card:

- Background: `#18181B`
- Border: `1px solid #27272A`
- Radius: 12px
- Padding: 24px

Compact card:

- Padding: 16px

Hover:

Background shifts subtly toward:

`#1C1C1F`

Do not use dramatic hover effects.

---

# Lost Item Card

Each item card should contain:

    [IMAGE]

    LOST
    Black HP Laptop

    Electronics

    Central Library
    Aug 26, 2026

    [View Details]

Optional:

    Possible Match: 94%

The card should immediately communicate:

1. What the item is.
2. Whether it is LOST or FOUND.
3. Where it was reported.
4. When it was reported.
5. What action the user can take.

---

# Found Item Card

Example:

    [IMAGE]

    FOUND
    Black HP Laptop

    Electronics

    Central Library
    Aug 26, 2026

    [View Details]

If appropriate:

    Verification Required

Never display the verification answer.

---

# Match Card

Match cards are a key differentiator of LostLink.

Example:

    POSSIBLE MATCH

    Black HP Laptop

    MATCH SCORE
    94%

    ✓ Same category
    ✓ Similar location
    ✓ Similar description
    ✓ Same date

    [View Item]
    [Claim Item]

The match score should use JetBrains Mono.

---

# Match Score Visualization

Use a compact progress indicator or horizontal bar.

Do not create a giant circular dashboard gauge.

Example:

    MATCH
    94%  ━━━━━━━━━━━━━━━

The score should remain secondary to the actual item information.

---

# Match Score Levels

90–100:

    VERY STRONG MATCH

75–89:

    STRONG MATCH

60–74:

    POSSIBLE MATCH

Below 60:

    Do not display as a possible match.

---

# Inputs

Input background:

`#09090B`

or:

`#18181B`

Border:

`1px solid #27272A`

Radius:

8px

Text:

`#FAFAFA`

Placeholder:

`#71717A`

Focus:

Border changes to:

`#818CF8`

No glow.

No inner shadow.

---

# Search Bar

The search bar is a major component of LostLink.

Recommended:

    [ Search lost or found items... ]

Include a Lucide search icon.

Search should support:

- Item name
- Description
- Category
- Location

Optional keyboard hint:

    /

The search bar should feel like a command/search utility rather than a generic website input.

---

# Filter Panel

Filters should include:

    Type
    Category
    Location
    Date
    Status

Example:

    TYPE
    [ All ] [ Lost ] [ Found ]

    CATEGORY
    [ Electronics ▼ ]

    LOCATION
    [ Search location ]

    DATE
    [ Select date ]

    STATUS
    [ Active ▼ ]

    [ Clear Filters ]

Keep filters compact.

Do not overwhelm the page with large filter cards.

---

# Navigation

Use a fixed or sticky top navigation.

Structure:

    LostLink

    Browse
    Matches
    Dashboard

    [Report Lost]
    [Report Found]

    User Avatar

Navigation background:

`#09090B`

Bottom border:

`1px solid #27272A`

Active link:

`#FAFAFA`

Inactive:

`#A1A1AA`

Primary navigation action:

Indigo.

---

# Mobile Navigation

Below 640px:

Use a compact mobile navigation.

Suggested:

    LostLink          ☰

Navigation menu:

    Browse
    Matches
    Dashboard
    Report Lost
    Report Found

Do not allow navigation to consume most of the screen.

---

# Landing Page

The landing page should immediately communicate the problem and solution.

Recommended structure:

## Hero

    LOST SOMETHING?
    FIND IT FASTER.

    LostLink connects lost and found reports
    across your campus using smart matching
    and secure ownership verification.

    [Report Lost Item]
    [Report Found Item]

Below:

    Search  →  Match  →  Verify  →  Recover

The hero should not occupy the entire screen.

---

# Hero Visual

Do not use:

- Large decorative illustrations
- 3D objects
- Floating shapes
- Glowing gradients

Instead show a functional product preview.

Example:

    +-----------------------------------------+
    | Search lost or found items...           |
    +-----------------------------------------+

    POSSIBLE MATCH

    Black HP Laptop

    Lost Report         Found Report

    94% MATCH

    Same category
    Similar location
    Similar description

This communicates the actual product.

---

# Problem Section

Use a compact professional section.

Headline:

    Lost Items Are Easy to Lose.
    Finding Them Shouldn't Be.

Show three problems:

    SCATTERED REPORTS

    Lost-and-found information
    is spread across messages,
    groups, and notice boards.

    MANUAL SEARCH

    Students waste time checking
    multiple places and asking
    multiple people.

    UNCERTAIN CLAIMS

    Finding an item does not always
    prove who owns it.

Keep each problem in a simple card.

---

# Solution Section

Headline:

    One Place to Report.
    One System to Match.
    One Secure Way to Recover.

Show:

    REPORT
       ↓
    SEARCH
       ↓
    MATCH
       ↓
    VERIFY
       ↓
    RECOVER

Use thin lines and small icons.

Avoid decorative diagrams.

---

# How It Works

Use four compact steps.

## 01 — REPORT

Post a lost or found item.

## 02 — DISCOVER

Search and filter relevant reports.

## 03 — MATCH

LostLink compares category, location, date, and description.

## 04 — VERIFY

Ownership is confirmed before recovery.

Use numbered labels rather than oversized illustrations.

---

# Dashboard Design

Dashboard should prioritize useful information.

Recommended layout:

    Dashboard

    Good morning, [Name]

    +-------------+ +-------------+ +-------------+
    | LOST        | | FOUND       | | RECOVERED   |
    | 04          | | 03          | | 02          |
    +-------------+ +-------------+ +-------------+

    POSSIBLE MATCHES

    +---------------------------------------------+
    | Black HP Laptop                94% MATCH    |
    | Electronics · Library                      |
    |                                             |
    | ✓ Same category                             |
    | ✓ Similar location                          |
    |                                             |
    | [View Match]                                |
    +---------------------------------------------+

    MY REPORTS

    ...

Do not create fake analytics simply to fill empty space.

---

# Dashboard Statistics

Use compact statistic cards.

Possible metrics:

    My Lost Items
    My Found Items
    Possible Matches
    Recovered Items

Use numbers prominently but not excessively.

Technical/statistical numbers can use JetBrains Mono.

---

# Report Item Page

The report form should be simple and focused.

Header:

    Report an Item

Toggle:

    [ LOST ] [ FOUND ]

Form:

    Item Name
    Category
    Description
    Location
    Date
    Image

For FOUND:

    Verification Question
    Verification Answer

Primary button:

    Submit Report

The form should use a single-column layout on mobile.

---

# Verification UI

Verification is a critical trust feature.

Display:

    VERIFY OWNERSHIP

    To claim this item, answer the
    verification question provided
    by the finder.

    Question:

    "What sticker is on the laptop?"

    Your Answer:

    [________________________]

    [Submit Verification]

Do not reveal:

- Correct answer
- Verification metadata
- Internal matching data

---

# Claim Status UI

Use clear status badges.

    CLAIM PENDING

    Your verification was successful.
    Waiting for the finder to approve
    the claim.

or:

    CLAIM REJECTED

    The finder did not approve this claim.

or:

    CLAIM APPROVED

    The item has been marked as recovered.

---

# Empty States

Empty states should be useful and minimal.

Example:

    NO POSSIBLE MATCHES

    We couldn't find a strong match yet.
    New reports may create a match later.

    [Browse Items]

Do not use large decorative illustrations.

---

# Loading States

Use subtle skeletons or inline loading indicators.

Example:

    Loading matches...

Do not use full-screen spinners unless absolutely necessary.

---

# Error States

Example:

    SOMETHING WENT WRONG

    We couldn't load the items.
    Please try again.

    [Try Again]

Use `error` color only for the error indicator and action when appropriate.

---

# Success States

Example:

    REPORT SUBMITTED

    Your lost item has been added to LostLink.

    [View Item]

Use success green sparingly.

---

# Modal Design

Modals:

- Background: `#18181B`
- Border: `1px solid #27272A`
- Radius: 12px
- Padding: 24px

Use modals for:

- Claim confirmation
- Delete confirmation
- Important verification actions

Do not use modals for ordinary navigation.

---

# Badges

Badges use pill radius:

9999px

Example:

    LOST
    FOUND
    ACTIVE
    CLAIM PENDING
    VERIFIED
    RESOLVED

Badge text:

10–11px

Medium weight.

Badges should remain compact.

---

# Icons

Library:

Lucide React

Style:

- Monoline
- 1.5px stroke
- Consistent sizing
- Single color

Sizes:

16px:

Inline information

20px:

Buttons

24px:

Navigation

Icons should inherit text color.

Never use multi-colored icons.

---

# Recommended Icons

Report Lost:

PackageX

Report Found:

PackageCheck

Search:

Search

Location:

MapPin

Date:

CalendarDays

Category:

Tags

Match:

GitCompare

Verification:

ShieldCheck

Claim:

Hand

Recovered:

CheckCircle2

Delete:

Trash2

Dashboard:

LayoutDashboard

User:

UserCircle

---

# Icon Rules

Icons must support the meaning of text.

Do not replace important labels with icons only.

Bad:

    [icon]

Better:

    [icon] Report Lost

---

# Images

Item images are functional content.

Recommended image ratio:

4:3

or:

1:1

Use:

- object-fit: cover
- 8px or 12px radius
- subtle border

Avoid:

- Heavy filters
- Decorative overlays
- Excessive image effects

If an item has no image:

Display a simple neutral placeholder.

Example:

    [ Package Icon ]

    No image available

---

# Item Detail Layout

Desktop:

    +----------------------+---------------------------+
    |                      | ITEM INFORMATION          |
    |      ITEM IMAGE      |                           |
    |                      | Black HP Laptop           |
    |                      | Electronics               |
    |                      |                           |
    |                      | Central Library           |
    |                      | Aug 26, 2026              |
    |                      |                           |
    |                      | [Claim Item]             |
    +----------------------+---------------------------+

Below:

    POSSIBLE MATCHES

    Match cards...

Do not make the image occupy the entire page.

---

# Responsive Item Detail

Mobile:

    ITEM IMAGE

    ITEM INFORMATION

    STATUS

    LOCATION

    DATE

    DESCRIPTION

    ACTION

    POSSIBLE MATCHES

Everything becomes one column.

---

# Animations

Motion should be minimal.

Use:

| Animation | Usage | Duration |
|---|---|---|
| `fade-in` | Content appearance | 0.2s ease |
| `slide-up` | Small content reveal | 0.3s ease |
| `pulse-dot` | Live/status indicators | 2s ease-in-out |
| Hover transition | Buttons/cards | 150ms |

---

# Never Animate

Never animate:

- Page transitions
- Layout shifts
- Large decorative objects
- Cards bouncing
- Buttons growing
- Floating blobs
- Background gradients
- Excessive dashboard elements

---

# Hover Behavior

Buttons:

Subtle background brightness change.

Cards:

Subtle surface color change.

Links:

Text color change.

Do not use:

- Scale transforms
- Glow
- Large translation
- Shadows

---

# Responsive Breakpoints

| Breakpoint | Width | Behavior |
|---|---|---|
| Mobile | < 640px | Single column |
| Tablet | 640–1024px | 2-column layout |
| Desktop | > 1024px | Full layout |
| Wide | > 1280px | Maximum 1200px content width |

---

# Mobile Rules

On mobile:

- Navigation collapses.
- Cards become full width.
- Forms become single column.
- Filters become a collapsible panel.
- Search remains prominent.
- Primary actions remain visible.
- Avoid horizontal scrolling.
- Buttons should have comfortable touch targets.
- Maintain 16px minimum page padding.

---

# Desktop Rules

On desktop:

- Maximum content width: 1200px.
- Use 12-column grid.
- Use two-column layouts for item details.
- Use cards for grouped information.
- Maintain strong visual hierarchy.
- Avoid excessive empty space.

---

# Accessibility

The UI must support:

- Keyboard navigation
- Visible focus states
- Semantic HTML
- Accessible form labels
- Alt text for item images
- Sufficient text contrast
- Clear error messages

Do not depend on color alone.

For example:

Bad:

    Green = Verified

Better:

    ✓ VERIFIED

---

# Forms

Every form must have:

- Label
- Input
- Validation
- Error state
- Loading state
- Success state where applicable

Do not rely on placeholder text as the only label.

---

# Focus States

Focused controls:

Border:

`#818CF8`

Do not use:

- Thick focus rings
- Glowing outlines
- Multiple colored borders

---

# Data Density

LostLink is an information-driven application.

Prefer:

- Compact cards
- Clear metadata
- Consistent spacing
- Small labels
- Strong hierarchy

Avoid:

- Huge empty cards
- Giant icons
- Oversized headings everywhere
- Excessive whitespace inside dashboards

---

# Landing Page Information Hierarchy

Priority:

1. LostLink identity.
2. Problem statement.
3. Report Lost / Report Found.
4. Search.
5. Matching concept.
6. Verification concept.
7. How it works.
8. Product preview.
9. Final call to action.

Do not bury the primary actions below decorative content.

---

# Dashboard Information Hierarchy

Priority:

1. Current user.
2. Important statistics.
3. Possible matches.
4. Pending claims.
5. My reports.
6. Recovered items.

Possible matches and pending claims should be more visually prominent than historical information.

---

# Search Results Information Hierarchy

Each result should prioritize:

1. Item image.
2. LOST / FOUND.
3. Item title.
4. Category.
5. Location.
6. Date.
7. Status.
8. Action.

---

# Match Results Information Hierarchy

Each match should prioritize:

1. Match score.
2. Item title.
3. LOST / FOUND type.
4. Matching reasons.
5. Location/date.
6. View/claim action.

---

# Trust and Safety Visual Language

LostLink handles ownership claims.

Therefore the UI should visually communicate trust.

Use:

- ShieldCheck icon
- Clear verification labels
- Explicit status
- Clear claim state
- Confirmation messages

Do not use:

- "100% guaranteed"
- Fake trust scores
- Fake verification counts
- Fake user ratings

Only display information generated by the actual system.

---

# Data Privacy

Never visually expose:

- Verification answers
- Passwords
- JWTs
- Internal database IDs unless needed
- Private user information
- Internal security data

Only show information required for the user's workflow.

---

# Technical Labels

Use JetBrains Mono for:

    MATCH 94%
    ITEM ID
    STATUS
    CREATED
    UPDATED
    API-related information

Example:

    MATCH SCORE
    94%

The technical data should feel precise and system-generated.

---

# Empty Dashboard

If a user has no reports:

    NO REPORTS YET

    Start by reporting a lost or found item.

    [Report Lost]
    [Report Found]

Keep the state actionable.

---

# First-Time User Experience

A new user should understand the product within seconds.

The primary actions should be:

    Report Lost
    Report Found
    Search

Do not require users to explore menus before understanding the product.

---

# Navigation Information Architecture

Primary navigation:

    Browse
    Matches
    Dashboard

Primary actions:

    Report Lost
    Report Found

Account:

    Profile
    Logout

Optional admin:

    Admin

---

# URL / Route Design

Use clean routes:

    /
    /login
    /register
    /items
    /items/:id
    /report
    /matches
    /dashboard

Optional:

    /admin

---

# Design Tokens

Use CSS variables or Tailwind theme variables.

Example:

    --color-bg: #09090B;
    --color-surface: #18181B;
    --color-surface-elevated: #27272A;
    --color-border: #27272A;

    --color-text: #FAFAFA;
    --color-text-secondary: #A1A1AA;
    --color-text-muted: #71717A;

    --color-primary: #818CF8;
    --color-primary-dim: #6366F1;

    --color-success: #34D399;
    --color-warning: #FBBF24;
    --color-error: #F87171;
    --color-info: #38BDF8;

---

# Tailwind Guidelines

Use Tailwind CSS for styling.

Prefer utility classes.

Keep custom CSS minimal.

Use the design tokens consistently.

Do not create arbitrary one-off colors.

Avoid:

    bg-red-700

when a semantic design token exists.

Prefer:

    bg-error

or the project's configured equivalent.

---

# Component Design Principles

Components should be:

- Small
- Reusable
- Predictable
- Accessible
- Consistent

Recommended reusable components:

    Navbar
    Button
    Input
    SearchBar
    FilterPanel
    ItemCard
    MatchCard
    StatusBadge
    EmptyState
    LoadingState
    Modal
    ClaimModal
    VerificationForm
    StatCard

---

# Component Naming

Use PascalCase:

    ItemCard.jsx
    MatchCard.jsx
    SearchBar.jsx
    StatusBadge.jsx

Utilities:

    textSimilarity.js
    dateSimilarity.js

Pages:

    BrowseItems.jsx
    ItemDetails.jsx
    Dashboard.jsx

---

# File Naming

Components:

PascalCase.jsx

Pages:

PascalCase.jsx

Utilities:

camelCase.js

Services:

camelCase.js

Contexts:

PascalCase.jsx

CSS:

Use Tailwind utilities and minimal global CSS.

---

# Design Consistency Rules

All screens must use the same:

- Color tokens
- Typography
- Spacing
- Border radius
- Button styles
- Input styles
- Status badges
- Icon library

Do not redesign individual pages independently.

---

# Do Not Create

Do not create:

- Decorative gradients
- Glass cards
- Floating blobs
- Neon effects
- Fake metrics
- Fake user activity
- Excessive animations
- Multiple unrelated accent colors
- Large background illustrations
- Generic AI dashboard layouts

---

# Product Personality

LostLink should feel:

    TRUSTWORTHY
    PRECISE
    FAST
    CALM
    USEFUL

It should NOT feel:

    PLAYFUL
    GAMIFIED
    FLASHY
    CORPORATE-HEAVY
    GENERIC
    AI-GENERATED

---

# Core Visual Flow

The entire product should reinforce:

    +----------+
    |   LOST   |
    +----+-----+
         |
         v
    +----------+
    |  SEARCH  |
    +----+-----+
         |
         v
    +----------+
    |  MATCH   |
    +----+-----+
         |
         v
    +----------+
    |  VERIFY  |
    +----+-----+
         |
         v
    +----------+
    | RECOVER  |
    +----------+

Each stage should have:

- Clear label
- Small icon
- Consistent spacing
- Minimal visual treatment

---

# Primary User Journey

## Student Lost an Item

    Home
      ↓
    Report Lost
      ↓
    Enter Details
      ↓
    Submit
      ↓
    Possible Match
      ↓
    View Found Item
      ↓
    Claim
      ↓
    Verification
      ↓
    Finder Approval
      ↓
    RESOLVED

---

# Student Found an Item

    Home
      ↓
    Report Found
      ↓
    Enter Item Details
      ↓
    Add Verification Question
      ↓
    Submit
      ↓
    Possible Match
      ↓
    Claim Received
      ↓
    Review Verification
      ↓
    Approve / Reject
      ↓
    RESOLVED

---

# Main CTA Rules

The application should have two primary report actions:

    [Report Lost Item]
    [Report Found Item]

Both are important.

Do not visually imply that reporting lost items is more important than reporting found items.

For contextual actions:

    Claim Item
    View Match
    Verify Claim
    Approve Claim

Use the primary button style only when the action is the most important action on that screen.

---

# Landing Page CTA

Primary:

    Report Lost Item

Secondary:

    Report Found Item

Search should also be highly visible.

Recommended:

    [Search lost or found items...]

---

# Product Preview

Use a real-looking application preview rather than abstract graphics.

Example:

    +------------------------------------------------+
    | Search lost or found items...                  |
    +------------------------------------------------+
    
    POSSIBLE MATCH

    +-----------------------------------------------+
    | Black HP Laptop                  94% MATCH    |
    |                                               |
    | Electronics                                   |
    | Central Library                               |
    | Aug 26, 2026                                  |
    |                                               |
    | ✓ Same category                               |
    | ✓ Similar location                            |
    | ✓ Similar description                         |
    | ✓ Same date                                   |
    |                                               |
    | [View Match]                                  |
    +-----------------------------------------------+

The preview should demonstrate the core differentiator.

---

# No Fake Data Rule

When displaying product screenshots, mockups, or design prototypes:

- Clearly use realistic example data.
- Do not imply fake metrics are real.
- Do not create fake user counts.
- Do not create fake recovery percentages.
- Do not create fake testimonials.
- Do not create fake campus adoption statistics.

If demo data is required, label it appropriately where necessary.

---

# Animation Philosophy

Motion should communicate state.

Good:

    Button loading
    Match appearing
    Success confirmation
    Status indicator

Bad:

    Floating cards
    Bouncing buttons
    Spinning icons
    Animated gradients
    Decorative particles

---

# Performance and UI

The UI must remain fast.

Avoid:

- Large unnecessary images
- Heavy animation libraries
- Video backgrounds
- Excessive DOM nesting
- Unnecessary visual effects

Prefer:

- CSS transitions
- Tailwind utilities
- Optimized images
- Lazy loading when appropriate

---

# Desktop Application Layout

For dashboard/browse pages:

    +----------------------------------------------------------+
    | LostLink     Browse   Matches   Dashboard   Report Lost  |
    +----------------------------------------------------------+
    |                                                          |
    | Page Title                                               |
    | Description                                              |
    |                                                          |
    | Search                                                   |
    |                                                          |
    | Filters                                                  |
    |                                                          |
    | +------------+ +------------+ +------------+             |
    | | Item Card  | | Item Card  | | Item Card  |             |
    | +------------+ +------------+ +------------+             |
    |                                                          |
    +----------------------------------------------------------+

Maintain a clean content boundary.

---

# Dashboard Layout

    +----------------------------------------------------------+
    | Navbar                                                   |
    +----------------------------------------------------------+
    |                                                          |
    | Dashboard                                                |
    | Welcome back, [Name]                                    |
    |                                                          |
    | +-----------+ +-----------+ +-----------+ +-----------+  |
    | | Lost      | | Found     | | Matches   | | Recovered |  |
    | | 04        | | 03        | | 02        | | 02        |  |
    | +-----------+ +-----------+ +-----------+ +-----------+  |
    |                                                          |
    | Possible Matches                                         |
    |                                                          |
    | +------------------------------------------------------+ |
    | | Black HP Laptop                         94% MATCH     | |
    | +------------------------------------------------------+ |
    |                                                          |
    | My Reports                                               |
    |                                                          |
    +----------------------------------------------------------+

---

# Search Page Layout

    Browse Items

    [ Search lost or found items... ]

    [Lost] [Found] [Category] [Location] [Date]

    24 results

    +----------------+  +----------------+  +----------------+
    | Item           |  | Item           |  | Item           |
    | image          |  | image          |  | image          |
    |                |  |                |  |                |
    | LOST           |  | FOUND          |  | LOST           |
    | Laptop         |  | Wallet         |  | Keys           |
    +----------------+  +----------------+  +----------------+

---

# Match Page Layout

    Possible Matches

    Matches are ranked using category,
    location, date, and description similarity.

    +----------------------------------------------------------+
    | 94% MATCH                                                |
    |                                                          |
    | Black HP Laptop                                          |
    | Electronics · Central Library                            |
    |                                                          |
    | ✓ Same category                                          |
    | ✓ Similar location                                       |
    | ✓ Similar description                                    |
    | ✓ Same date                                              |
    |                                                          |
    | [View Item]                                              |
    +----------------------------------------------------------+

---

# Verification Page Layout

    Verify Ownership

    Answer the question provided by the finder.

    QUESTION

    What sticker is on the laptop?

    ANSWER

    [________________________________]

    [Submit Verification]

    Your answer is securely checked by LostLink.

Do not expose the correct answer.

---

# Recovery Confirmation

After successful approval:

    ITEM RECOVERED

    The claim has been approved and
    the item is now marked as resolved.

    ✓ VERIFIED
    ✓ CLAIM APPROVED
    ✓ ITEM RESOLVED

    [Back to Dashboard]

This is one of the most important success states in the application.

---

# Design Quality Checklist

Before considering a page complete, verify:

## Visual

- Correct background.
- Correct surface colors.
- Correct borders.
- Correct typography.
- Correct spacing.
- Correct radius.
- No unnecessary shadows.
- No gradients.
- No decorative effects.

## Functional

- Primary action is obvious.
- Search is easy to find.
- Status is clear.
- Errors are visible.
- Loading states exist.
- Empty states are useful.
- Buttons provide feedback.

## Accessibility

- Keyboard navigation works.
- Focus state is visible.
- Labels are present.
- Images have alt text.
- Color is not the only information carrier.

## Responsive

- Mobile layout works.
- Tablet layout works.
- Desktop layout works.
- No horizontal overflow.
- Buttons remain usable.
- Forms remain readable.

---

# Design Implementation Rules for AI Agents

When implementing UI:

1. Read this DESIGN.md before creating or modifying UI.
2. Follow the design tokens exactly.
3. Reuse existing components.
4. Do not invent new colors without approval.
5. Do not introduce gradients.
6. Do not introduce glassmorphism.
7. Do not introduce decorative backgrounds.
8. Do not add excessive animations.
9. Do not use random border radii.
10. Do not create inconsistent button styles.
11. Use Lucide React for icons.
12. Use Inter for UI text.
13. Use JetBrains Mono for technical data.
14. Maintain 8px spacing rhythm.
15. Prefer functional UI over decorative UI.
16. Keep the interface information-dense but readable.
17. Preserve visual consistency across all pages.
18. Make mobile responsive by default.
19. Never create fake statistics or fake product functionality.
20. Do not sacrifice usability for visual effects.

---

# Design Priority

When visual decisions conflict, use this priority:

    1. Usability
    2. Accessibility
    3. Consistency
    4. Clarity
    5. Performance
    6. Visual polish

---

# Final Design Principle

LostLink should look like a serious product that could actually be deployed across a university campus.

The design should communicate:

    "I can trust this system with my lost item."

The interface should be:

    DARK
    MINIMAL
    PRECISE
    HIGH-CONTRAST
    INFORMATION-DENSE
    FUNCTIONAL

No decoration without purpose.

No complexity without value.

Every pixel should help the user:

    REPORT
       ↓
    SEARCH
       ↓
    MATCH
       ↓
    VERIFY
       ↓
    RECOVER