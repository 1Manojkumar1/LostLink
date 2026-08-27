# PRD.md

# LostLink — Product Requirements Document

> A smart campus Lost-and-Found platform for reporting, discovering, matching, verifying, and recovering lost belongings.

---

# 1. Product Overview

## Product Name

LostLink

## Product Type

Campus Lost-and-Found Platform

## Target Users

- Students
- Faculty
- Campus staff
- Authorized administrators

## Primary Platform

Web application

## Technology

MERN Stack:

- MongoDB
- Express.js
- React
- Node.js

Supporting technologies:

- JWT
- bcrypt
- Tailwind CSS
- Axios
- React Router
- Cloudinary (optional)
- Lucide React

---

# 2. Product Vision

LostLink aims to make campus lost-and-found management faster, more organized, and more reliable.

Instead of depending on:

- WhatsApp groups
- Telegram groups
- Notice boards
- Word of mouth
- Manual searching
- Scattered announcements

LostLink provides one centralized system where users can:

    REPORT
       ↓
    SEARCH
       ↓
    MATCH
       ↓
    VERIFY
       ↓
    RECOVER

The goal is not simply to create another listing platform.

The key value of LostLink is helping users discover potentially matching lost and found items and providing a secure way to verify ownership.

---

# 3. Problem Statement

Students frequently lose belongings such as:

- Mobile phones
- Laptops
- Wallets
- ID cards
- Keys
- Books
- Earphones
- Bags
- Chargers
- Watches
- Other personal belongings

Current campus lost-and-found processes are often fragmented.

A student who loses an item may have to:

1. Ask friends.
2. Search messaging groups.
3. Check campus offices.
4. Ask security staff.
5. Search notice boards.
6. Repeatedly ask whether someone found the item.

Similarly, someone who finds an item may not know how to locate its owner.

Even when a possible match exists, there may be no reliable ownership verification mechanism.

---

# 4. Product Opportunity

LostLink creates a single searchable source of truth for campus lost-and-found reports.

The system improves the process by combining:

- Structured reporting
- Search
- Filtering
- Similarity-based matching
- Ownership verification
- Claim management
- Recovery status

This reduces the effort required from both people who lose items and people who find them.

---

# 5. Product Goals

## Primary Goals

### Goal 1 — Centralize Reports

Provide one platform for campus lost-and-found reports.

### Goal 2 — Make Discovery Easy

Allow users to search and filter reports quickly.

### Goal 3 — Reduce Manual Matching

Automatically identify potentially matching lost and found items.

### Goal 4 — Improve Claim Reliability

Require ownership verification before a claim is approved.

### Goal 5 — Track Recovery

Clearly track the lifecycle of an item from report to resolution.

---

# 6. Non-Goals

The MVP will NOT attempt to build:

- A social network.
- A messaging platform.
- A complete campus ERP.
- A payment system.
- A real-time chat system.
- Facial recognition.
- Advanced computer vision.
- Complex AI infrastructure.
- A mobile application.
- Multi-university enterprise infrastructure.

These may be considered future enhancements.

---

# 7. Target Users

## 7.1 Student Who Lost an Item

Example:

A student loses a laptop in the library.

They need to:

- Report it quickly.
- Search existing found reports.
- Receive possible matches.
- Claim a matching item.
- Verify ownership.
- Recover the item.

---

# 7.2 Student Who Found an Item

Example:

A student finds a wallet in the cafeteria.

They need to:

- Report the found item.
- Add useful details.
- Provide a verification question.
- Receive potential claims.
- Review ownership verification.
- Approve the legitimate claim.

---

# 7.3 Administrator

An administrator may:

- Monitor reports.
- Remove inappropriate reports.
- Manage problematic users.
- Review claims.
- Monitor system activity.

Admin functionality is secondary to the MVP.

---

# 8. Core User Journey

The primary LostLink journey is:

    User
      ↓
    Report
      ↓
    Search
      ↓
    Match
      ↓
    Claim
      ↓
    Verify
      ↓
    Approve
      ↓
    Recover

---

# 9. Core Features

The MVP consists of:

