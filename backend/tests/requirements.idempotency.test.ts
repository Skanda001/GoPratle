import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import { setupTestDB, teardownTestDB, clearTestDB, futureDate } from "./helpers.js";

beforeAll(async () => { await setupTestDB(); });
afterAll(async () => { await teardownTestDB(); });
beforeEach(async () => { await clearTestDB(); });

const VALID_PAYLOAD = {
  category: "planner",
  eventName: "Idempotency Test Event",
  eventType: "wedding",
  dateMode: "single",
  startDate: futureDate(20),
  location: "Chennai",
  details: {
    guestCount: 100,
    currency: "INR",
    servicesRequired: ["venue_selection"],
    planningScope: "day_of_coordination",
    coordinationDays: 1,
  },
};

describe("Idempotency", () => {
  it("returns the same record on replay (200, not 201)", async () => {
    const key = `idem-test-${Date.now()}`;

    const first = await request(app)
      .post("/api/requirements")
      .set("Idempotency-Key", key)
      .send(VALID_PAYLOAD);

    expect(first.status).toBe(201);
    const firstId = first.body.data._id;

    const second = await request(app)
      .post("/api/requirements")
      .set("Idempotency-Key", key)
      .send(VALID_PAYLOAD);

    expect(second.status).toBe(200);
    expect(second.body.data._id).toBe(firstId);
  });

  it("creates a new record without an idempotency key", async () => {
    const first = await request(app).post("/api/requirements").send(VALID_PAYLOAD);
    const second = await request(app).post("/api/requirements").send(VALID_PAYLOAD);
    expect(first.status).toBe(201);
    expect(second.status).toBe(201);
    expect(first.body.data._id).not.toBe(second.body.data._id);
  });
});

describe("GET /api/requirements/:id", () => {
  it("returns 200 with the saved record", async () => {
    const created = await request(app).post("/api/requirements").send(VALID_PAYLOAD);
    const id = created.body.data._id;
    const res = await request(app).get(`/api/requirements/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.data._id).toBe(id);
  });

  it("returns 404 for a missing id", async () => {
    const res = await request(app).get("/api/requirements/000000000000000000000000");
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it("returns 404 for a malformed id", async () => {
    const res = await request(app).get("/api/requirements/not-a-valid-id");
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

describe("GET /api/requirements (list)", () => {
  it("returns paginated results", async () => {
    // Create 3 planner requirements
    for (let i = 0; i < 3; i++) {
      await request(app)
        .post("/api/requirements")
        .send({ ...VALID_PAYLOAD, eventName: `Event ${i}` });
    }

    const res = await request(app).get("/api/requirements?page=1&limit=2");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.meta.total).toBe(3);
    expect(res.body.meta.totalPages).toBe(2);
  });

  it("filters by category", async () => {
    await request(app).post("/api/requirements").send(VALID_PAYLOAD); // planner

    const performer = {
      category: "performer",
      eventName: "Performer Event",
      eventType: "concert",
      dateMode: "single",
      startDate: futureDate(20),
      location: "Delhi",
      details: {
        performanceType: "singer",
        performerCount: 1,
        durationMinutes: 60,
        performanceCount: 1,
        soundSystemRequired: false,
        lightingRequired: false,
        stageRequired: false,
        budgetCurrency: "INR",
      },
    };
    await request(app).post("/api/requirements").send(performer);

    const res = await request(app).get("/api/requirements?category=planner");
    expect(res.status).toBe(200);
    expect(res.body.data.every((d: { category: string }) => d.category === "planner")).toBe(true);
  });

  it("rejects invalid category filter (400)", async () => {
    const res = await request(app).get("/api/requirements?category=invalid");
    expect(res.status).toBe(400);
  });

  it("enforces limit max of 50", async () => {
    const res = await request(app).get("/api/requirements?limit=100");
    expect(res.status).toBe(400);
  });
});
