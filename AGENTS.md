# AGENTS.md

# LostLink — Smart Campus Lost & Found

## 1. PROJECT OVERVIEW

LostLink is a MERN-stack campus Lost-and-Found platform for a hackathon.

The system allows students to:

1. Report lost items.
2. Report found items.
3. Search lost/found items.
4. Filter items.
5. Match similar lost and found posts.
6. Claim found items.
7. Verify ownership using a verification question.
8. Approve or reject claims.
9. Mark successfully recovered items as resolved.

The project must remain simple, reliable, efficient, and hackathon-ready.

The priority is:

> Working product > unnecessary complexity.

---

# 2. OFFICIAL CORE REQUIREMENTS

The following four requirements are mandatory:

### 2.1 Post Lost or Found Items

Users must be able to post:

- Lost items
- Found items

Item information should include:

- Item name/title
- Category
- Description
- Location
- Date
- Image
- Type: LOST or FOUND
- Status

For FOUND items, support:

- Verification question
- Verification answer

---

### 2.2 Search Items

Users must be able to search items using:

- Item title
- Description
- Category

Support useful filters:

- LOST / FOUND
- Category
- Location
- Date
- Status

Search/filtering should preferably happen on the backend using MongoDB queries.

Do not retrieve the entire database into React just to perform filtering on the client.

---

### 2.3 Match Similar Lost and Found Posts

LostLink must identify potentially matching LOST and FOUND posts.

Use a simple deterministic weighted matching algorithm.

Do NOT require an external AI API for the MVP.

Recommended scoring:

- Category similarity: 30 points
- Location similarity: 25 points
- Description/keyword similarity: 25 points
- Date similarity: 20 points

Maximum score:

100 points.

Recommended display levels:

- 90–100: Very Strong Match
- 75–89: Strong Match
- 60–74: Possible Match
- Below 60: Do not display

The score must be calculated dynamically.

Never hardcode fake match scores.

---

### 2.4 Verification Before Claiming

A user must verify ownership before claiming a FOUND item.

The finder can provide:

- Verification question
- Verification answer

Claim flow:

    Claim Item
        ↓
    Verification Question
        ↓
    User submits answer
        ↓
    Backend verifies answer
        ↓
    Correct?
      /    \
    YES    NO
     ↓      ↓
  Claim   Reject
 Pending
     ↓
 Finder approves/rejects
     ↓
 Item becomes RESOLVED if approved

The verification answer must never be exposed to the frontend.

Verification must happen on the backend.

---

# 3. TECHNOLOGY STACK

## Frontend

Use:

- React
- Vite
- JavaScript
- Tailwind CSS
- React Router
- Axios
- React Context API

Optional:

- Recharts for dashboard charts

Do NOT add Redux unless there is a demonstrated need.

---

## Backend

Use:

- Node.js
- Express.js
- JavaScript
- REST API
- Mongoose
- JWT
- bcrypt/bcryptjs
- CORS
- dotenv
- express-validator

---

## Database

Use:

- MongoDB
- MongoDB Atlas
- Mongoose

Main collections:

- Users
- Items
- Claims

Do not introduce another database unless explicitly requested.

---

## Image Storage

Use Cloudinary if image upload is implemented.

Store image URLs in MongoDB.

Do not store large image binaries directly in MongoDB.

---

# 4. ARCHITECTURE

Use a simple MERN architecture:

    React
       ↓
    Axios
       ↓
    Express REST API
       ↓
    Mongoose
       ↓
    MongoDB Atlas

Supporting services:

    Authentication
        ↓
    JWT + bcrypt

    Images
        ↓
    Cloudinary

    Matching
        ↓
    JavaScript Matching Service

    Claims
        ↓
    Express + MongoDB

Do NOT use:

- Microservices
- GraphQL
- Kafka
- Redis
- Kubernetes
- Elasticsearch
- Vector databases
- Complex ML pipelines

unless explicitly requested.

---

# 5. PROJECT STRUCTURE