1. User Authentication
2. Lost Item Reporting
3. Found Item Reporting
4. Item Browsing
5. Search
6. Filtering
7. Matching
8. Item Details
9. Claim Submission
10. Ownership Verification
11. Claim Approval/Rejection
12. Recovery/Resolution
13. User Dashboard

---

# 10. Feature Requirements

# 10.1 User Registration

Users must be able to create an account.

Required fields:

- Name
- Email
- Password

Requirements:

- Email must be valid.
- Email must be unique.
- Password must be securely hashed.
- User must receive an appropriate success/error response.

---

# 10.2 User Login

Users must be able to log in.

Required:

- Email
- Password

Flow:

    Email + Password
          ↓
    Find User
          ↓
    Verify Password
          ↓
    Generate JWT
          ↓
    Authenticate User

The frontend should maintain authentication state.

---

# 10.3 Logout

Users must be able to log out.

Logout should:

- Clear authentication state.
- Remove/clear the client-side token/session mechanism.
- Redirect to an appropriate public page.

---

# 10.4 Report Lost Item

Authenticated users must be able to report a lost item.

Required fields:

- Item name/title
- Category
- Description
- Location
- Date
- Optional image

Example:

    Item:
    Black HP Laptop

    Category:
    Electronics

    Description:
    Black HP laptop with a blue sticker
    near the HP logo.

    Location:
    Central Library

    Date:
    August 26, 2026

The system should associate the report with the authenticated user.

---

# 10.5 Report Found Item

Authenticated users must be able to report a found item.

Required fields:

- Item name/title
- Category
- Description
- Location
- Date
- Optional image
- Verification question
- Verification answer

The verification answer is private.

It must not be displayed in public item listings.

---

# 10.6 Item Type

Every item must have one of two primary types:

    LOST
    FOUND

The type must be stored in the database.

---

# 10.7 Item Status

Items should support:

    ACTIVE
    CLAIM_PENDING
    RESOLVED

Possible future statuses may be added later.

---

# 10.8 Browse Items

Users must be able to browse active lost and found reports.

Each item should display:

- Image
- Item name
- Type
- Category
- Location
- Date
- Status

Users should be able to open the item detail page.

---

# 10.9 Search

Users must be able to search for items.

Search should support relevant text from:

- Item title
- Description
- Category
- Location

Example:

    Search:
    laptop

Potential results:

    Black HP Laptop
    Dell Laptop Charger
    Laptop Bag

Search should happen through the backend.

---

# 10.10 Filtering

Users should be able to filter results by:

- Lost/Found
- Category
- Location
- Date
- Status

Example:

    Type: FOUND
    Category: Electronics
    Location: Library

The backend should apply the filters.

---

# 10.11 Item Details

Each item must have a dedicated details page.

The page should display:

- Item image
- Item title
- Type
- Category
- Description
- Location
- Date
- Status
- Reporter information where appropriate
- Possible matches where applicable
- Claim action where applicable

Private verification information must not be exposed.

---

# 10.12 Matching System

Matching is the primary intelligent feature of LostLink.

The system should compare:

- Category
- Location
- Description
- Date

Recommended scoring:

    Category       30%
    Location       25%
    Description    25%
    Date           20%

Total:

    100%

---

# 10.13 Matching Logic

Only compare:

    LOST ↔ FOUND

Do not compare:

    LOST ↔ LOST
    FOUND ↔ FOUND

Only active items should normally be considered for matching.

---

# 10.14 Match Score

Each candidate match should receive a score.

Example:

    Category:
    30/30

    Location:
    20/25

    Description:
    24/25

    Date:
    20/20

    TOTAL:
    94/100

Possible match threshold:

    >= 60%

Scores below the threshold should not be displayed as meaningful matches.

---

# 10.15 Match Ranking

Matches should be sorted from highest score to lowest score.

Example:

    94% MATCH
    86% MATCH
    74% MATCH
    63% MATCH

This allows the user to investigate the strongest candidates first.

---

# 10.16 Matching Reasons

The system should explain why an item is considered a match.

