# 01 — Product Requirements Document

> **LostLink** — Smart Campus Lost & Found Platform
> Version 1.0.0 | Status: Active Development

---

## 1. Product Vision

LostLink is a centralized campus Lost-and-Found platform that helps students report, discover, match, verify, and recover lost belongings. It replaces fragmented WhatsApp groups, Telegram channels, notice boards, and word-of-mouth with a single searchable system that actively connects lost and found reports through intelligent matching and secure ownership verification.

**What LostLink is:**
- A campus utility for lost-and-found management
- A smart matching engine that identifies potentially matching LOST/FOUND pairs
- A secure verification system for ownership claims
- A complete recovery workflow from report to resolution

**What LostLink is not:**
- A social network or messaging platform
- A campus ERP or administrative system
- A payment or marketplace system
- A computer vision / AI image recognition platform
- A mobile application (web-first for MVP)

---

## 2. Problem Statement

Students frequently lose belongings: laptops, phones, wallets, ID cards, keys, books, earphones, bags, chargers, watches.

Current campus lost-and-found processes are fragmented:
1. Students ask friends and search messaging groups
2. Check campus offices and security staff
3. Search physical notice boards
4. Repeatedly ask whether someone found the item

Finders don't know how to locate owners. Even when a match exists, there's no reliable ownership verification mechanism.

---

## 3. Target Users

| Segment | Need | Success Metric |
|---------|------|----------------|
| **Student (Lost Item)** | Report quickly, find matches, verify ownership, recover item | Time to recovery < 24h, match accuracy > 80% |
| **Student (Found Item)** | Report found item, add verification, approve legitimate claims | Claim approval rate > 90%, false claim rejection > 95% |
| **Administrator** | Monitor reports, remove inappropriate content, manage users | Moderation response time < 1h |

---

## 4. User Stories (Prioritized)

### P0 — Must Have (MVP)

| ID | Story | Acceptance Criteria |
|----|-------|---------------------|
| US-01 | Register account | Valid email, unique, password hashed, JWT returned |
| US-02 | Login | Valid credentials authenticate, JWT returned, protected routes accessible |
| US-03 | Report LOST item | Title, category, description, location, date, optional image stored |
| US-04 | Report FOUND item | All LOST fields + verification question/answer (answer never exposed) |
| US-05 | Browse items | Active items displayed with image, type, category, location, date |
| US-06 | Search items | Search by title, description, category, location via backend |
| US-07 | Filter items | Filter by type, category, location, date, status via backend |
| US-08 | View item details | Full item info, possible matches, claim action (if FOUND) |
| US-09 | Smart matching | LOST↔FOUND compared on category(30), location(25), description(25), date(20) |
| US-10 | View matches | Ranked by score desc, threshold ≥60%, reasons displayed |
| US-11 | Submit claim | Verification question shown, answer validated server-side |
| US-12 | Approve/reject claim | Finder approves → item RESOLVED, claim APPROVED; reject → item ACTIVE |
| US-13 | User dashboard | My lost, my found, matches, pending claims, recovered items |

### P1 — Should Have (v1.1)

| ID | Story | Acceptance Criteria |
|----|-------|---------------------|
| US-14 | Image upload | Cloudinary integration, URL stored in MongoDB |
| US-15 | Pagination | Large result sets paginated |
| US-16 | Admin dashboard | View all reports, remove inappropriate, monitor claims |
| US-17 | Improved match explanations | More detailed reasoning for scores |
| US-18 | Mobile responsive | Full functionality on mobile browsers |

### P2 — Could Have (v1.2)

| ID | Story | Acceptance Criteria |
|----|-------|---------------------|
| US-19 | Email notifications | On match, claim, approval |
| US-20 | Duplicate detection | Warn when similar report exists |
| US-21 | Rich text description | Formatting support |

### P3 — Won't Have (Out of Scope)

- Real-time chat/messaging between users
- Facial recognition or computer vision
- Semantic AI matching (text embeddings)
- Mobile native application
- Multi-campus / multi-tenancy
- QR code item identification
- Push notifications
- Blockchain verification

---

## 5. Non-Functional Requirements

| Category | Requirement | Target | Rationale |
|----------|-------------|--------|-----------|
| **Latency** | Page load (p50) | < 1.5s | Usable on campus WiFi |
| **Latency** | API response (p95) | < 300ms | Smooth search/filter UX |
| **Throughput** | Concurrent users | 500+ | Hackathon scale |
| **Availability** | Uptime | 99.5% | Demo reliability |
| **Security** | Password hashing | bcrypt cost ≥10 | Credential protection |
| **Security** | Verification answers | Never exposed to frontend | Prevent false claims |
| **Usability** | First-time success | < 3 min to report | Low friction |
| **Bundle** | JS bundle (gzipped) | < 300KB | Fast initial load |
| **Performance** | Lighthouse score | > 90 | Production quality |

---

## 6. Core User Journey

```
Report → Search → Match → Claim → Verify → Approve → Recover
```

**Primary Demo Flow:**
1. Student A reports LOST laptop (Black HP, Library, Aug 26, blue sticker)
2. Student B reports FOUND laptop (Black HP, Library, Aug 26, verification: "What sticker?")
3. Matching engine detects 94% match
4. Student A views match, claims item, answers "Blue star sticker"
5. Student B approves claim
6. Item marked RESOLVED — RECOVERED

---

## 7. Success Criteria

The MVP is successful when a user can complete the entire workflow:
- ✅ Register → Login
- ✅ Report LOST/FOUND items
- ✅ Browse, search, filter items
- ✅ Smart matching finds potential matches (≥60% score)
- ✅ Claim submission with verification
- ✅ Finder approval/rejection
- ✅ Item resolution and dashboard reflection

---

## 8. Constraints

| Constraint | Impact | Mitigation |
|------------|--------|------------|
| Hackathon timeline | 6 phases, ~2 weeks | Strict phase gates, no scope creep |
| No budget | Free tier services only | MongoDB Atlas free, Cloudinary free, Render/Vercel free |
| Solo/small team | Limited parallel work | Focus on core workflow, defer nice-to-haves |
| Demo-focused | Must work end-to-end | Manual testing priority over automated |