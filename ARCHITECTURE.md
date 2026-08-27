# ARCHITECTURE.md

# LostLink — System Architecture

## 1. Purpose

LostLink is a MERN-stack campus Lost-and-Found platform designed to:

1. Allow students to report lost items.
2. Allow students to report found items.
3. Search and filter lost/found reports.
4. Identify potentially matching lost and found items.
5. Allow users to claim found items.
6. Verify ownership using a verification question.
7. Allow the finder to approve or reject claims.
8. Mark successfully recovered items as resolved.

The architecture is intentionally simple, modular, secure, and hackathon-friendly.

Primary principle:

> Working product > unnecessary complexity.

---

# 2. Architecture Principles

## 2.1 Simplicity First

Use the simplest technology that solves the requirement.

Do not introduce unnecessary infrastructure.

## 2.2 Separation of Concerns

Keep the following separate:

- UI logic
- API logic
- Business logic
- Database logic
- Authentication
- Matching logic

## 2.3 Security by Default

Authentication, authorization, input validation, and claim verification must happen on the backend.

## 2.4 Reusable Components

Frontend components should be reusable.

Backend services should contain reusable business logic.

## 2.5 API-First Communication

The frontend communicates with the backend through REST APIs.

## 2.6 MVP Before Advanced Features

Mandatory LostLink functionality must be completed before optional features.

---

# 3. High-Level Architecture

                         +---------------------+
                         |        USER         |
                         | Student / Admin     |
                         +----------+----------+
                                    |
                                    v
                         +---------------------+
                         |   React Frontend    |
                         |   + Vite            |
                         |   + Tailwind CSS    |
                         +----------+----------+
                                    |
                              HTTP / REST
                                    |
                                  Axios
                                    |
                                    v
                         +---------------------+
                         |   Express Server    |
                         |      Node.js        |
                         +----------+----------+
                                    |
                +-------------------+-------------------+
                |                   |                   |
                v                   v                   v
       +----------------+  +----------------+  +----------------+
       | Authentication |  |  Item Service  |  | Claim Service  |
       | JWT + bcrypt   |  |                |  |                |
       +----------------+  +-------+--------+  +-------+--------+
                                   |                   |
                                   v                   v
                           +---------------------------------+
                           |        Matching Service         |
                           | Weighted Similarity Algorithm   |
                           +----------------+----------------+
                                            |
                                            v
                                   +----------------+
                                   |    Mongoose    |
                                   +-------+--------+
                                           |
                                           v
                                   +----------------+
                                   |    MongoDB     |
                                   |  MongoDB Atlas |
                                   +----------------+

                                   Optional:
                                   +----------------+
                                   |   Cloudinary   |
                                   | Item Images    |
                                   +----------------+


---

# 4. Technology Architecture

## Frontend

React
  |
  +-- Vite
  +-- React Router
  +-- Context API
  +-- Axios
  +-- Tailwind CSS

## Backend

Node.js
  |
  +-- Express.js
       |
       +-- Routes
       +-- Controllers
       +-- Middleware
       +-- Services
       +-- Models

## Database

MongoDB
   |
   +-- Mongoose

## Authentication

JWT
+
bcrypt/bcryptjs

## Image Storage

Cloudinary

---

# 5. Repository Architecture

LostLink/
|
+-- client/
|
+-- server/
|
+-- AGENTS.md
+-- ARCHITECTURE.md
+-- README.md
+-- .gitignore

The frontend and backend are intentionally separated.

---

# 6. Frontend Architecture

## Directory Structure