Prefer this structure:

    LostLink/
    │
    ├── client/
    │   ├── public/
    │   ├── src/
    │   │   ├── assets/
    │   │   ├── components/
    │   │   │   ├── Navbar.jsx
    │   │   │   ├── ItemCard.jsx
    │   │   │   ├── SearchBar.jsx
    │   │   │   ├── FilterPanel.jsx
    │   │   │   ├── MatchCard.jsx
    │   │   │   ├── ClaimModal.jsx
    │   │   │   └── StatusBadge.jsx
    │   │   │
    │   │   ├── pages/
    │   │   │   ├── Home.jsx
    │   │   │   ├── Login.jsx
    │   │   │   ├── Register.jsx
    │   │   │   ├── BrowseItems.jsx
    │   │   │   ├── ReportItem.jsx
    │   │   │   ├── ItemDetails.jsx
    │   │   │   ├── Matches.jsx
    │   │   │   └── Dashboard.jsx
    │   │   │
    │   │   ├── context/
    │   │   │   └── AuthContext.jsx
    │   │   │
    │   │   ├── services/
    │   │   │   ├── api.js
    │   │   │   ├── authService.js
    │   │   │   ├── itemService.js
    │   │   │   └── claimService.js
    │   │   │
    │   │   ├── hooks/
    │   │   ├── utils/
    │   │   ├── App.jsx
    │   │   └── main.jsx
    │   │
    │   └── package.json
    │
    ├── server/
    │   ├── config/
    │   │   └── db.js
    │   │
    │   ├── models/
    │   │   ├── User.js
    │   │   ├── Item.js
    │   │   └── Claim.js
    │   │
    │   ├── controllers/
    │   │   ├── authController.js
    │   │   ├── itemController.js
    │   │   └── claimController.js
    │   │
    │   ├── routes/
    │   │   ├── authRoutes.js
    │   │   ├── itemRoutes.js
    │   │   └── claimRoutes.js
    │   │
    │   ├── middleware/
    │   │   ├── authMiddleware.js
    │   │   ├── errorMiddleware.js
    │   │   └── validationMiddleware.js
    │   │
    │   ├── services/
    │   │   └── matchingService.js
    │   │
    │   ├── utils/
    │   │   ├── textSimilarity.js
    │   │   └── dateSimilarity.js
    │   │
    │   ├── server.js
    │   └── package.json
    │
    ├── .gitignore
    ├── README.md
    └── AGENTS.md

Do not create unnecessary folders.

---

# 6. DATABASE MODELS

## User

Fields:

    name
    email
    password
    role
    createdAt
    updatedAt

Roles:

    student
    admin

Passwords must always be hashed.

Never store plaintext passwords.

---

## Item

Fields:

    title
    description
    category
    type
    location
    date
    image
    status
    verificationQuestion
    verificationAnswer
    userId
    createdAt
    updatedAt

Type values:

    LOST
    FOUND

Status values:

    ACTIVE
    CLAIM_PENDING
    RESOLVED

Verification fields are primarily required for FOUND items.

---

## Claim

Fields:

    itemId
    claimantId
    answer
    status
    createdAt
    updatedAt

Status values:

    PENDING
    APPROVED
    REJECTED

---

# 7. API STRUCTURE

## Authentication

    POST /api/auth/register
    POST /api/auth/login
    GET  /api/auth/me

---

## Items

    POST   /api/items
    GET    /api/items
    GET    /api/items/:id
    PUT    /api/items/:id
    DELETE /api/items/:id

Search example:

    GET /api/items?search=laptop

Filter example:

    GET /api/items?type=FOUND&category=Electronics

Combined example:

    GET /api/items?search=laptop&type=FOUND&location=Library

---

## Matching

    GET /api/items/:id/matches

The matching endpoint should:

1. Verify that the item exists.
2. Determine whether it is LOST or FOUND.
3. Find active items of the opposite type.
4. Calculate similarity.
5. Remove low-score results.
6. Sort by score descending.
7. Return the best matches.

---

## Claims

    POST /api/claims
    GET /api/claims
    GET /api/claims/:id
    PUT /api/claims/:id/approve
    PUT /api/claims/:id/reject

---

# 8. AUTHENTICATION

Use:

- JWT for authentication
- bcrypt/bcryptjs for password hashing