Example:

    94% MATCH

    ✓ Same category
    ✓ Similar location
    ✓ Similar description
    ✓ Same date

The explanation should make the matching system understandable.

---

# 10.17 Claim Item

A user who believes they own a found item must be able to submit a claim.

The claim should include:

- Item ID
- Claimant ID
- Verification answer

The claimant should not automatically receive ownership.

---

# 10.18 Ownership Verification

Found-item reporters must provide:

    Verification Question
    Verification Answer

Example:

    Question:
    What sticker is on the laptop?

    Answer:
    Blue star sticker

A claimant sees:

    What sticker is on the laptop?

They enter:

    Blue star sticker

The backend validates the answer.

---

# 10.19 Verification Security

The verification answer must never be returned through normal public APIs.

Never send:

    verificationAnswer

to the frontend for public item details.

Verification must occur server-side.

---

# 10.20 Claim Status

Claims should support:

    PENDING
    APPROVED
    REJECTED

Flow:

    Claim
      ↓
    PENDING
      ↓
    +---------+
    |         |
    v         v
 APPROVED   REJECTED
    |
    v
 RESOLVED

---

# 10.21 Claim Approval

The appropriate item owner/finder or authorized administrator must be able to approve a claim.

When approved:

    Claim = APPROVED
    Item = RESOLVED

---

# 10.22 Claim Rejection

The appropriate item owner/finder or authorized administrator must be able to reject a claim.

When rejected:

    Claim = REJECTED
    Item remains ACTIVE

The item can receive another legitimate claim.

---

# 10.23 Recovery

When a legitimate claim is approved:

The item should be marked:

    RESOLVED

The dashboard should reflect the recovered item.

---

# 10.24 User Dashboard

Authenticated users should have a dashboard.

The dashboard should show:

- My lost reports
- My found reports
- Possible matches
- Claims
- Recovered items

Possible summary cards:

    LOST ITEMS
    FOUND ITEMS
    POSSIBLE MATCHES
    RECOVERED

Do not display fake statistics.

All numbers must come from real database data.

---

# 11. User Stories

## Authentication

### US-001

As a student, I want to create an account so that I can report and claim items.

Acceptance criteria:

- Registration form exists.
- Required fields are validated.
- Duplicate email is rejected.
- Password is securely stored.
- Successful registration is handled correctly.

---

### US-002

As a student, I want to log in so that I can access my reports and claims.

Acceptance criteria:

- Valid credentials authenticate the user.
- Invalid credentials are rejected.
- Authentication state is maintained.
- Protected routes require authentication.

---

# Reporting

### US-003

As a student, I want to report a lost item so that others can identify it if found.

Acceptance criteria:

- User can select LOST.
- Required item details are collected.
- Item is stored in MongoDB.
- Item is associated with the logged-in user.
- Item appears in browse/search results.

---

### US-004

As a student, I want to report a found item so that its owner can find it.

Acceptance criteria:

- User can select FOUND.
- Required item details are collected.
- Verification question is required.
- Verification answer is stored securely.
- Answer is not exposed publicly.

---

# Search

### US-005

As a student, I want to search for an item so that I can quickly find relevant reports.

Acceptance criteria:

- Search field is available.
- Search request reaches backend.
- Results are filtered.
- Results can be opened.

---

### US-006

As a student, I want to filter reports so that I can narrow down results.

Acceptance criteria:

- Lost/Found filtering works.
- Category filtering works.
- Location filtering works.
- Date/status filtering works where implemented.

---

# Matching

### US-007

As a student, I want LostLink to identify possible matches so that I don't have to manually inspect every report.

Acceptance criteria:

- Lost reports can be compared with found reports.
- Matching uses defined weighted criteria.
- Match scores are generated.
- Matches are ranked.
- Matching reasons are displayed.

---

# Claims

### US-008

As a student, I want to claim a found item so that I can recover my property.

Acceptance criteria:

- Claim action is available when appropriate.
- User can answer verification question.
- Claim is stored.
- Claim receives PENDING status.

---

### US-009

As a finder, I want to review claims so that I can determine whether the claimant is the owner.