client/
|
+-- public/
|
+-- src/
    |
    +-- assets/
    |
    +-- components/
    |   +-- Navbar.jsx
    |   +-- ItemCard.jsx
    |   +-- SearchBar.jsx
    |   +-- FilterPanel.jsx
    |   +-- MatchCard.jsx
    |   +-- ClaimModal.jsx
    |   +-- StatusBadge.jsx
    |
    +-- pages/
    |   +-- Home.jsx
    |   +-- Login.jsx
    |   +-- Register.jsx
    |   +-- BrowseItems.jsx
    |   +-- ReportItem.jsx
    |   +-- ItemDetails.jsx
    |   +-- Matches.jsx
    |   +-- Dashboard.jsx
    |
    +-- context/
    |   +-- AuthContext.jsx
    |
    +-- services/
    |   +-- api.js
    |   +-- authService.js
    |   +-- itemService.js
    |   +-- claimService.js
    |
    +-- hooks/
    |
    +-- utils/
    |
    +-- App.jsx
    +-- main.jsx
|
+-- package.json

---

# 7. Frontend Responsibilities

The frontend is responsible for:

- Rendering UI.
- Handling user interaction.
- Form validation for better UX.
- Sending API requests.
- Displaying API responses.
- Managing authentication state.
- Displaying loading states.
- Displaying errors.
- Displaying search/filter results.
- Displaying match results.
- Displaying claim status.

The frontend must NOT be responsible for:

- Password verification.
- JWT validation.
- Ownership authorization.
- Claim authorization.
- Verification answer validation.
- Final business-rule enforcement.

These belong to the backend.

---

# 8. Frontend Pages

## Home

Route:

/

Responsibilities:

- Introduce LostLink.
- Provide Report Lost button.
- Provide Report Found button.
- Provide search access.
- Show recently reported items.

## Login

Route:

/login

Responsibilities:

- Accept email/password.
- Call login API.
- Store authentication state.
- Redirect authenticated users.

## Register

Route:

/register

Responsibilities:

- Accept name/email/password.
- Call registration API.
- Handle validation errors.

## Browse Items

Route:

/items

Responsibilities:

- Display active reports.
- Search items.
- Filter items.
- Navigate to item details.

## Report Item

Route:

/report

Responsibilities:

- Create LOST report.
- Create FOUND report.
- Upload image if enabled.
- Collect verification information for FOUND items.

## Item Details

Route:

/items/:id

Responsibilities:

- Display item information.
- Display image.
- Display status.
- Display possible matches.
- Provide claim action where appropriate.

## Matches

Route:

/matches

Responsibilities:

- Display potential matches.
- Display match score.
- Display matching reasons.
- Navigate to matched items.

## Dashboard

Route:

/dashboard

Responsibilities:

- Display user's reports.
- Display possible matches.
- Display claims.
- Display recovered items.

---

# 9. Backend Architecture

## Directory Structure

server/
|
+-- config/
|   +-- db.js
|
+-- models/
|   +-- User.js
|   +-- Item.js
|   +-- Claim.js
|
+-- controllers/
|   +-- authController.js
|   +-- itemController.js
|   +-- claimController.js
|
+-- routes/
|   +-- authRoutes.js
|   +-- itemRoutes.js
|   +-- claimRoutes.js
|
+-- middleware/
|   +-- authMiddleware.js
|   +-- errorMiddleware.js
|   +-- validationMiddleware.js
|
+-- services/
|   +-- matchingService.js
|
+-- utils/
|   +-- textSimilarity.js
|   +-- dateSimilarity.js
|
+-- server.js
+-- package.json

---

# 10. Backend Layer Responsibilities

The backend follows:

Route
  |
  v
Middleware
  |
  v
Controller
  |
  v
Service
  |
  v
Model
  |
  v
MongoDB

---

# 11. Routes

Routes define API endpoints.

Examples:

POST /api/auth/login
GET  /api/items
POST /api/items
GET  /api/items/:id
POST /api/claims

Routes should remain thin.

Do not put complex business logic inside route files.

---

# 12. Controllers

Controllers handle:

- Request data.
- Authentication context.
- Calling services/models.
- Returning HTTP responses.
- Handling controller-level errors.

Example:

itemController.js

createItem()
getItems()
getItemById()
updateItem()
deleteItem()

Controllers should not contain large matching algorithms.

---

# 13. Services

Services contain business logic.

Primary service:

matchingService.js