Login flow:

    User
      ↓
    Email + Password
      ↓
    Backend
      ↓
    Verify credentials
      ↓
    Generate JWT
      ↓
    Frontend receives token

Protected actions include:

- Creating items
- Updating own items
- Deleting own items
- Viewing personal dashboard
- Claiming items
- Approving/rejecting appropriate claims

Never trust a userId supplied by the frontend.

Use the authenticated user's ID from the JWT.

---

# 9. AUTHORIZATION RULES

Users must only be able to modify their own items.

A user must NOT be able to:

- Edit another user's item.
- Delete another user's item.
- Approve their own claim.
- Access another user's private information.
- Modify claim status without authorization.

Admin functionality may be added later.

---

# 10. MATCHING ENGINE

Create:

    server/services/matchingService.js

The matching engine should be independent from Express route handlers.

Conceptual function:

    findMatches(item)

Process:

    1. Determine opposite type.
    2. Retrieve active opposite-type items.
    3. Compare category.
    4. Compare location.
    5. Compare date.
    6. Compare description.
    7. Calculate score.
    8. Filter low scores.
    9. Sort highest to lowest.
    10. Return matches.

---

# 11. MATCHING SCORE

Recommended:

    Category       = 30 points
    Location       = 25 points
    Description    = 25 points
    Date           = 20 points
    --------------------------------
    Maximum        = 100 points

Category:

    Same category → 30
    Different     → 0

Location:

    Exact match → high score
    Similar location → partial score
    Different location → low/no score

Date:

    Same date → 20
    1 day apart → 15
    2 days apart → 10
    3 days apart → 5
    More than 3 days → 0

Description:

Use keyword similarity.

Example:

    LOST:
    "black hp laptop blue sticker"

    FOUND:
    "black laptop hp with blue sticker"

Common meaningful words should increase similarity.

Normalize text before comparison:

- lowercase
- trim whitespace
- remove unnecessary punctuation
- optionally remove common stop words

Do not use complex NLP for the MVP.

---

# 12. MATCHING OUTPUT

Example:

    {
      itemId: "...",
      score: 94,
      reasons: [
        "Same category",
        "Similar location",
        "Similar description",
        "Same date"
      ]
    }

The frontend should display:

    POSSIBLE MATCH

    Black HP Laptop

    Match Score: 94%

    ✓ Same category
    ✓ Similar location
    ✓ Similar description
    ✓ Same date

    [View Item]

Do not hardcode 94%.

---

# 13. SEARCH AND FILTERING

Search should preferably happen in MongoDB.

Search fields:

- title
- description
- category
- location

Filters:

- type
- category
- location
- date
- status

Avoid loading a large dataset into React and filtering everything there.

Use backend query parameters.

---

# 14. CLAIM VERIFICATION

For FOUND items:

    verificationQuestion
    verificationAnswer

When a user claims:

    User
      ↓
    Claim request
      ↓
    Verification question
      ↓
    User enters answer
      ↓
    Backend compares answer
      ↓
    Correct?
      ↓
    Claim created

The correct answer must NEVER be returned by the public item API.

Wrong:

    {
      title: "Black Wallet",
      verificationAnswer: "blue"
    }

Correct:

    {
      title: "Black Wallet",
      verificationQuestion:
        "What color is the card holder?"
    }

The answer must remain server-side.

---

# 15. ITEM STATUS FLOW

Use:

    ACTIVE
       ↓
    CLAIM_PENDING
       ↓
    APPROVED
       ↓
    RESOLVED

Rejected claim:

    CLAIM_PENDING
       ↓
    REJECTED
       ↓
    Item can remain ACTIVE

Do not mark an item RESOLVED until the claim is actually approved.

---

# 16. FRONTEND COMPONENT RULES

Create reusable components.

Important components:

    Navbar
    ItemCard
    SearchBar
    FilterPanel
    MatchCard
    ClaimModal
    StatusBadge

Do not duplicate LOST and FOUND UI unnecessarily.

Use one reusable report form with:

    type = LOST

or:

    type = FOUND

---

# 17. MAIN PAGES

Required pages:

    /
    /login
    /register
    /items
    /report
    /items/:id
    /matches
    /dashboard