Acceptance criteria:

- Finder can see pending claims for their found item.
- Finder can approve or reject.
- Unauthorized users cannot approve/reject the claim.

---

### US-010

As a finder, I want approved items to become resolved so that the system reflects successful recovery.

Acceptance criteria:

- Approved claim becomes APPROVED.
- Item becomes RESOLVED.
- Dashboard reflects recovery.

---

# 12. Functional Requirements

## FR-001 Authentication

The system shall support user registration and login.

## FR-002 Authorization

The system shall restrict protected actions to authorized users.

## FR-003 Lost Reports

The system shall allow authenticated users to create lost-item reports.

## FR-004 Found Reports

The system shall allow authenticated users to create found-item reports.

## FR-005 Item Search

The system shall allow users to search reports.

## FR-006 Item Filtering

The system shall allow users to filter reports.

## FR-007 Item Details

The system shall provide detailed information for each item.

## FR-008 Matching

The system shall identify possible lost/found matches.

## FR-009 Match Ranking

The system shall rank matches based on similarity score.

## FR-010 Claims

The system shall allow users to submit claims.

## FR-011 Verification

The system shall validate claim answers on the backend.

## FR-012 Claim Approval

Authorized users shall be able to approve claims.

## FR-013 Claim Rejection

Authorized users shall be able to reject claims.

## FR-014 Resolution

Approved claims shall resolve the associated item.

## FR-015 Dashboard

The system shall provide users with an overview of their activity.

---

# 13. Non-Functional Requirements

## Performance

The application should:

- Load common pages quickly.
- Avoid unnecessary API requests.
- Perform filtering on the backend.
- Avoid fetching unnecessary data.
- Keep matching efficient for hackathon-scale datasets.

---

## Security

The system must:

- Hash passwords.
- Use JWT authentication.
- Validate requests.
- Protect private routes.
- Check resource ownership.
- Protect verification answers.
- Avoid exposing secrets.

---

## Reliability

The system should:

- Handle API errors gracefully.
- Display meaningful frontend error messages.
- Avoid crashes caused by invalid input.
- Maintain consistent item/claim state.

---

## Usability

Users should be able to:

- Understand the product immediately.
- Report an item quickly.
- Search without learning complex controls.
- Understand match scores.
- Understand claim status.
- Know what action to take next.

---

## Accessibility

The application should support:

- Keyboard navigation.
- Clear labels.
- Visible focus states.
- Accessible buttons.
- Alt text for images.
- Sufficient contrast.
- Non-color status communication.

---

# 14. Data Requirements

## User

Required:

    _id
    name
    email
    password
    role
    createdAt
    updatedAt

---

## Item

Required:

    _id
    title
    description
    category
    type
    location
    date
    status
    userId
    createdAt
    updatedAt

Optional:

    image

For FOUND:

    verificationQuestion
    verificationAnswer

---

## Claim

Required:

    _id
    itemId
    claimantId
    answer
    status
    createdAt
    updatedAt

---

# 15. Business Rules

## Rule 1

Only authenticated users can report items.

## Rule 2

Only authenticated users can submit claims.

## Rule 3

Users can only modify their own reports unless they are authorized administrators.

## Rule 4

Verification answers must remain private.

## Rule 5

Only FOUND items can normally be claimed.

## Rule 6

A LOST item cannot be claimed directly.

## Rule 7

Only LOST and FOUND items should be considered for matching.

## Rule 8

Only opposite item types should be compared.

## Rule 9

Resolved items should not normally appear as active matches.

## Rule 10

Only authorized users can approve or reject claims.

## Rule 11

Approving a valid claim changes the item to RESOLVED.

## Rule 12

Rejecting a claim does not resolve the item.

---

# 16. Item Lifecycle

    REPORT
       ↓
    ACTIVE
       ↓
    MATCH FOUND
       ↓
    CLAIM
       ↓
    CLAIM_PENDING
       ↓
    VERIFY
       ↓
    APPROVE / REJECT

Approve:

    APPROVED
       ↓
    RESOLVED