Potential future services:

notificationService.js
imageService.js
analyticsService.js

Only create a service when there is meaningful business logic to isolate.

---

# 14. Middleware

## Authentication Middleware

Responsible for:

1. Reading JWT.
2. Validating JWT.
3. Identifying authenticated user.
4. Attaching user information to the request.

Flow:

Request
   |
   v
Authorization Header
   |
   v
JWT
   |
   v
Verify Token
   |
   v
Attach User
   |
   v
Controller

## Validation Middleware

Responsible for validating incoming request data.

Examples:

- Email format.
- Password.
- Item title.
- Item type.
- Category.
- Location.
- Date.

## Error Middleware

All unexpected API errors should eventually reach centralized error handling.

Example:

{
  "success": false,
  "message": "Item not found"
}

---

# 15. Database Architecture

MongoDB is the primary database.

Collections:

users
items
claims

---

# 16. User Data Model

Conceptual structure:

User
|
+-- _id
+-- name
+-- email
+-- password
+-- role
+-- createdAt
+-- updatedAt

Relationships:

User
  |
  +-- creates -> Items
  |
  +-- submits -> Claims

---

# 17. Item Data Model

Conceptual structure:

Item
|
+-- _id
+-- title
+-- description
+-- category
+-- type
+-- location
+-- date
+-- image
+-- status
+-- verificationQuestion
+-- verificationAnswer
+-- userId
+-- createdAt
+-- updatedAt

Relationship:

User
  |
  +-- userId -> Item

---

# 18. Claim Data Model

Conceptual structure:

Claim
|
+-- _id
+-- itemId
+-- claimantId
+-- answer
+-- status
+-- createdAt
+-- updatedAt

Relationships:

Item
  |
  +-- receives -> Claims

User
  |
  +-- submits -> Claims

---

# 19. Entity Relationship Overview

                 +--------------+
                 |     USER     |
                 +------+-------+
                        |
                creates|
                        v
                 +--------------+
                 |     ITEM     |
                 +------+-------+
                        |
                receives|
                        v
                 +--------------+
                 |    CLAIM     |
                 +------+-------+
                        |
                submitted by
                        |
                        v
                 +--------------+
                 |     USER     |
                 +--------------+

---

# 20. Item Lifecycle

                 CREATE
                   |
                   v
                ACTIVE
                   |
                   | claim submitted
                   v
             CLAIM_PENDING
              |          |
              |          |
           APPROVE     REJECT
              |          |
              v          v
           RESOLVED    ACTIVE

A rejected claim does not automatically resolve the item.

---

# 21. Lost Item Flow

Student
   |
   v
Report Lost Item
   |
   v
Frontend validates form
   |
   v
POST /api/items
   |
   v
Authentication Middleware
   |
   v
Validation
   |
   v
Item Controller
   |
   v
Item Model
   |
   v
MongoDB
   |
   v
Response
   |
   v
Frontend

---

# 22. Found Item Flow

Student
   |
   v
Report Found Item
   |
   v
Enter item information
   |
   v
Enter verification question
   |
   v
Enter verification answer
   |
   v
POST /api/items
   |
   v
Backend validation
   |
   v
Store item
   |
   v
MongoDB

The verification answer must not be exposed through normal public item responses.

---

# 23. Search Architecture

Search request:

React
  |
  v
Axios
  |
  v
GET /api/items?search=laptop
  |
  v
Express
  |
  v
Item Controller
  |
  v
MongoDB Query
  |
  v
Filtered Results
  |
  v
React

Search fields:

title
description
category
location

Filters:

type
category
location
date
status

---

# 24. Search Efficiency

The backend should perform filtering.

Avoid:

MongoDB
   |
   v
Return every item
   |
   v
React
   |
   v
Filter thousands of records

Prefer:

React
   |
   v
Search parameters
   |
   v
Backend
   |
   v
MongoDB query
   |
   v
Only relevant results

Pagination can be introduced if the number of reports grows significantly.

---

