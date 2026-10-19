# Video Script — GoPratle Event Requirement Posting Platform

**Target duration:** 5–7 minutes  
**Format:** Screen-share walkthrough. Keep live typing to a minimum — the code is already written; narrate while scrolling.

---

## Opening (0:00 – 0:30)

> "Hi, I'm [your name]. I'll walk you through the GoPratle event requirement posting platform I built as part of the take-home assignment. The task was to build a full-stack MVP — a four-step wizard on the frontend and a REST API on the backend, both in TypeScript, backed by MongoDB.

> I'll cover the key architecture decisions, show the working app, run the tests, and explain any trade-offs I made. Total scope: about 3,500 lines of production code, 34 backend tests, and a clean ESLint/TypeScript build on both sides."

---

## Section 1 — Repo Overview (0:30 – 1:00)

> "The repo is a monorepo without npm workspaces — two independent apps in `frontend/` and `backend/`, a shared `docker-compose.yml` for local MongoDB, and a root `package.json` with concurrently scripts to run and test both at once."

*Scroll through the root directory. Open `package.json` and point to the `dev`, `test`, and `lint` scripts.*

> "There's no shared package between frontend and backend — the Zod schemas are mirrored manually. This was a deliberate choice: Vercel and Render each need a standalone app directory, and shared packages add complexity without much benefit at this scale. The API contract is documented in the README."

---

## Section 2 — Backend Architecture (1:00 – 2:00)

> "The backend follows a standard layered architecture: routes → controllers → services → models. Let me show the key files."

**Open `backend/src/models/Requirement.ts`:**
> "I used a single Mongoose collection with discriminators — one `requirements` collection, with `category` as the discriminator key. Each category — planner, performer, crew — has its own sub-document schema with type-safe enums. This keeps queries simple and the schema flexible."

**Open `backend/src/validators/requirementValidator.ts`:**
> "Validation is done with Zod before anything touches Mongoose. I used `z.union` — not `z.discriminatedUnion` — because each branch uses `.superRefine()` for cross-field rules like 'budgetMax must be ≥ budgetMin', and Zod's discriminated union only accepts plain ZodObject members. All three `details` schemas use `.strict()` to reject cross-category fields."

**Open `backend/src/services/requirementService.ts`:**
> "The service layer handles idempotency: if the request carries an `Idempotency-Key` header and a record with that key already exists, we return it with a 200 instead of creating a duplicate. This protects against double-POSTs from slow networks or a user clicking submit twice."

---

## Section 3 — API Demo (2:00 – 2:45)

*Open `requests.http` and run a few requests with the REST Client extension, or use a browser/Postman. Make sure the backend is running.*

> "The health endpoint confirms the database is connected."

*Run `GET /api/health` — show the 200 response.*

> "Creating a planner requirement — all three categories have different Step 2 and 3 fields."

*Run `POST /api/requirements` for planner — show the 201 response with the saved document.*

> "If I send the same request again with the same `Idempotency-Key`, I get a 200 with the same document — no duplicate."

*Re-run the same POST — show 200.*

> "And validation errors come back with field paths so the frontend can map them directly to the relevant form input."

*Run the 'missing eventName' error case — show the 400 with `errors` array.*

---

## Section 4 — Frontend Walkthrough (2:45 – 4:00)

*Open the browser at `http://localhost:3000`. Walk through the full wizard for each category.*

> "Step 1 is common to all categories. The date range toggle shows and hides the end-date field. The category cards — Planner, Performer, Crew — control what Steps 2 and 3 look like."

*Select Planner, fill in the basics, click Continue.*

> "Step 2 for a Planner collects guest count, budget with currency selector, and the services required — using a chip multiselect. All validation is run by React Hook Form + Zod on submit — errors appear inline under the relevant field."

*Fill step 2, continue to step 3.*

> "Step 3 for a Planner asks about planning scope and coordination days. The coordination days field defaults to the number of days in the chosen date range."

*Continue to step 4.*

> "Step 4 is a read-only review. The user can click 'Edit' on any section to jump back. On submit, the wizard builds the payload, fires the POST, and shows a success screen with the record ID."

*Submit and show the success screen.*

> "The draft is persisted in localStorage using Zustand's persist middleware, so refreshing the page mid-wizard restores your progress."

---

## Section 5 — Tests (4:00 – 4:45)

*Open a terminal and run `npm test --prefix backend`.*

> "The backend has 34 tests across four files. They use Vitest + Supertest + mongodb-memory-server — no real database needed. The test suite covers: creating all three categories, validation errors for every rule, idempotency, date rules, pagination, and the health endpoint."

*Show the passing output: `34 passed (34)`.*

*Run `npm test --prefix frontend`.*

> "The frontend has a smoke test that mounts the wizard component and confirms it renders without errors. More comprehensive integration testing would be a next step."

---

## Section 6 — Deployment (4:45 – 5:15)

> "The `render.yaml` at the root configures the backend as a Render Web Service. Build: `npm install && npm run build`. Start: `node dist/server.js`. The health check path is `/api/health`."

> "The frontend deploys to Vercel with the root directory set to `frontend/`. The only environment variable needed is `NEXT_PUBLIC_API_URL` pointing to the Render URL."

> "The database is MongoDB Atlas M0 — free tier — with the connection string in `MONGODB_URI`. The only secrets that exist are those two values; everything else has sensible defaults."

---

## Closing (5:15 – 5:30)

> "To summarise: clean layered Express API with Mongoose discriminators, Zod validation on both sides, idempotency, a four-step React wizard with Zustand persistence, 34 passing tests, and zero ESLint errors. The README covers every decision and assumption in detail."

> "Thanks for watching. Happy to answer any questions."

---

## Notes for Recording

- Keep scroll speed slow — reviewers need time to read code.
- Zoom the browser to 125% before the live demo so form fields are clearly visible.
- Make sure `docker compose up -d` is running before you start.
- If MongoDB hasn't warmed up, run the health endpoint first and wait for `"database": "connected"`.
- Have `requests.http` open in VS Code with the REST Client extension installed.