Optional:

    /admin

Do not create unnecessary pages unless there is a clear requirement.

---

# 18. UI/UX

The application should look like a real product, not a basic college CRUD project.

Use:

- Tailwind CSS
- Responsive design
- Consistent spacing
- Clear typography
- Rounded cards
- Clean forms
- Status badges
- Loading states
- Empty states
- Error states
- Confirmation dialogs where appropriate

Suggested status presentation:

    LOST       → red
    FOUND      → green
    PENDING    → yellow/orange
    RESOLVED   → blue/neutral

Avoid excessive animations.

Prioritize usability.

---

# 19. HOME PAGE

Recommended structure:

    LostLink

    Find What You Lost.
    Return What You Found.

    [Report Lost Item]
    [Report Found Item]

    Search Lost & Found

    Recently Reported Items

The home page should immediately communicate the purpose of LostLink.

---

# 20. REPORT ITEM FORM

Use a single reusable form.

Fields:

    Lost or Found
    Item Name
    Category
    Description
    Location
    Date
    Image

For FOUND:

    Verification Question
    Verification Answer

Required fields should be clearly marked.

Show validation errors next to fields.

---

# 21. ITEM CARD

Recommended information:

    Image
    Title
    Category
    Location
    Date
    LOST/FOUND status
    Current status
    View Details

Do not display sensitive verification information.

---

# 22. DASHBOARD

The student dashboard should show:

    My Lost Items
    My Found Items
    Possible Matches
    Pending Claims
    Recovered Items

Optional statistics:

    Total Lost
    Total Found
    Total Matches
    Total Recovered

Do not build complex analytics until the core application works.

---

# 23. OPTIONAL ADMIN DASHBOARD

Only implement after the MVP is complete.

Possible information:

    Total Reports
    Lost Items
    Found Items
    Possible Matches
    Recovered Items

Possible management actions:

- View reports
- Remove inappropriate reports
- Manage users
- Monitor claims

---

# 24. IMAGE UPLOAD

If implemented:

    React
      ↓
    Backend
      ↓
    Cloudinary
      ↓
    Image URL
      ↓
    MongoDB

MongoDB should store the image URL.

Do not store raw image binaries in MongoDB.

---

# 25. VALIDATION

Validate on BOTH frontend and backend.

Item validation:

- title required
- description required
- category required
- type required
- location required
- date required

FOUND item:

- verification question required
- verification answer required

Authentication:

- valid email
- password minimum length
- duplicate email handling

Never rely only on frontend validation.

---

# 26. ERROR HANDLING

Use a centralized error middleware.

Example API response:

    {
      "success": false,
      "message": "Item not found"
    }

Use appropriate status codes:

    200 → success
    201 → created
    400 → bad request
    401 → unauthorized
    403 → forbidden
    404 → not found
    500 → server error

Frontend should show meaningful error messages.

Never silently fail.

---

# 27. ENVIRONMENT VARIABLES

Use a `.env` file.

Example:

    MONGO_URI=
    JWT_SECRET=
    PORT=
    CLIENT_URL=

If Cloudinary is used:

    CLOUDINARY_CLOUD_NAME=
    CLOUDINARY_API_KEY=
    CLOUDINARY_API_SECRET=

Never hardcode secrets.

Never commit `.env`.

Add `.env` to `.gitignore`.

---

# 28. CODE QUALITY

Use:

    const
    let
    async/await
    try/catch

Prefer clear function names.

Good:

    calculateMatchScore()
    findActiveFoundItems()
    verifyClaimAnswer()
    getUserItems()

Avoid:

    calc()
    getData()
    doStuff()

Keep functions small.

Avoid huge controllers.

Use this separation:

    Routes
       ↓
    Controllers
       ↓
    Services
       ↓
    Models

Business logic such as matching belongs in services, not directly inside route definitions.

---

# 29. DEPENDENCY RULE

Before installing a new package, ask:

1. Is it actually necessary?
2. Can the feature be implemented with existing dependencies?
3. Will it increase complexity?
4. Does it solve a real requirement?

Do not add packages just because they are popular.

---