# 25. Matching Architecture

The matching system is a business-logic service.

GET /api/items/:id/matches
             |
             v
      Item Controller
             |
             v
      Matching Service
             |
             v
      Find opposite-type
      active items
             |
             v
       Compare items
             |
             v
       Calculate scores
             |
             v
       Filter results
             |
             v
       Sort results
             |
             v
      Return matches

---

# 26. Matching Algorithm

Each possible match receives a score from 0 to 100.

Recommended weights:

Category        30
Location        25
Description     25
Date            20
-------------------
Maximum        100

Example:

LOST ITEM

Black HP Laptop
Central Library
Aug 26
Blue sticker

FOUND ITEM

Black HP Laptop
Library
Aug 26
Blue sticker

Possible result:

Category      = 30
Location      = 20
Description   = 24
Date          = 20

Total         = 94

The actual score must be calculated dynamically.

---

# 27. Matching Service Architecture

matchingService.js
|
+-- findMatches()
|
+-- calculateMatchScore()
|
+-- calculateCategoryScore()
|
+-- calculateLocationScore()
|
+-- calculateDescriptionScore()
|
+-- calculateDateScore()

If appropriate, smaller functions may be placed in:

utils/

Do not create excessive abstractions.

---

# 28. Description Similarity

Initial implementation:

Text
 |
 v
Lowercase
 |
 v
Remove punctuation
 |
 v
Tokenize
 |
 v
Remove common words
 |
 v
Compare common keywords
 |
 v
Calculate similarity

Example:

"black hp laptop blue sticker"

and

"hp laptop black blue sticker"

should have high similarity.

Do not require an external AI model for the MVP.

---

# 29. Future Matching Upgrade

Current:

Weighted Keyword Matching

Future:

Text Embeddings
       |
       v
Semantic Similarity

Future:

Image
   |
   v
Computer Vision
   |
   v
Image Similarity

These are future enhancements.

Do not implement them unless explicitly requested.

---

# 30. Claim Architecture

Claim flow:

User
  |
  v
View Found Item
  |
  v
Claim Item
  |
  v
Enter Verification Answer
  |
  v
POST /api/claims
  |
  v
Authentication
  |
  v
Validate Claim
  |
  v
Verify Answer
  |
  v
Create Claim
  |
  v
CLAIM_PENDING

---

# 31. Verification Architecture

The verification answer must remain private.

Public item response:

{
  title,
  description,
  category,
  location,
  date,
  verificationQuestion
}

Do NOT return:

verificationAnswer

Claim request:

{
  itemId,
  answer
}

Backend:

Submitted Answer
      |
      v
Normalize
      |
      v
Compare
      |
      v
Correct?

---

# 32. Claim Approval

Finder receives:

Pending Claim

Then:

Approve

or:

Reject

Approval:

Claim -> APPROVED
Item  -> RESOLVED

Rejection:

Claim -> REJECTED
Item  -> ACTIVE

Authorization must ensure only the appropriate finder/item owner or authorized admin can approve or reject.

---

# 33. Authentication Architecture

Registration:

User
 |
 v
POST /api/auth/register
 |
 v
Validate
 |
 v
Check duplicate email
 |
 v
bcrypt hash password
 |
 v
Save User

Login:

User
 |
 v
POST /api/auth/login
 |
 v
Find User
 |
 v
bcrypt compare
 |
 v
Generate JWT
 |
 v
Return token

Protected request:

Frontend
 |
 v
Authorization: Bearer JWT
 |
 v
Auth Middleware
 |
 v
Verify JWT
 |
 v
Identify User
 |
 v
Controller

---

# 34. Authorization

Authentication answers:

> Who are you?

Authorization answers:

> Are you allowed to do this?

Rules:

User A cannot edit User B's item.

User A cannot delete User B's item.

User A cannot approve their own claim.

User A cannot approve another user's claim unless authorized as the appropriate finder/admin.

---

# 35. Image Architecture

If Cloudinary is enabled:

User
 |
 v
