LostLink — Complete UI Redesign Brief
IMPORTANT INSTRUCTION

This is a complete visual redesign, not a UI improvement task.

Do NOT preserve the existing visual design, layout, component styling, spacing, or page composition.

Reimagine LostLink from scratch as a polished, production-quality campus Lost-and-Found platform.

Use the existing DESIGN.md as the design-system source of truth.

The final result should feel like a real product designed by a professional product-design team, not a generic AI-generated SaaS dashboard.

Product

LostLink is a centralized university Lost-and-Found platform.

The core user journey is:

REPORT → SEARCH → MATCH → VERIFY → RECOVER

Users can:

Report lost items.
Report found items.
Search lost and found items.
Filter results.
View item details.
Discover possible matches.
Claim found items.
Verify ownership.
Approve/reject claims.
Resolve recovered items.

The product should communicate:

Trust + clarity + speed + precision.

It is a campus utility, not a social network.

Design Direction

Create a dark, minimal, information-dense interface inspired by the visual quality and restraint of:

Linear
Vercel
GitHub
Raycast
Slack
Discord
Arc
Modern university portals

Do NOT copy these products.

Use them only as inspiration for:

Information hierarchy
Navigation
Density
Typography
Spacing
Interaction patterns
Professional visual polish
Critical Visual Principle

The UI must look like a real working application.

Prioritize functional product UI over decorative marketing visuals.

The user should immediately understand:

What LostLink does.
How to report an item.
How to search for an item.
How matching works.
How ownership is verified.
Existing Design System

Follow DESIGN.md exactly for:

Colors
Typography
Spacing
Border radius
Buttons
Cards
Inputs
Status colors
Icons
Responsive behavior
Accessibility
Animation

Do not invent a separate design system.

Do NOT Use

Absolutely avoid:

Giant gradients
Gradient text
Glowing buttons
Neon UI
Glassmorphism
Frosted glass
Decorative blobs
3D illustrations
Floating objects
Excessive shadows
Huge hero sections
Generic SaaS templates
Generic AI dashboards
Fake statistics
Fake testimonials
Fake activity feeds
Excessive rounded containers
Rainbow colors
Excessive animation
Decorative charts with no real purpose

Every visual element must serve a product purpose.

Overall Layout

Use a maximum content width of approximately 1200px.

Use strong alignment and consistent page boundaries.

The application should feel like a coherent product rather than separate pages designed independently.

Maintain consistent:

Navbar
Page header
Search
Filters
Cards
Buttons
Status badges
Forms
Modals
Empty states
Loading states
Primary Navigation

Create a professional sticky top navigation.

Desktop:

LostLink

Browse
Matches
Dashboard

Right side:

Report Lost
Report Found
User

The two reporting actions should remain highly visible.

Use the design system's primary button styling.

Mobile navigation should collapse cleanly without taking over the screen.

SCREEN 01 — LANDING PAGE

Design a strong but compact product landing page.

Do NOT create a huge marketing hero.

Hero should contain:

Small eyebrow:

CAMPUS LOST & FOUND

Headline:

Find what you lost.
Return what you found.

Supporting text explaining LostLink.

Primary actions:

Report Lost Item

Report Found Item

Also make search highly visible:

Search lost or found items...

Landing Product Preview

Instead of a decorative illustration, create a realistic LostLink application preview.

Show:

Search bar

Possible Match

Black HP Laptop

94% MATCH

Electronics · Central Library

✓ Same category
✓ Similar location
✓ Similar description
✓ Same date

View Match

The preview should demonstrate the core product differentiator.

Landing Flow

Show the product journey:

REPORT → SEARCH → MATCH → VERIFY → RECOVER

Use small icons, thin connectors, and compact labels.

Do not turn this into a large decorative infographic.

Landing Problem Section

Create three concise problems:

SCATTERED REPORTS

Lost information is spread across messages, groups, and notice boards.

MANUAL SEARCH

Students waste time checking multiple places.

UNCERTAIN CLAIMS

Finding an item does not always prove ownership.

Keep these compact and visually structured.

Landing Solution Section

Explain:

One place to report.
One system to match.
One secure way to recover.

Show the four-step workflow:

01 REPORT
02 DISCOVER
03 MATCH
04 VERIFY

Then recovery.

Landing Final CTA

End with a concise CTA.

Example:

Lost something? Start here.

[Report Lost Item]

[Report Found Item]

Do not add fake statistics or testimonials.

SCREEN 02 — BROWSE / SEARCH

Create the main item discovery interface.

Header:

Browse Items

Supporting description.

Large but compact search bar:

Search lost or found items...

Include search icon and optional / keyboard hint.

Below search:

Type
Category
Location
Date
Status

Use compact filters.

Results

Show result count.

Create a responsive item grid.

Desktop:

3 columns.

Tablet:

2 columns.

Mobile:

1 column.

Each card should clearly show:

Image
Status
Item name
Category
Location
Date
Action

Example:

LOST

Black HP Laptop

Electronics

Central Library
Aug 26, 2026

View Details

Do not make cards unnecessarily large.

SCREEN 03 — ITEM DETAILS

Create a professional item detail page.

Desktop:

Two-column layout.

Left:

Item image.

Right:

Status
Item title
Category
Location
Date
Description
Primary action

Example:

LOST

Black HP Laptop

Electronics

Central Library

Aug 26, 2026

Possible match information.

Primary action:

View Possible Matches

or:

Claim Item

depending on item state.

Below the main information:

Possible Matches

Show compact match cards.

SCREEN 04 — MATCHES

This is one of LostLink's most important screens.