Reject:

    REJECTED
       ↓
    ITEM REMAINS ACTIVE

---

# 17. Claim Lifecycle

    CREATED
       ↓
    PENDING
       ↓
    +-----------+
    |           |
    v           v
 APPROVED    REJECTED

---

# 18. Matching Requirements

The matching engine should initially use deterministic logic.

Recommended:

    Category = 30 points
    Location = 25 points
    Description = 25 points
    Date = 20 points

Maximum:

    100 points

The system should provide a deterministic score for the same input.

---

# 19. Description Matching

Initial description matching should be lightweight.

Recommended process:

    Convert to lowercase
          ↓
    Remove punctuation
          ↓
    Tokenize
          ↓
    Remove common words
          ↓
    Compare meaningful words
          ↓
    Calculate similarity

Do not depend on external AI APIs for the MVP.

---

# 20. Future AI Matching

Future versions may add:

- Text embeddings
- Semantic similarity
- Image similarity
- OCR
- Computer vision

These are NOT required for MVP completion.

---

# 21. Image Requirements

Images are optional.

If implemented:

- Users can upload an item image.
- Images are stored externally.
- MongoDB stores the image URL.
- Images should be optimized.
- Image display should be responsive.

Recommended service:

Cloudinary.

---

# 22. API Requirements

Base API:

    /api

Authentication:

    POST /api/auth/register
    POST /api/auth/login

Items:

    GET    /api/items
    POST   /api/items
    GET    /api/items/:id
    PUT    /api/items/:id
    DELETE /api/items/:id

Matching:

    GET /api/items/:id/matches

Claims:

    POST  /api/claims
    GET   /api/claims
    PATCH /api/claims/:id/approve
    PATCH /api/claims/:id/reject

The exact API structure may be adjusted during implementation if required by the architecture.

---

# 23. API Query Examples

Search:

    GET /api/items?search=laptop

Filter:

    GET /api/items?type=FOUND

Combined:

    GET /api/items?search=laptop&type=FOUND&category=Electronics

Pagination if required:

    GET /api/items?page=1&limit=20

---

# 24. API Security Requirements

Protected endpoints must verify:

    Authorization: Bearer <JWT>

Backend must determine the user identity from the validated token.

Do not trust:

    userId

sent from the frontend.

The authenticated user's identity must come from the server-side authentication context.

---

# 25. Frontend Requirements

The frontend must provide:

    Home
    Login
    Register
    Browse Items
    Report Item
    Item Details
    Matches
    Dashboard

Reusable components should include:

    Navbar
    Button
    Input
    SearchBar
    FilterPanel
    ItemCard
    MatchCard
    StatusBadge
    Modal
    ClaimModal
    EmptyState
    LoadingState

---

# 26. Dashboard Requirements

The dashboard should provide:

## Summary

    My Lost Items
    My Found Items
    Possible Matches
    Recovered Items

## Possible Matches

Show strongest matches first.

## Pending Claims

Show claims requiring user action.

## My Reports

Show user's active and resolved reports.

---

# 27. UI/UX Requirements

The application must follow DESIGN.md.

Important characteristics:

- Dark interface
- Minimal UI
- High contrast
- Professional appearance
- Indigo primary action
- Grayscale-dominant design
- 8px spacing system
- 12px card radius
- 8px button radius
- Lucide icons
- Inter typography
- JetBrains Mono for technical information
- No gradients
- No glassmorphism
- No decorative blobs
- No excessive shadows
- Minimal animations

---

# 28. Landing Page Requirements

The landing page must communicate the product within seconds.

Hero:

    LOST SOMETHING?
    FIND IT FASTER.

Supporting text:

    LostLink connects lost and found reports
    across your campus using smart matching
    and secure ownership verification.

Primary actions:

    Report Lost Item
    Report Found Item

Search should also be visible.

---

# 29. Product Differentiator

The key differentiator is:

    SMART MATCHING + SECURE VERIFICATION

LostLink should not be presented as simply:

    "A website where you post lost items."

It should be presented as:

    "A centralized system that actively helps connect
     lost reports with found reports and verifies claims."