Select Image
 |
 v
React
 |
 v
Backend
 |
 v
Cloudinary
 |
 v
Image URL
 |
 v
MongoDB

MongoDB stores:

image: "https://..."

not the image binary.

---

# 36. API Response Structure

Use a consistent response structure where practical.

Success:

{
  "success": true,
  "data": {}
}

Error:

{
  "success": false,
  "message": "Something went wrong"
}

For lists:

{
  "success": true,
  "data": [],
  "pagination": {}
}

Do not create unnecessarily complicated response wrappers.

---

# 37. Error Handling Architecture

Route
 |
 v
Controller
 |
 v
Error
 |
 v
next(error)
 |
 v
Error Middleware
 |
 v
HTTP Response

Frontend:

API Error
 |
 v
Service
 |
 v
Component
 |
 v
User-friendly message

Never expose stack traces or internal database errors to normal users.

---

# 38. Validation Architecture

Frontend validation:

Better user experience

Backend validation:

Security and data integrity

Both should be used.

Example:

Frontend:
"Title is required"

Backend:
400 Bad Request
"Title is required"

Never depend only on frontend validation.

---

# 39. Security Architecture

Minimum security requirements:

Password
   |
   v
bcrypt

Authentication
   |
   v
JWT

Authorization
   |
   v
Ownership checks

Claims
   |
   v
Server-side verification

Secrets
   |
   v
.env

Never:

- Store plaintext passwords.
- Return verification answers.
- Trust frontend user IDs.
- Commit secrets.
- Allow arbitrary users to approve claims.

---

# 40. Environment Configuration

Backend:

MONGO_URI=
JWT_SECRET=
PORT=
CLIENT_URL=

Optional Cloudinary:

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

Frontend:

VITE_API_URL=

Never place secret keys in frontend environment variables.

---

# 41. State Management

Use React Context API for authentication state.

AuthContext
|
+-- user
+-- isAuthenticated
+-- login()
+-- logout()
+-- register()

Local component state should handle:

- Forms
- Search text
- Filters
- Modal visibility
- Loading state

Do not introduce Redux unless the application genuinely requires it.

---

# 42. Data Flow — Reporting an Item

ReportItem.jsx
      |
      v
itemService.createItem()
      |
      v
Axios
      |
      v
POST /api/items
      |
      v
Auth Middleware
      |
      v
Validation
      |
      v
itemController.createItem()
      |
      v
Item Model
      |
      v
MongoDB
      |
      v
Response
      |
      v
React
      |
      v
Success message

---

# 43. Data Flow — Searching

BrowseItems.jsx
      |
      v
SearchBar
      |
      v
itemService.getItems()
      |
      v
Axios
      |
      v
GET /api/items?search=laptop
      |
      v
itemController.getItems()
      |
      v
MongoDB query
      |
      v
Results
      |
      v
ItemCard components

---

# 44. Data Flow — Matching

ItemDetails.jsx
      |
      v
GET /api/items/:id/matches
      |
      v
itemController
      |
      v
matchingService
      |
      v
MongoDB
      |
      v
Candidate items
      |
      v
Similarity calculations
      |
      v
Sorted matches
      |
      v
React
      |
      v
MatchCard

---

# 45. Data Flow — Claim Verification

ClaimModal
      |
      v
User enters answer
      |
      v
POST /api/claims
      |
      v
Auth Middleware
      |
      v
Claim Controller
      |
      v
Find Item
      |
      v
Verify Answer
      |
      v
Create Claim
      |
      v
PENDING
      |
      v
Finder Dashboard
      |
      v
Approve / Reject
      |
      v
Item status update

---

# 46. Recommended Database Indexes

Potential indexes:

type
category
location
status
date

Search-related indexes should be added only when justified by actual query patterns.

Do not prematurely optimize.

---

# 47. Pagination

The initial MVP may work without pagination for a small hackathon dataset.

If needed:

GET /api/items?page=1&limit=20

Backend:

skip = (page - 1) * limit

