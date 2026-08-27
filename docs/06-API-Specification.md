# 06 — API Specification

> REST API for LostLink — Smart Campus Lost & Found

---

## 1. Overview

| Property | Value |
|----------|-------|
| Base URL | `/api` |
| Protocol | HTTPS (production) / HTTP (dev) |
| Format | JSON |
| Auth | Bearer JWT (Authorization header) |
| Content-Type | `application/json` |

### Response Format

**Success:**
```json
{
  "success": true,
  "data": { ... },
  "pagination": { "page": 1, "limit": 20, "total": 100, "pages": 5 }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Human-readable error message",
  "errors": [] // Optional: validation errors
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request (validation) |
| 401 | Unauthorized (invalid/missing token) |
| 403 | Forbidden (owned by another user) |
| 404 | Not Found |
| 429 | Too Many Requests (rate limit) |
| 500 | Internal Server Error |

---

## 2. Authentication Endpoints

### POST `/api/auth/register`

**Register new user**

**Request:**
```json
{
  "name": "Alex Chen",
  "email": "alex@university.edu",
  "password": "securePassword123"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": { "id": "65a1b2c3d4e5f6789012345", "name": "Alex Chen", "email": "alex@university.edu" },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Validation:**
- name: required, 1-50 chars
- email: required, valid format, unique
- password: required, min 8 chars

---

### POST `/api/auth/login`

**Authenticate user**

**Request:**
```json
{
  "email": "alex@university.edu",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": { "id": "65a1b2c3d4e5f6789012345", "name": "Alex Chen", "email": "alex@university.edu" },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### GET `/api/auth/me`

**Get current user profile**

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": { "id": "65a1b2c3d4e5f6789012345", "name": "Alex Chen", "email": "alex@university.edu", "role": "student", "createdAt": "2024-01-15T10:30:00.000Z" }
  }
}
```

---

## 3. Item Endpoints

### POST `/api/items`

**Create lost/found item report**

**Headers:** `Authorization: Bearer <token>`

**Request (LOST):**
```json
{
  "title": "Black HP Laptop",
  "description": "Black HP laptop with blue star sticker near HP logo. Charger included.",
  "category": "Electronics",
  "type": "LOST",
  "location": "Central Library - 2nd Floor Study Area",
  "date": "2024-01-20",
  "image": "https://res.cloudinary.com/xxx/image/upload/v123/lostlink/laptop.jpg"
}
```

**Request (FOUND):**
```json
{
  "title": "Black HP Laptop",
  "description": "Black HP laptop found near study area. Blue star sticker visible.",
  "category": "Electronics",
  "type": "FOUND",
  "location": "Central Library - 2nd Floor Study Area",
  "date": "2024-01-21",
  "verificationQuestion": "What color is the sticker on the laptop?",
  "verificationAnswer": "blue star"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "item": {
      "_id": "65a1b2c3d4e5f6789012346",
      "title": "Black HP Laptop",
      "description": "Black HP laptop with blue star sticker near HP logo. Charger included.",
      "category": "Electronics",
      "type": "LOST",
      "location": "Central Library - 2nd Floor Study Area",
      "date": "2024-01-20T00:00:00.000Z",
      "image": "https://res.cloudinary.com/xxx/image/upload/v123/lostlink/laptop.jpg",
      "status": "ACTIVE",
      "userId": "65a1b2c3d4e5f6789012345",
      "createdAt": "2024-01-21T09:15:00.000Z",
      "updatedAt": "2024-01-21T09:15:00.000Z"
    }
  }
}
```

**Validation:**
- title: required, 1-100 chars
- description: required, 1-2000 chars
- category: required, enum
- type: required, enum [LOST, FOUND]
- location: required, 1-100 chars
- date: required, valid ISO date
- verificationQuestion: required if FOUND, 1-200 chars
- verificationAnswer: required if FOUND, 1-100 chars
- image: optional, valid URL

---

### GET `/api/items`

**List items with search & filters**

**Query Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| search | string | Text search (title, description, category, location) |
| type | string | LOST or FOUND |
| category | string | Category filter |
| location | string | Partial match, case-insensitive |
| status | string | ACTIVE, CLAIM_PENDING, RESOLVED |
| date | string | Exact date (YYYY-MM-DD) |
| page | integer | Page number (default: 1) |
| limit | integer | Items per page (default: 20, max: 100) |

**Examples:**
```
GET /api/items?search=laptop
GET /api/items?type=FOUND&category=Electronics
GET /api/items?search=phone&type=LOST&location=library&page=2
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "_id": "65a1b2c3d4e5f6789012346",
        "title": "Black HP Laptop",
        "description": "Black HP laptop with blue star sticker...",
        "category": "Electronics",
        "type": "LOST",
        "location": "Central Library - 2nd Floor Study Area",
        "date": "2024-01-20T00:00:00.000Z",
        "image": "https://res.cloudinary.com/xxx/image/upload/v123/lostlink/laptop.jpg",
        "status": "ACTIVE",
        "userId": { "_id": "65a1b2c3d4e5f6789012345", "name": "Alex Chen" },
        "createdAt": "2024-01-21T09:15:00.000Z"
      }
    ],
    "pagination": { "page": 1, "limit": 20, "total": 45, "pages": 3 }
  }
}
```

**Notes:**
- Results sorted by `createdAt` descending
- Text search uses MongoDB `$text` index
- RESOLVED items excluded by default (unless `status=RESOLVED`)

---

### GET `/api/items/:id`

**Get single item details**

**Response (200):**
```json
{
  "success": true,
  "data": {
    "item": {
      "_id": "65a1b2c3d4e5f6789012346",
      "title": "Black HP Laptop",
      "description": "Black HP laptop with blue star sticker near HP logo...",
      "category": "Electronics",
      "type": "FOUND",
      "location": "Central Library - 2nd Floor Study Area",
      "date": "2024-01-21T00:00:00.000Z",
      "image": "https://res.cloudinary.com/xxx/image/upload/v123/lostlink/laptop.jpg",
      "status": "ACTIVE",
      "verificationQuestion": "What color is the sticker on the laptop?",
      "userId": { "_id": "65a1b2c3d4e5f6789012345", "name": "Jordan Kim", "email": "jordan@university.edu" },
      "createdAt": "2024-01-22T10:00:00.000Z",
      "updatedAt": "2024-01-22T10:00:00.000Z"
    }
  }
}
```

**Critical:** `verificationAnswer` is **never** included in response (schema `select: false` + explicit exclusion).

---

### PUT `/api/items/:id`

**Update own item**

**Headers:** `Authorization: Bearer <token>`

**Request:** (partial update allowed)
```json
{
  "title": "Black HP Laptop - UPDATED",
  "description": "Updated description",
  "location": "Central Library - Main Entrance"
}
```

**Response (200):** Updated item object

**Authorization:** Only item owner (`item.userId === req.userId`)

---

### DELETE `/api/items/:id`

**Delete own item**

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{ "success": true, "message": "Item deleted" }
```

**Authorization:** Only item owner

---

### GET `/api/items/:id/matches`

**Get potential matches for an item**

**Response (200):**
```json
{
  "success": true,
  "data": {
    "matches": [
      {
        "itemId": "65a1b2c3d4e5f6789012347",
        "title": "Black HP Laptop",
        "category": "Electronics",
        "type": "FOUND",
        "location": "Central Library - 2nd Floor",
        "date": "2024-01-21T00:00:00.000Z",
        "score": 94,
        "reasons": [
          "Same category",
          "Similar location",
          "Similar description",
          "Same date"
        ]
      },
      {
        "itemId": "65a1b2c3d4e5f6789012348",
        "title": "Black Laptop",
        "category": "Electronics",
        "type": "FOUND",
        "location": "Library",
        "date": "2024-01-20T00:00:00.000Z",
        "score": 78,
        "reasons": [
          "Same category",
          "Similar location",
          "Similar description"
        ]
      }
    ]
  }
}
```

**Logic:**
- Only compares opposite types (LOST ↔ FOUND)
- Only active items (status !== RESOLVED)
- Score ≥ 60% threshold
- Sorted by score descending
- Max 10 results

---

## 4. Claim Endpoints

### POST `/api/claims`

**Submit claim for FOUND item**

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "itemId": "65a1b2c3d4e5f6789012347",
  "answer": "blue star"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "claim": {
      "_id": "65a1b2c3d4e5f6789012349",
      "itemId": "65a1b2c3d4e5f6789012347",
      "claimantId": "65a1b2c3d4e5f6789012345",
      "answer": "blue star",
      "status": "PENDING",
      "createdAt": "2024-01-22T14:30:00.000Z",
      "updatedAt": "2024-01-22T14:30:00.000Z"
    }
  }
}
```

**Validation:**
- itemId: valid ObjectId, exists
- answer: required, 1-100 chars

**Business Rules:**
- Item must be FOUND type
- Item status must be ACTIVE (not RESOLVED, not CLAIM_PENDING)
- Cannot claim own item
- Answer verified server-side (case-insensitive, trimmed)
- Duplicate pending claim rejected

---

### GET `/api/claims`

**Get my submitted claims**

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "claims": [
      {
        "_id": "65a1b2c3d4e5f6789012349",
        "itemId": { "_id": "...", "title": "Black HP Laptop", "type": "FOUND", "location": "Library" },
        "claimantId": "65a1b2c3d4e5f6789012345",
        "answer": "blue star",
        "status": "PENDING",
        "createdAt": "2024-01-22T14:30:00.000Z"
      }
    ]
  }
}
```

---

### GET `/api/claims/my-items`

**Get claims for items I reported (as finder)**

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "claims": [
      {
        "_id": "65a1b2c3d4e5f6789012349",
        "itemId": { "_id": "...", "title": "Black HP Laptop", "type": "FOUND" },
        "claimantId": { "_id": "...", "name": "Alex Chen", "email": "alex@university.edu" },
        "answer": "blue star",
        "status": "PENDING",
        "createdAt": "2024-01-22T14:30:00.000Z"
      }
    ]
  }
}
```

