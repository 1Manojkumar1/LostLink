LostLink — Stitch Design Implementation
Objective

Rebuild the existing LostLink frontend so that it matches the approved Stitch design as closely as possible.

This is a frontend UI reconstruction task.

The approved Stitch design is the visual source of truth.

The existing DESIGN.md remains the design-system source of truth.

IMPORTANT

Do NOT simply "improve" the existing UI.

Replace the existing visual implementation with the approved Stitch design.

Preserve the application's existing functionality and business logic.

The goal is:

Existing functionality + new Stitch UI

Before Coding

First inspect the entire project.

Understand:

React structure
Routes
Pages
Components
Context/providers
API services
Authentication
State management
Existing Tailwind configuration
Existing backend API usage
Existing forms
Existing item/match/claim flows

Do not start changing files before understanding the architecture.

Preserve Existing Functionality

Do NOT unnecessarily modify:

Express routes
MongoDB schemas
Controllers
Authentication logic
JWT logic
API contracts
Matching algorithm
Verification logic
Claim logic
Business rules

Preserve existing frontend functionality wherever possible.

If the existing API already supports a feature, connect the new UI to it instead of creating fake frontend behavior.

Design Source of Truth

Use:

Approved Stitch design
DESIGN.md

Do not invent a competing design.

Follow the design system for:

Colors
Typography
Spacing
Radius
Borders
Buttons
Inputs
Status colors
Icons
Responsive behavior
Technology

Use the existing project stack.

Frontend:

React
Tailwind CSS

Backend:

Node.js
Express
MongoDB

Use existing dependencies when possible.

Do not introduce unnecessary libraries.

Use Lucide React for icons if already installed; otherwise install/use the project's existing icon solution rather than introducing multiple icon libraries.

Component Architecture

Create reusable components where appropriate.

Recommended:

components/
Navbar
Button
Input
SearchBar
FilterPanel
ItemCard
MatchCard
StatusBadge
StatCard
EmptyState
LoadingState
Modal
ClaimModal
VerificationForm

Pages:

Landing
BrowseItems
ItemDetails
Matches
Dashboard
ReportItem
Verification
ClaimReview

Do not create duplicate components that perform the same UI role.

Implementation Strategy

Implement in this order:

1. Global Design System

First establish:

Fonts
CSS variables/design tokens
Tailwind colors
Backgrounds
Typography
Border styles
Radius
Button styles
Input styles

Make sure the design system is reusable.

2. Global Navigation

Implement the Stitch navbar.

Ensure:

Desktop navigation
Mobile navigation
Active states
Report Lost
Report Found
User menu

Navigation must remain consistent across every page.

3. Shared Components

Implement:

Buttons
Inputs
Search
Filters
Cards
Status badges
Match score
Modals
Empty states
Loading states
Error states

Make these reusable before building every page independently.

4. Landing Page

Rebuild the landing page to match Stitch.

Prioritize:

Compact hero
Search
Report Lost
Report Found
Product preview
Report → Search → Match → Verify → Recover flow
Problem/solution sections
Final CTA

Avoid adding elements that aren't present in the approved design.

5. Browse/Search

Implement:

Search
Filters
Results
Item cards
Pagination/infinite scrolling if already supported
Loading state
Empty state
Error state

Connect everything to the existing APIs.

6. Item Details

Implement the Stitch layout.

Connect:

Item information
Images
Status
Possible matches
Claim actions

Use actual API data.

7. Matches

Implement:

Match score
Match reasons
Item details
View action
Claim action

Use the existing matching data.

Do not calculate fake match scores in the UI.

8. Dashboard

Implement:

Real statistics
Possible matches
Pending claims
My reports
Recovered items

Do not create fake dashboard metrics.

If data is unavailable, use the appropriate empty state.

9. Reporting

Implement the Lost/Found form.

Connect it to the existing API.

Support:

Validation
Image upload if already supported
Loading
Errors
Success
Lost/Found-specific fields

Do not expose sensitive verification information.

10. Verification

Implement the verification flow using the existing API.

Never expose:

Correct verification answer
Internal matching data
Private security information
11. Claim Review

Implement finder-side:

Approve Claim

Reject Claim

Use existing backend logic.

Show appropriate success/error feedback.

12. Recovery

Implement the resolved/recovered state.

Use actual claim and item status from the backend.

Responsive Requirements

Every page must work at:

320px+
Mobile
Tablet
Desktop
Wide desktop

Check for:

Overflow
Broken grids
Text wrapping
Button sizing
Image sizing
Navigation issues
Form layout
Modal behavior

Do not fix desktop while breaking mobile.

UI Quality

Match Stitch carefully.

Pay attention to:

Exact spacing
Typography hierarchy
Component dimensions
Alignment
Border colors
Surface colors
Button proportions
Card density
Icon sizes
Status badges
Search dimensions
Page width

Avoid approximating the design when the Stitch reference provides a clear structure.

Do NOT Add

Do not introduce:

Gradients
Glassmorphism
Glow
Decorative blobs
3D objects
Excessive shadows
Excessive animations
Generic dashboard charts
Fake statistics
Fake testimonials
Random colors
Random border radii

Do not make the UI more "fancy" than the approved design.

Accessibility

Ensure:

Semantic HTML
Labels for inputs
Keyboard navigation
Visible focus states
Alt text
Accessible buttons
Accessible dialogs
Proper contrast
Color is not the only status indicator
State Handling

Every data-driven screen should account for:

Loading

Use skeletons or subtle loading indicators.

Empty

Explain what happened and provide the next useful action.

Error

Explain the issue and provide retry/recovery.

Success

Provide clear confirmation.

Do not leave blank screens.

API Integration

Use the existing API/service layer.

Do not put large API calls directly inside presentational components if the project already has a service architecture.

Do not duplicate API logic.

Do not create fake local data to make screens appear functional.

Use mock/demo data only where the existing feature genuinely has no backend data, and clearly treat it as development data.

Security

Never render:

Passwords
JWT tokens
Verification answers
Internal security metadata
Sensitive user information

Only expose data already intended for the current user.

Code Quality

Keep components:

Small
Reusable
Readable
Maintainable

Avoid:

Huge components
Duplicated markup
Inline style explosions
Arbitrary colors
Arbitrary spacing everywhere
Unnecessary state
Unnecessary dependencies

Prefer existing project patterns.

Final Verification

After implementation:

Run the frontend.
Run the backend.
Check all routes.
Check authentication.
Check API calls.
Check forms.
Check item browsing.
Check matching.
Check claims.
Check verification.
Check resolved states.
Check mobile layouts.
Check desktop layouts.
Fix console errors.
Fix build errors.
Fix visual inconsistencies.

Do not stop after making the homepage.

The entire application should feel like one cohesive product.

Final Goal

The finished application should look and feel like the approved Stitch design while retaining the existing LostLink functionality.

The result should communicate:

TRUSTWORTHY
PRECISE
FAST
CALM
USEFUL

The primary product journey must remain visually obvious:

REPORT → SEARCH → MATCH → VERIFY → RECOVER