---

# 30. Success Criteria

The MVP is successful if a user can complete the entire workflow.

Example:

    Student A
       ↓
    Reports LOST laptop
       ↓
    Student B
       ↓
    Reports FOUND laptop
       ↓
    Matching Engine
       ↓
    94% POSSIBLE MATCH
       ↓
    Student A
       ↓
    Claims item
       ↓
    Answers verification question
       ↓
    Student B
       ↓
    Approves claim
       ↓
    Item becomes RESOLVED

This end-to-end flow is the most important demonstration of LostLink.

---

# 31. Hackathon Demo Flow

The recommended live demonstration should follow this sequence:

## Step 1

Register/login as Student A.

## Step 2

Report a lost item.

Example:

    Black HP Laptop
    Electronics
    Central Library
    Aug 26

## Step 3

Switch to Student B.

## Step 4

Report a found item.

Use intentionally similar information.

## Step 5

Open matches.

Show:

    94% MATCH

## Step 6

Return to Student A.

Open the possible match.

## Step 7

Submit a claim.

Answer the verification question.

## Step 8

Switch to Student B.

Show pending claim.

## Step 9

Approve the claim.

## Step 10

Show:

    CLAIM APPROVED
    ITEM RESOLVED

This demonstrates the entire product value proposition.

---

# 32. MVP Priority

## P0 — Must Have

These features are mandatory.

    Authentication
    Report Lost
    Report Found
    Browse Items
    Search
    Filtering
    Item Details
    Matching
    Claim
    Verification
    Approve/Reject
    Resolution
    Dashboard

---

# 33. P1 — Should Have

If sufficient development time exists:

    Image Upload
    Better Match Explanations
    Pagination
    Admin Dashboard
    Improved Mobile UX
    Notifications

---

# 34. P2 — Future

Not required for hackathon MVP:

    Semantic AI Matching
    Image Similarity
    OCR
    Push Notifications
    Email Notifications
    QR Codes
    Mobile Application
    Multi-Campus Support
    Advanced Analytics
    Recommendation Engine

---

# 35. Acceptance Criteria

The product is ready for hackathon demonstration when:

## Authentication

- User can register.
- User can log in.
- Protected routes work.
- Logout works.

## Reporting

- User can report LOST item.
- User can report FOUND item.
- Data is stored correctly.
- Reporter is associated with the item.

## Discovery

- Items can be browsed.
- Search works.
- Filters work.
- Item details work.

## Matching

- LOST and FOUND items are compared.
- Scores are generated.
- Matches are ranked.
- Matching reasons are displayed.

## Claims

- User can submit a claim.
- Verification is performed.
- Claim status is stored.
- Finder can approve/reject.

## Recovery

- Approved claim resolves the item.
- Resolved item is reflected in the dashboard.
- Resolved items are no longer treated as active matches.

---

# 36. Error Handling Requirements

The system should handle:

- Invalid login
- Duplicate registration
- Missing fields
- Invalid item ID
- Unauthorized access
- Unauthorized claim approval
- Invalid verification answer
- Duplicate claim
- Database errors
- Image upload errors
- Network failures

Users should receive understandable messages.

Avoid exposing technical stack traces.

---

# 37. Loading States

The UI should provide loading feedback for:

- Login
- Registration
- Report submission
- Search
- Matching
- Claim submission
- Approval/rejection
- Image upload

Use compact loaders or skeletons.

Avoid unnecessary full-screen loading states.

---

# 38. Empty States

Examples:

## No Reports

    NO REPORTS YET

    Start by reporting a lost or found item.

    [Report Lost]
    [Report Found]

## No Matches

    NO STRONG MATCHES

    We couldn't find a strong match yet.
    New reports may create one later.

## No Claims

    NO CLAIMS YET

    Claims submitted for your found items
    will appear here.

---

# 39. Security Requirements

Minimum security:

    bcrypt password hashing
    JWT authentication
    Backend validation
    Authorization checks
    Protected routes
    Ownership checks
    Private verification answers
    Environment variables for secrets