---

### PUT `/api/claims/:id/approve`

**Approve a claim (finder only)**

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "claim": {
      "_id": "65a1b2c3d4e5f6789012349",
      "status": "APPROVED",
      "itemId": { "status": "RESOLVED" }
    }
  }
}
```

**Authorization:** Only the item owner (finder) can approve
**Effect:** Claim → APPROVED, Item → RESOLVED

---

### PUT `/api/claims/:id/reject`

**Reject a claim (finder only)**

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "claim": {
      "_id": "65a1b2c3d4e5f6789012349",
      "status": "REJECTED"
    }
  }
}
```

**Authorization:** Only the item owner (finder) can reject
**Effect:** Claim → REJECTED, Item → ACTIVE (if no other pending claims)

---

## 5. Error Responses

### 400 - Validation Error
```json
{
  "success": false,
  "message": "Title is required, Email must be valid",
  "errors": [
    { "field": "title", "message": "Title is required" },
    { "field": "email", "message": "Email must be valid" }
  ]
}
```

### 401 - Unauthorized
```json
{ "success": false, "message": "Invalid or expired token" }
```

### 403 - Forbidden
```json
{ "success": false, "message": "You are not authorized to perform this action" }
```

### 404 - Not Found
```json
{ "success": false, "message": "Item not found" }
```

### 409 - Conflict
```json
{ "success": false, "message": "Email already registered" }
```

### 422 - Business Rule Violation
```json
{ "success": false, "message": "Incorrect verification answer" }
{ "success": false, "message": "Item already resolved" }
{ "success": false, "message": "Cannot claim your own item" }
```

### 500 - Server Error
```json
{ "success": false, "message": "Internal server error" }
```

---

## 6. Rate Limiting

| Endpoint | Limit |
|----------|-------|
| POST /api/auth/register | 5/min/IP |
| POST /api/auth/login | 10/min/IP |
| POST /api/items | 30/min/user |
| POST /api/claims | 10/min/user |
| GET /api/items | 100/min/user |
| GET /api/items/:id/matches | 20/min/user |

---

## 7. Frontend Service Layer (Reference)

```javascript
// services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res.data, // unwrap { success, data }
  err => Promise.reject(err.response?.data || { message: 'Network error' })
);

export default api;
```