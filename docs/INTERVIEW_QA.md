# Interview Q&A — GoPratle Event Requirement Platform

Prepared answers to questions a GoPratle engineer is likely to ask during a code review or follow-up interview.

---

## Architecture & Design

**Q: Why a monorepo without npm workspaces?**  
A: Vercel and Render each deploy a self-contained directory (`frontend/` and `backend/` respectively). Shared packages would require hoisting or path aliases that complicate both deployment pipelines. At this scale the only duplication is the Zod schemas — a deliberate, documented trade-off. If the project grew, Turborepo with published packages would be the right next step.

**Q: Why Mongoose discriminators instead of separate collections?**  
A: All three categories share the same top-level fields (event name, date, location, category, status). Discriminators give us a single `requirements` collection that can be queried across categories (e.g. "all requirements from this week") without joins or $lookup, while still enforcing type-safe sub-schemas per category. One index on `{category, createdAt}` handles the most common query pattern.

**Q: Why `z.union` and not `z.discriminatedUnion`?**  
A: Zod's `discriminatedUnion` only accepts plain `ZodObject` members. Our detail schemas use `.superRefine()` to enforce cross-field rules (e.g. `budgetMax >= budgetMin`), which wraps them in `ZodEffects`. Unwrapping them would push that logic elsewhere and scatter validation. `z.union` works correctly with `ZodEffects` members and produces accurate error messages.

**Q: Why are Zod schemas duplicated across frontend and backend?**  
A: The frontend schema validates on the client side to give instant feedback; the backend schema is the authoritative guard against direct API calls. Having both means a mismatched frontend never silently corrupts the database. The field names are identical and the README documents this contract explicitly.

**Q: How does idempotency work?**  
A: The client generates a UUID v4 when the wizard initialises (stored in Zustand). This key is sent as the `Idempotency-Key` request header on the final POST. The backend has a unique sparse index on `idempotencyKey`. If a record with that key already exists, the service returns it with HTTP 200 instead of creating a new document. The key is rotated in the store after a successful submission, so "Create Another" starts a fresh session.

**Q: How do you prevent endDate timezone off-by-one bugs?**  
A: We never use JS `Date` objects for date-only values. All dates are stored and validated as `"YYYY-MM-DD"` strings. The server compares `startDate` against UTC yesterday (`new Date(Date.now() - 86400000).toISOString().slice(0,10)`) so users in IST (UTC+5:30) don't get false "date in the past" rejections when they pick today's date.

---

## Frontend

**Q: Why Zustand with `persist` for cross-step state?**  
A: React Hook Form is scoped to a single form instance. Persisting data across four separate step components would require either lifting all state to a single giant form (complicating field isolation) or a shared store. Zustand's `persist` middleware gives localStorage durability for free — the user can close the tab and return to find their draft intact.

**Q: Why `completedStepsArr: number[]` instead of `Set<number>`?**  
A: `JSON.stringify` cannot serialise a `Set`. Zustand's `persist` layer serialises to JSON, so any `Set` in state would silently be stored as an empty object and lost on reload. A `number[]` is fully serialisable; a helper (`getCompletedStepsSet`) converts it to a `Set` at read time.

**Q: The wizard uses `useEffect` to set `hasMounted`. Isn't that the React Compiler anti-pattern?**  
A: Yes, the React Compiler ESLint plugin flags `setState` inside `useEffect`. This particular use is the canonical SSR hydration guard — we render a skeleton on the server and replace it with localStorage-aware content after mount. We suppress the rule inline with a comment explaining the reason. An alternative would be `useSyncExternalStore` with `getServerSnapshot: () => false` — equally correct but less readable for a reviewer unfamiliar with the API.

**Q: How do field-level API errors get routed back to the right step?**  
A: The backend returns validation errors with dot-path field names (`details.guestCount`). `fieldToStep()` in `lib/utils.ts` maps those paths to step numbers. On a server-side validation failure, the wizard navigates back to the step containing the first errored field so the user can correct it without losing other entries.

