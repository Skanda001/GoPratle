# GoPratle — Event Requirement Posting Platform

A full-stack MVP that lets event organizers post service requirements in a guided four-step wizard. Three categories of vendor are supported: **Planner**, **Performer**, and **Crew**. Steps 2 and 3 adapt to whichever category is selected in Step 1.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Repository Structure](#repository-structure)
3. [Prerequisites](#prerequisites)
4. [Local Development](#local-development)
5. [Environment Variables](#environment-variables)
6. [API Contract](#api-contract)
7. [Testing](#testing)
8. [Deployment](#deployment)
9. [Assumptions](#assumptions)
10. [Extra Dependencies — Justifications](#extra-dependencies--justifications)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), React 19, TypeScript (strict), Tailwind CSS v4 |
| State | Zustand v5 with `persist` (localStorage, `completedStepsArr: number[]`) |
| Forms | React Hook Form + `@hookform/resolvers/zod` + Zod v3 |
| Backend | Node.js, Express, TypeScript (strict), Mongoose |
| Database | MongoDB 8 (Atlas in production; Docker for local dev) |
| Testing | Vitest + Supertest + `mongodb-memory-server` (backend); Vitest + React Testing Library (frontend) |
| Tooling | ESLint (flat config), Prettier, `concurrently`, `tsx` |
| Deployment | Vercel (frontend), Render (backend), MongoDB Atlas (database) |

---

## Repository Structure

```
GoPratle/
├── frontend/                   # Next.js app (App Router)
│   └── src/
│       ├── app/                # layout.tsx, page.tsx, not-found.tsx, globals.css
│       ├── components/
│       │   ├── layout/         # Header, ProgressIndicator
│       │   ├── requirement-form/  # Wizard steps, ReviewScreen, SuccessScreen
│       │   └── ui/             # Reusable form field components
│       ├── lib/                # api.ts, constants.ts, validation.ts, utils.ts
│       ├── store/              # requirementStore.ts (Zustand)
│       ├── types/              # index.ts
│       └── test/               # wizard.test.tsx
│
├── backend/                    # Express API
│   └── src/
│       ├── config/             # env.ts (Zod validation), db.ts
│       ├── models/             # Requirement.ts (base discriminator), Planner/Performer/Crew
│       ├── validators/         # requirementValidator.ts (Zod discriminated union)
│       ├── services/           # requirementService.ts
│       ├── controllers/        # requirementController.ts
│       ├── routes/             # requirementRoutes.ts
│       ├── middleware/         # errorHandler.ts, notFound.ts, rateLimiter.ts
│       └── utils/              # response.ts
│   ├── tests/                  # 34 Vitest + Supertest tests
│   └── scripts/                # seed.ts
│
├── docs/
│   ├── VIDEO_SCRIPT.md
│   └── INTERVIEW_QA.md
│
├── docker-compose.yml          # MongoDB 8 for local dev
├── render.yaml                 # Render deployment config
├── requests.http               # REST Client sample requests
└── package.json                # Root scripts (concurrently)
```

---

## Prerequisites

- **Node.js** ≥ 20
- **npm** ≥ 10
- **Docker Desktop** (for local MongoDB)

---

## Local Development

### 1. Install dependencies

```bash
# From the root
npm install
npm install --prefix frontend
npm install --prefix backend
```

### 2. Start MongoDB

```bash
docker compose up -d
```

### 3. Configure environment

```bash
# backend/.env (already exists with local defaults)
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/gopratle_requirements
FRONTEND_URL=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=30
```

```bash
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 4. Run both apps

```bash
npm run dev        # runs backend + frontend concurrently
```

Or separately:

```bash
npm run dev --prefix backend    # http://localhost:5000
npm run dev --prefix frontend   # http://localhost:3000
```

### 5. (Optional) Seed the database

```bash
npm run seed --prefix backend
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | No | `5000` | HTTP port |
| `NODE_ENV` | No | `development` | `development` or `production` |
| `MONGODB_URI` | **Yes** | — | MongoDB connection string |
| `FRONTEND_URL` | **Yes** | — | Comma-separated allowed CORS origins |
| `RATE_LIMIT_WINDOW_MS` | No | `900000` | Rate-limit window in ms (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | No | `30` | Max POST requests per window |

### Frontend (`frontend/.env.local`)

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | **Yes** | Full URL of the backend API (no trailing slash) |

---

## API Contract

All responses follow a consistent envelope:

```jsonc
// Success
{ "success": true, "message": "...", "data": { ... } }

// Failure
{ "success": false, "message": "...", "errors": [{ "field": "details.guestCount", "message": "..." }] }
```

### Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/health` | Service health + DB status |
| `POST` | `/api/requirements` | Create a new requirement |
| `GET` | `/api/requirements` | List requirements (paginated) |
| `GET` | `/api/requirements/:id` | Get a single requirement by ID |

#### `POST /api/requirements`

**Headers:** `Idempotency-Key: <uuid>` (optional — replay-safe)

**Body (planner example):**
```json
{
  "eventName": "Annual Gala",
  "eventType": "corporate_event",
  "dateMode": "single",
  "startDate": "2026-12-20",
  "location": "Mumbai",
  "venue": "Taj Mahal Palace",
  "category": "planner",
  "details": {
    "guestCount": 250,
    "budget": 500000,
    "currency": "INR",
    "servicesRequired": ["catering_coordination", "decoration_theme"],
    "planningScope": "full_planning",
    "coordinationDays": 1
  }
}
```

**Status codes:** `201` created · `200` idempotent replay · `400` validation error · `404` not found · `413` body too large · `429` rate limited · `503` DB unavailable · `500` unexpected error

#### `GET /api/requirements?category=planner&page=1&limit=10`

Returns `data` (array) + `meta`:
```json
{ "page": 1, "limit": 10, "total": 42, "totalPages": 5 }
```

#### Schema — Shared fields

```
eventName    string   3–100 chars    required
eventType    enum     wedding | corporate_event | college_fest | birthday | concert | private_party | other
dateMode     enum     single | range
startDate    string   YYYY-MM-DD     required; must not be in the past
endDate      string   YYYY-MM-DD     required when dateMode=range; ≥ startDate; max 90-day span
location     string   2–100 chars    required
venue        string   ≤100 chars     optional
category     enum     planner | performer | crew
```

The `details` sub-object differs by `category` — see `backend/src/validators/requirementValidator.ts` for the authoritative Zod schema.

> **Note:** Zod schemas are mirrored in `frontend/src/lib/validation.ts` and `backend/src/validators/requirementValidator.ts`. Field names are identical. The frontend validates on submit; the backend re-validates and rejects any mismatches (defense in depth).

---

## Testing

```bash
# Backend — 34 tests (categories, validation, idempotency, health, pagination)
npm test --prefix backend

# Frontend — smoke test (wizard renders without crashing)
npm test --prefix frontend

# Both
npm test
```

Tests use `mongodb-memory-server` (backend) and jsdom (frontend). No running MongoDB needed.

---

## Deployment

### Backend → Render

1. Create a new **Web Service** pointing at the `backend/` directory.
2. Build command: `npm install && npm run build`
3. Start command: `node dist/server.js`
4. Set environment variables (see above). Use your MongoDB Atlas connection string for `MONGODB_URI`.
5. The `render.yaml` in the root automates this config.

### Frontend → Vercel

1. Import the repo. Set **Root Directory** to `frontend`.
2. Framework preset: **Next.js**.
3. Add `NEXT_PUBLIC_API_URL` pointing to your Render backend URL.

### Database → MongoDB Atlas

1. Create a free M0 cluster.
2. Add a database user and whitelist `0.0.0.0/0` (or Render's static IP).
3. Copy the connection string into the backend `MONGODB_URI` env var on Render.

---

## Assumptions

1. **No authentication.** The spec scopes this to a single form flow; auth would be a separate phase.
2. **Single wizard session at a time.** Zustand `persist` stores one draft in localStorage. Navigating away and returning restores the draft; submitting clears it.
3. **`coordinationDays` default.** When the user does not edit this field, it defaults to the number of days in the selected date range (1 for single-mode events).
4. **Date comparison uses UTC-minus-1-day.** `startDate` may be today in IST (UTC+5:30). The server accepts any date ≥ UTC yesterday so IST users never get false "date in the past" rejections.
5. **`endDate` is stripped for single-mode on the client** and rejected by the server if present. Both sides enforce this so the stored document is always consistent.
6. **`idempotencyKey` is a client-generated UUID v4**, created once per wizard session (Zustand) and rotated after a successful submission. This prevents double-POSTs from slow networks or double-clicks.
7. **`z.union` instead of `z.discriminatedUnion`.** Zod's `discriminatedUnion` requires plain `ZodObject` members; our schemas use `.superRefine()` (returning `ZodEffects`). `z.union` is the correct fallback.
8. **Tailwind v4 — no `tailwind.config.ts`.** Next.js 16 installs Tailwind v4 which uses `@import "tailwindcss"` + `@theme inline` in CSS; there is no JS config file.
9. **Zod v3 in frontend.** Zod v4 was auto-installed but is incompatible with `@hookform/resolvers`; downgraded to v3.
10. **`completedSteps` stored as `number[]`** in Zustand (not `Set<number>`) because `JSON.stringify` cannot serialize a Set.
11. **No `/requirements` list page.** The spec calls for the wizard only; a browse/admin view is out of scope for this assignment.