# 30. NO OVERENGINEERING

The following are explicitly unnecessary for the MVP:

- Redux
- TypeScript migration
- Next.js
- GraphQL
- PostgreSQL
- Firebase
- Redis
- Kafka
- Elasticsearch
- Vector database
- TensorFlow
- PyTorch
- Kubernetes
- Docker
- Microservices
- Complex AI pipelines

Use the simplest solution that satisfies the requirement.

---

# 31. FUTURE FEATURES

These are future enhancements, NOT MVP requirements:

- AI image similarity
- Image-based object recognition
- OCR for ID cards
- Semantic text embeddings
- Email notifications
- SMS notifications
- Push notifications
- QR-based item identification
- Mobile application
- Multi-campus support

Do not claim these features are implemented unless they actually are.

---

# 32. DEVELOPMENT PHASES

The project must be developed in six phases.

## PHASE 1 — Setup + Database

Implement:

- MERN setup
- MongoDB connection
- Mongoose
- User model
- Item model
- Claim model
- Project structure

Completion condition:

    Frontend runs
    Backend runs
    MongoDB connects
    Models work

---

## PHASE 2 — Authentication + Reporting

Implement:

- Register
- Login
- JWT
- bcrypt
- Authentication middleware
- LOST report
- FOUND report

Completion condition:

    A user can register,
    login,
    and successfully create
    LOST/FOUND reports.

---

## PHASE 3 — Browse + Search + Filters

Implement:

- Item listing
- Item details
- Search
- Category filter
- Type filter
- Location filter
- Date filter
- Status filter

Completion condition:

    Users can quickly find
    relevant lost/found items.

---

## PHASE 4 — Smart Matching

Implement:

- Matching service
- Category similarity
- Location similarity
- Date similarity
- Description similarity
- Weighted score
- Match threshold
- Match API
- Match UI

Completion condition:

    LOST item
       +
    matching FOUND item
       ↓
    Automatically detected
    possible match.

---

## PHASE 5 — Claim + Verification

Implement:

- Claim item
- Verification question
- Answer submission
- Server-side verification
- Claim status
- Finder approval
- Finder rejection
- Item resolution

Completion condition:

    Claim
      ↓
    Verify
      ↓
    Approve
      ↓
    Recovered

---

## PHASE 6 — Dashboard + Polish + Deployment

Implement:

- Student dashboard
- Optional admin dashboard
- Image upload
- Statistics
- Responsive UI
- Loading states
- Error states
- Security checks
- Testing
- Deployment

Completion condition:

    Complete application
    works from registration
    to item recovery.

---

# 33. DEVELOPMENT PRIORITY

Always prioritize:

    1. Authentication
    2. Item reporting
    3. Item listing
    4. Search
    5. Matching
    6. Claim verification
    7. Dashboard
    8. UI polish
    9. Optional features

If time becomes limited, stop optional features and make the core workflow reliable.

---

# 34. PRIMARY DEMO FLOW

The main hackathon demonstration should be:

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
    Possible Match
        ↓
    Student A claims
        ↓
    Verification Question
        ↓
    Correct Answer
        ↓
    Claim Pending
        ↓
    Student B approves
        ↓
    Item RESOLVED
        ↓
    ITEM RECOVERED

This workflow must work reliably.

---

# 35. TESTING REQUIREMENTS

Before declaring the project complete, test:

## Authentication

- Registration
- Duplicate email
- Login
- Wrong password
- Protected routes
- Logout

## Items

- Create LOST
- Create FOUND
- View items
- View individual item
- Search
- Filter
- Update own item
- Reject unauthorized update
- Delete own item
- Reject unauthorized deletion

## Matching

- Same category
- Different category
- Same location
- Different location
- Same date
- Different date
- Similar descriptions
- Different descriptions
- Correct score calculation
- Low-score filtering

## Claims

- Claim item
- Correct answer
- Incorrect answer
- Approve claim
- Reject claim
- Unauthorized approval
- Item becomes RESOLVED after approval

---

# 36. DEFINITION OF DONE

A feature is NOT complete just because the UI exists.