Page:

Possible Matches

Supporting text:

Matches are ranked using category, location, date, and description similarity.

Create highly informative match cards.

Example:

POSSIBLE MATCH

Black HP Laptop

94% MATCH

Electronics · Central Library

✓ Same category
✓ Similar location
✓ Similar description
✓ Same date

[View Item]

[Claim Item]

The score should use JetBrains Mono.

Use a compact horizontal score indicator.

Do NOT create a giant circular gauge.

Scores:

90–100 = VERY STRONG MATCH
75–89 = STRONG MATCH
60–74 = POSSIBLE MATCH

Do not show matches below 60%.

SCREEN 05 — DASHBOARD

Create a polished user dashboard.

Header:

Dashboard

Welcome back, [Name]

Do not make this a generic analytics dashboard.

The dashboard should prioritize actual LostLink workflows.

Top statistics:

My Lost Items
My Found Items
Possible Matches
Recovered Items

Use compact statistic cards.

Dashboard Priority

First:

Possible Matches

Then:

Pending Claims

Then:

My Reports

Then:

Recovered Items

Possible matches should receive stronger visual emphasis than historical information.

Possible Match Example

Black HP Laptop

94% MATCH

Electronics · Central Library

✓ Same category
✓ Similar location

[View Match]

My Reports

Show compact report rows/cards with:

Item
Type
Status
Date
Action

SCREEN 06 — REPORT ITEM

Create a polished reporting workflow.

Header:

Report an Item

Toggle:

LOST | FOUND

Form fields:

Item Name
Category
Description
Location
Date
Image

For FOUND items additionally show:

Verification Question
Verification Answer

Primary action:

Submit Report

The form must feel simple and focused.

Use a clear visual hierarchy.

Do not make the form look like a generic admin form.

SCREEN 07 — VERIFICATION

Create a trustworthy ownership verification screen.

Title:

Verify Ownership

Supporting explanation.

Question:

What sticker is on the laptop?

Answer field.

Submit Verification

Use ShieldCheck icon.

Clearly communicate that the correct answer is not exposed.

Never visually reveal:

Correct answer
Internal matching information
Security data
SCREEN 08 — CLAIM STATUS

Design clear claim states.

Pending

CLAIM PENDING

Your verification was successful.

Waiting for the finder to approve the claim.

Approved

CLAIM APPROVED

The finder approved your claim.

The item can now be recovered.

Rejected

CLAIM REJECTED

The finder did not approve this claim.

Use semantic colors from DESIGN.md.

SCREEN 09 — FINDER CLAIM REVIEW

Create the finder-side claim review interface.

Show:

Item

Claim request

Verification status

Claimant response

Actions:

Approve Claim

Reject Claim

Do not expose the original verification answer.

The interface should feel secure and deliberate.

SCREEN 10 — RECOVERY / RESOLVED

Create a strong but restrained success state.

ITEM RECOVERED

✓ VERIFIED

✓ CLAIM APPROVED

✓ ITEM RESOLVED

Supporting message:

The claim has been approved and the item has been marked as recovered.

Button:

Back to Dashboard

Do not use confetti or excessive animation.

EMPTY STATES

Create useful empty states.

Example:

NO POSSIBLE MATCHES

We couldn't find a strong match yet.

New reports may create a match later.

[Browse Items]

Another:

NO REPORTS YET

Start by reporting a lost or found item.

[Report Lost]

[Report Found]

Do not use giant illustrations.

LOADING STATES

Use subtle skeleton loaders.

Avoid full-screen spinners.

Skeletons should match the actual content layout.

ERROR STATES

Create concise error UI.

Example:

SOMETHING WENT WRONG

We couldn't load the items.

Please try again.

[Try Again]

RESPONSIVE DESIGN

Design every screen for:

Mobile < 640px
Tablet 640–1024px
Desktop > 1024px

Mobile:

Single-column content.
Full-width cards.
Collapsed navigation.
Collapsible filters.
Single-column forms.
Comfortable touch targets.
Minimum 16px page padding.
No horizontal scrolling.

Desktop:

Maximum 1200px content.
12-column layout where appropriate.
Multi-column grids.
Two-column item details.
Efficient information density.
Component Consistency

Use one cohesive visual language across all screens.

Shared components should look identical wherever used:

Navbar
Button
Input
SearchBar
Filter
ItemCard
MatchCard
StatusBadge
StatCard
Modal
EmptyState
LoadingState

Do not redesign the same component differently on different screens.

Content Rules

Use realistic but clearly demonstrative campus data.

Good:

Black HP Laptop
Central Library
Student Center
Engineering Building
Blue Water Bottle
AirPods Case
Student ID Card
Keys

Do not create:

Fake user counts
Fake campus adoption numbers
Fake recovery percentages
Fake testimonials
Fake reviews

Visual Hierarchy

The interface should primarily use:

95% grayscale

with restrained use of:

Indigo → primary interaction

Green → verified/recovered

Red → lost/errors

Yellow → pending

Blue → informational/resolved

Do not turn entire cards into colored blocks.

Final Quality Requirement

The final Stitch design must look like a cohesive production application.

It should NOT look like:

A template
A Dribbble concept
A generic AI dashboard
A marketing landing page
A collection of unrelated screens

It should look like:

A real university product that students could use every day.

Prioritize:

Usability
Accessibility
Information hierarchy
Consistency
Performance
Visual polish

The final visual journey should always reinforce:

REPORT → SEARCH → MATCH → VERIFY → RECOVER

Start by establishing the core visual language and navigation, then design all screens using the same system.