Never:

    Store plaintext passwords
    Return verification answers
    Trust frontend user IDs
    Commit .env files
    Expose JWT secrets
    Allow unauthorized claim approval

---

# 40. Performance Requirements

The application should prioritize:

    Fast page loads
    Efficient database queries
    Backend filtering
    Minimal API calls
    Efficient matching
    Optimized images

For matching:

    Fetch candidate items once
          ↓
    Calculate scores in memory
          ↓
    Sort results
          ↓
    Return top matches

Do not perform a separate database query for every candidate.

---

# 41. Analytics

The MVP should not require a complex analytics system.

If useful, track simple real metrics such as:

    Number of reports
    Number of matches
    Number of claims
    Number of recovered items

Only display metrics that are actually stored/calculated.

---

# 42. Admin Requirements

Optional admin features:

    View reports
    Remove inappropriate reports
    View claims
    Manage users
    View recovery statistics

Admin functionality must not delay the core lost-to-recovered workflow.

---

# 43. Technical Constraints

The implementation should use:

    React
    Node.js
    Express.js
    MongoDB
    Mongoose

Authentication:

    JWT
    bcrypt

Frontend:

    React Router
    Axios
    Tailwind CSS
    Lucide React

Optional:

    Cloudinary

Do not introduce additional infrastructure unless there is a clear requirement.

---

# 44. Architecture Constraints

Do not introduce:

- Microservices
- GraphQL
- Redis
- Kafka
- Elasticsearch
- Vector databases
- Complex AI pipelines
- Separate matching servers
- Unnecessary cloud infrastructure

The project is intentionally designed as a modular monolithic MERN application.

---

# 45. Definition of Done

A feature is considered complete only when:

1. Frontend UI exists.
2. Backend API exists.
3. Database integration works.
4. Validation exists.
5. Authentication/authorization is correct.
6. Loading state exists where necessary.
7. Error state exists.
8. Success state exists where appropriate.
9. Responsive behavior works.
10. The feature works in the end-to-end application flow.

---

# 46. Development Priorities

Development should follow this order:

    1. Project setup
    2. Database connection
    3. User authentication
    4. Item models
    5. Item reporting
    6. Item browsing
    7. Search/filtering
    8. Matching engine
    9. Claims
    10. Verification
    11. Approval/rejection
    12. Dashboard
    13. UI polish
    14. Testing
    15. Deployment

Do not spend significant time polishing the UI before the core workflow works.

---

# 47. Recommended Development Phases

## Phase 1 — Foundation

Build:

- Repository
- React application
- Express server
- MongoDB connection
- Environment configuration
- Basic routing

---

## Phase 2 — Authentication

Build:

- Registration
- Login
- JWT
- Password hashing
- Auth middleware
- Protected routes

---

## Phase 3 — Lost & Found

Build:

- Item model
- Report Lost
- Report Found
- Browse items
- Item details
- Search
- Filters

---

## Phase 4 — Smart Matching

Build:

- Matching service
- Category scoring
- Location scoring
- Description similarity
- Date scoring
- Match ranking
- Match explanations

---

## Phase 5 — Claims & Verification

Build:

- Claim model
- Claim submission
- Verification question
- Verification answer validation
- Pending claims
- Approve/reject
- Resolution

---

## Phase 6 — Polish & Demo

Build:

- Dashboard
- Responsive UI
- Loading states
- Error states
- Empty states
- Image upload if time permits
- Testing
- Deployment
- Demo data
- Presentation preparation

---

# 48. Product Risks

## Risk 1 — Poor Matching

If descriptions are too different, keyword matching may fail.

Mitigation:

- Use category.
- Use location.
- Use date.
- Normalize text.
- Use weighted scoring.
- Explain match reasons.

---

## Risk 2 — False Claims

Someone may attempt to claim an item they do not own.

Mitigation:

- Verification question.
- Backend verification.
- Finder approval.
- Claim status.

---

## Risk 3 — Duplicate Reports

Multiple users may report the same item.

This is acceptable for MVP.

The matching system can help connect related reports.

Future versions may introduce duplicate detection.

---

## Risk 4 — Large Dataset