A feature is complete only when:

    Code implemented
         ↓
    API works
         ↓
    Database works
         ↓
    Frontend connected
         ↓
    Validation works
         ↓
    Error handling works
         ↓
    Authorization checked
         ↓
    Feature tested

---

# 37. AGENT OPERATING RULES

Every coding agent MUST:

1. Read AGENTS.md before making changes.
2. Inspect the existing code before modifying it.
3. Understand the current architecture.
4. Reuse existing components.
5. Reuse existing utilities.
6. Avoid unnecessary dependencies.
7. Avoid duplicate implementations.
8. Never rewrite working code without a reason.
9. Never change the architecture without approval.
10. Make focused changes.
11. Test changes before considering the task complete.
12. Report what was changed.
13. Report what was tested.
14. Report remaining issues if any.

---

# 38. MULTI-AGENT RULES

This project may be developed using multiple AI coding agents such as OpenCode with MiMo and Nemotron.

Agents must NOT independently redesign the application.

Recommended responsibilities:

    Planning Agent
        ↓
    Understand requirement
        ↓
    Break task into implementation steps

    Implementation Agent
        ↓
    Write code

    Review Agent
        ↓
    Review code and architecture

    Testing Agent
        ↓
    Test and identify bugs

Do not allow multiple agents to simultaneously rewrite the same files.

Before modifying a file:

1. Check current state.
2. Check recent changes.
3. Understand dependencies.
4. Make the smallest required change.

---

# 39. AGENT TASK EXECUTION FORMAT

When given a task, the agent should internally follow:

    REQUIREMENT
        ↓
    Inspect existing code
        ↓
    Identify affected files
        ↓
    Plan minimal changes
        ↓
    Implement
        ↓
    Test
        ↓
    Review
        ↓
    Report

Do not immediately start generating large amounts of code without inspecting the repository.

---

# 40. WHEN SOMETHING IS UNCLEAR

If a requirement is ambiguous:

1. Prefer the existing architecture.
2. Prefer the simplest implementation.
3. Do not introduce new technologies unnecessarily.
4. Do not invent business requirements.
5. Ask for clarification only when the ambiguity materially affects implementation.

For minor implementation decisions, choose the simplest reasonable option and document the assumption.

---

# 41. WHEN AN AGENT FINDS EXISTING BUGS

If a task reveals an unrelated bug:

- Do not silently rewrite unrelated modules.
- Fix it only if it blocks the requested feature.
- Otherwise report it separately.

Avoid scope creep.

---

# 42. PERFORMANCE PRINCIPLES

LostLink is a hackathon application, so prioritize practical efficiency.

Use:

- Backend filtering
- MongoDB queries
- Pagination if item count becomes large
- Database indexes for frequently queried fields
- Image URLs instead of storing image binaries
- Reusable frontend components
- Avoid unnecessary API calls

Do not prematurely optimize.

Measure first when optimization becomes necessary.

---

# 43. SECURITY PRINCIPLES

Always:

- Hash passwords.
- Validate user input.
- Protect private routes.
- Check ownership.
- Check authorization.
- Verify claims server-side.
- Never expose verification answers.
- Never trust frontend user IDs.
- Never commit secrets.
- Never log passwords or sensitive credentials.

---

# 44. FINAL MVP

LostLink MVP is considered successful when this complete flow works:

    REGISTER
       ↓
    LOGIN
       ↓
    REPORT LOST/FOUND
       ↓
    BROWSE
       ↓
    SEARCH/FILTER
       ↓
    SMART MATCH
       ↓
    CLAIM
       ↓
    VERIFY
       ↓
    APPROVE
       ↓
    RECOVER

Everything else is secondary.

---

# 45. FINAL PROJECT PRINCIPLE

Always optimize for:

    SIMPLICITY
        +
    RELIABILITY
        +
    SECURITY
        +
    GOOD UX
        +
    REAL PROBLEM SOLVING

The project should demonstrate that LostLink solves a real campus problem through:

    Centralized Reports
          +
    Efficient Search
          +
    Similarity Matching
          +
    Claim Verification
          +
    Complete Recovery Workflow

Do not make the project technically complicated just to make it look advanced.

Build a small system that works extremely well.