Return:

items
currentPage
totalPages
totalItems

Implement pagination only when necessary.

---

# 48. Performance Principles

Prefer:

- Backend filtering
- MongoDB queries
- Pagination when needed
- Indexes when needed
- Reusable React components
- Minimal API calls

Avoid:

- Fetching entire database repeatedly
- Repeated duplicate API calls
- Huge React components
- Unnecessary global state
- Unnecessary services

Do not prematurely optimize.

---

# 49. Frontend Performance

Avoid unnecessary re-renders.

Use reusable components.

Do not introduce advanced optimization prematurely.

Only use:

useMemo
useCallback
React.memo

when there is a demonstrated performance problem.

---

# 50. Backend Performance

For matching:

Do not repeatedly query MongoDB for every individual comparison.

Prefer:

Fetch candidate items once
        |
        v
Perform comparisons in memory
        |
        v
Sort scores
        |
        v
Return results

For very large datasets, the architecture can later be upgraded.

For the hackathon, keep it simple.

---

# 51. Optional Admin Architecture

If implemented:

Admin
 |
 v
JWT
 |
 v
Role Check
 |
 v
Admin Routes
 |
 v
Admin Controller
 |
 v
MongoDB

Possible capabilities:

- View all reports
- Remove inappropriate reports
- Manage users
- Monitor claims
- View statistics

Admin functionality is secondary to the core LostLink workflow.

---

# 52. Testing Architecture

Testing should occur at three levels.

## API Testing

Use:

- Postman
- Thunder Client

Test:

- Authentication
- Items
- Search
- Matching
- Claims

## Frontend Testing

Test:

- Forms
- Navigation
- Search
- Filters
- Match display
- Claim flow

## End-to-End Manual Testing

Primary scenario:

Student A
 |
 v
Report LOST item

Student B
 |
 v
Report FOUND item

Matching Engine
 |
 v
Find match

Student A
 |
 v
Claim

Verification
 |
 v
Correct answer

Student B
 |
 v
Approve

Item
 |
 v
RESOLVED

---

# 53. Deployment Architecture

Recommended deployment:

                    USERS
                      |
                      v
              React Frontend
                      |
                      v
               Node/Express API
                      |
             +--------+--------+
             |                 |
             v                 v
        MongoDB Atlas      Cloudinary
          Database           Images

Frontend and backend can be deployed independently.

The backend connects to MongoDB Atlas through MONGO_URI.

---

# 54. Future Architecture

The current architecture should allow future enhancements without requiring a complete rewrite.

Potential future:

                    LOSTLINK
                       |
          +------------+------------+
          |            |            |
          v            v            v
       Text AI      Image AI      OCR
          |            |            |
          +------------+------------+
                       |
                       v
                Advanced Matching

Possible future features:

- Semantic text matching
- Image similarity
- OCR
- Push notifications
- Email notifications
- QR codes
- Mobile application
- Multi-campus support
- Advanced analytics

These should remain outside the MVP.

---

# 55. Architecture Constraints

Agents must NOT:

- Replace MongoDB with another database without approval.
- Replace React with another frontend framework.
- Replace Express with another backend framework.
- Add microservices.
- Add GraphQL.
- Add Redis without a demonstrated need.
- Add Elasticsearch without a demonstrated need.
- Add a vector database for the MVP.
- Add complex AI infrastructure for basic matching.
- Introduce unnecessary dependencies.
- Rewrite the architecture without approval.

---

# 56. Feature-to-Architecture Mapping

Requirement                  Main Components

Report Lost Item             React + Item API + Item Model
Report Found Item            React + Item API + Item Model
Search                       React + Express + MongoDB
Category Filtering           React + Express + MongoDB
Description Search           React + Express + MongoDB
Matching                     Matching Service + MongoDB
Verification                 Claim Service + Item Model
Claim                        Claim API + Claim Model
Approval                     Claim API + Authorization
Recovery                     Item Status
Authentication               React Context + JWT
Images                       Cloudinary + Item Model
Dashboard                    React + API + MongoDB