**Q: Why `<input type="date">` instead of a date-picker library?**  
A: Native date inputs render the OS date picker on mobile — no extra JavaScript, no accessibility work, no additional dependency. The `min` attribute is set to today's date so users can't pick a past date without triggering validation. We store the value as a `"YYYY-MM-DD"` string directly from the input's `value` property.

---

## Backend

**Q: What does the Zod `strict()` mode on each detail schema do?**  
A: `.strict()` rejects any keys that are not declared in the schema. So if a client sends `performer` details (e.g. `performanceType`) together with a `"category": "planner"` body, the validator rejects the unknown keys. This prevents cross-category data from leaking into the database and is a second line of defence after the union discrimination.

**Q: How does the error response format work?**  
A: All responses — success and failure — share the same `{ success, message, data? / errors? }` envelope. Validation errors include an `errors` array with `{ field, message }` objects where `field` is a dot-path (`details.guestCount`) that the frontend can map directly to a React Hook Form field name using `setError`. HTTP error codes (413, 429, 503) also use this shape, not Express's default HTML error pages.

**Q: How is the rate limiter configured?**  
A: `express-rate-limit` is applied only to `POST /api/requirements` — the write path. The window and max-requests are configurable via `RATE_LIMIT_WINDOW_MS` and `RATE_LIMIT_MAX_REQUESTS` env vars. The 429 response uses our JSON envelope (not the default text/plain). Read endpoints and the health check are not rate-limited.

**Q: Why `app.ts` / `server.ts` split?**  
A: `app.ts` exports the Express app without starting a listener. `server.ts` connects to MongoDB and calls `app.listen()`. Tests import `app.ts` directly — no port collision, no real DB. This is the standard pattern for testing Express with Supertest.

**Q: Why `tsx` for the dev server instead of `ts-node`?**  
A: `tsx` uses esbuild under the hood, starts in ~200ms, and requires zero additional tsconfig configuration. `ts-node` is slower to start and requires `esModuleInterop` and `module` settings that sometimes conflict with `tsconfig.build.json`. For a project this size, `tsx` is the simpler choice.

---

## Testing

**Q: Why `mongodb-memory-server` and not a test database?**  
A: In-memory MongoDB starts and tears down within the test run — no external dependency, no data left between runs, no race conditions in CI. Each test file gets its own ephemeral database. The binary is downloaded once and cached.

**Q: What do the 34 backend tests cover?**  
A: Four test files:
1. `requirements.categories.test.ts` — creates and reads valid records for all three categories (12 tests)
2. `requirements.validation.test.ts` — invalid category, missing fields, date in the past, date ordering, budgetMax < budgetMin, strict cross-category rejection (11 tests)
3. `requirements.idempotency.test.ts` — replay returns 200, creates correctly on first use, distinct keys create distinct records, list/pagination, filtering by category (9 tests)
4. `health.test.ts` — connected state, structure of the response (2 tests)

**Q: Why only one frontend test?**  
A: The frontend form logic is already exercised by the backend's 34 tests against the API contract. The wizard smoke test validates the component tree renders without crashing — catching import errors and broken mocks. End-to-end browser tests (Playwright or Cypress) would be the next investment for a production project.

---

## Deployment

**Q: What changes are needed to deploy?**  
A:
1. Push the repo to GitHub.
2. Import `frontend/` into Vercel. Set `NEXT_PUBLIC_API_URL` to the Render backend URL.
3. Create a Render Web Service from `backend/`. Set `MONGODB_URI` (Atlas connection string) and `FRONTEND_URL` (Vercel URL).
4. Create a MongoDB Atlas M0 cluster; whitelist Render's IPs; copy the URI.
5. No other secrets. The `render.yaml` automates the Render config.

**Q: How would you add authentication in a real product?**  
A: Add a `userId` claim via JWT (e.g. Auth0 / Clerk). Attach it server-side when creating a requirement. Add a `GET /api/requirements/mine` endpoint that filters by `userId`. On the frontend, wrap the wizard in an auth guard. The existing schema extends cleanly — just add an indexed `userId` field to the base model.