A very large number of reports may make naive matching expensive.

MVP mitigation:

- Filter by opposite item type.
- Consider active items only.
- Use database filtering.
- Calculate candidate scores efficiently.
- Limit returned matches.

Future:

- Database indexing.
- Embeddings.
- Vector search.

---

# 49. Future Product Vision

Future LostLink versions may become a complete intelligent campus recovery platform.

Potential evolution:

    LostLink
       |
       +-- Smart Text Matching
       |
       +-- Image Matching
       |
       +-- OCR
       |
       +-- Notifications
       |
       +-- QR Codes
       |
       +-- Campus Security Integration
       |
       +-- Mobile App
       |
       +-- Multi-Campus Network

The architecture should allow these capabilities to be added without rewriting the MVP.

---

# 50. Product Success Metrics

Potential real metrics:

## Discovery

    Search-to-detail rate

How often users open an item after searching.

## Matching

    Match acceptance rate

How often suggested matches lead to claims.

## Claims

    Claim approval rate

Percentage of claims approved.

## Recovery

    Recovery rate

Percentage of reported items that become resolved.

## Efficiency

    Time-to-recovery

Time between report creation and successful resolution.

These metrics should only be implemented when the underlying data is actually available.

---

# 51. Hackathon Value Proposition

LostLink demonstrates several important engineering concepts in one product:

    Full-stack development
    Authentication
    Database design
    REST APIs
    Search
    Filtering
    Algorithmic matching
    Similarity scoring
    Authorization
    Secure verification
    State management
    Responsive UI

The project should be presented as a practical problem-solving system rather than simply a CRUD application.

---

# 52. Competitive Differentiator

A basic lost-and-found website:

    POST ITEM
       ↓
    SEARCH ITEM

LostLink:

    REPORT
       ↓
    STRUCTURE DATA
       ↓
    SEARCH
       ↓
    AUTOMATIC MATCHING
       ↓
    MATCH SCORE
       ↓
    EXPLAIN MATCH
       ↓
    CLAIM
       ↓
    VERIFY OWNERSHIP
       ↓
    FINDER APPROVAL
       ↓
    RECOVER
       ↓
    RESOLVE

This workflow is the core product advantage.

---

# 53. Demo Data Strategy

For the hackathon demo, create realistic sample data.

Example:

LOST:

    Black HP Laptop
    Electronics
    Central Library
    Aug 26, 2026
    Blue sticker

FOUND:

    HP Black Laptop
    Electronics
    Library
    Aug 26, 2026
    Blue sticker

Expected:

    90%+ POSSIBLE MATCH

Verification:

    Question:
    What sticker is on the laptop?

    Answer:
    Blue sticker

Then demonstrate:

    Claim
      ↓
    Verify
      ↓
    Approve
      ↓
    RESOLVED

---

# 54. Demo Requirements

The demo must avoid unnecessary setup complexity.

The application should have:

- Two test users.
- Sample lost report.
- Sample found report.
- Working matching.
- Working claim.
- Working verification.
- Working approval.
- Working resolution.

The entire demonstration should be possible in a few minutes.

---

# 55. Final Product Definition

LostLink is:

> A smart campus Lost-and-Found platform that centralizes reports, intelligently connects lost and found items, verifies ownership, and tracks successful recovery.

The core product loop is:

    REPORT
       ↓
    DISCOVER
       ↓
    MATCH
       ↓
    CLAIM
       ↓
    VERIFY
       ↓
    APPROVE
       ↓
    RECOVER
       ↓
    RESOLVE

---

# 56. Final Product Principle

The project should optimize for:

    REAL PROBLEM
        +
    SIMPLE UX
        +
    USEFUL ALGORITHM
        +
    SECURE WORKFLOW
        +
    FAST IMPLEMENTATION
        +
    RELIABLE DEMO

Do not optimize for the number of features.

The most important thing is that the complete LostLink workflow works reliably from:

    Lost Report

to:

    Successful Recovery.

> Build the smallest reliable system that clearly demonstrates the problem, the solution, and the technical intelligence behind LostLink.