---

# 57. MVP Architecture

The MVP must contain:

React
   |
Express
   |
Mongoose
   |
MongoDB

+

JWT
+
bcrypt
+
Matching Service

Optional:

Cloudinary

---

# 58. Final Architecture

                         +------------------+
                         |      USERS       |
                         +--------+---------+
                                  |
                                  v
                    +-------------------------+
                    |     REACT FRONTEND      |
                    |                         |
                    | Home                    |
                    | Login/Register          |
                    | Browse                  |
                    | Report                  |
                    | Item Details            |
                    | Matches                 |
                    | Dashboard               |
                    +------------+------------+
                                 |
                              Axios
                                 |
                                 v
                    +-------------------------+
                    |    EXPRESS REST API     |
                    +------------+------------+
                                 |
              +------------------+------------------+
              |                  |                  |
              v                  v                  v
       +-------------+    +-------------+    +-------------+
       |    AUTH     |    |    ITEMS    |    |   CLAIMS    |
       |             |    |             |    |             |
       | JWT         |    | CRUD        |    | Verify      |
       | bcrypt      |    | Search      |    | Approve     |
       | Roles       |    | Filters     |    | Reject      |
       +-------------+    +------+------+\    +------+------+
                                  |                 |
                                  +--------+--------+
                                           |
                                           v
                              +----------------------+
                              |   MATCHING SERVICE   |
                              |                      |
                              | Category  30%        |
                              | Location  25%        |
                              | Description 25%      |
                              | Date      20%        |
                              +----------+-----------+
                                         |
                                         v
                              +----------------------+
                              |       MONGOOSE       |
                              +----------+-----------+
                                         |
                                         v
                              +----------------------+
                              |       MONGODB        |
                              |     MongoDB Atlas    |
                              |                      |
                              | Users                |
                              | Items                |
                              | Claims               |
                              +----------------------+

                              Optional:
                              +----------------------+
                              |      CLOUDINARY      |
                              |    Item Images       |
                              +----------------------+


---

# 59. PRIMARY BUSINESS FLOW

                    REPORT
                       |
                       v
              +----------------+
              |     ITEMS      |
              +-------+--------+
                      |
          +-----------+-----------+
          |           |           |
          v           v           v
       SEARCH      FILTER      MATCH
                                  |
                                  v
                           POSSIBLE MATCH
                                  |
                                  v
                                CLAIM
                                  |
                                  v
                               VERIFY
                                  |
                            +-----+-----+
                            |           |
                            v           v
                         APPROVE      REJECT
                            |           |
                            v           v
                        RESOLVED      ACTIVE
                            |
                            v
                         RECOVERED

---

# 60. Design Philosophy

LostLink should remain:

    SIMPLE
       +
    MODULAR
       +
    SECURE
       +
    EFFICIENT
       +
    EASY TO DEMONSTRATE

The central technical idea is:

> A centralized MERN platform combines searchable lost/found reports, similarity-based matching, and secure verification to improve the recovery of lost campus items.

---

# 61. Definition of Architectural Completion

The architecture is considered successfully implemented when:

1. React communicates with Express through REST APIs.
2. Express communicates with MongoDB through Mongoose.
3. Users can authenticate.
4. Users can create LOST and FOUND reports.
5. Users can search and filter reports.
6. The matching service calculates real similarity scores.
7. Users can submit claims.
8. Verification occurs on the backend.
9. Authorized users can approve/reject claims.
10. Approved claims resolve the item.
11. The complete recovery workflow works end-to-end.
12. No unnecessary architectural complexity has been introduced.

---

# 62. FINAL RULE

When there are multiple technically valid ways to implement a feature:

> Choose the simplest implementation that satisfies the requirement, preserves security, and fits the existing architecture.

Do not optimize for the number of technologies used.

Optimize for:

    Reliability
    Maintainability
    Security
    Development Speed
    User Experience
    Demonstrable Problem Solving