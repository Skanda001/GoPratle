import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import { setupTestDB, teardownTestDB, clearTestDB, futureDate } from "./helpers.js";

beforeAll(async () => { await setupTestDB(); });
afterAll(async () => { await teardownTestDB(); });
beforeEach(async () => { await clearTestDB(); });

// ---------------------------------------------------------------------------
// Planner submissions
// ---------------------------------------------------------------------------
describe("POST /api/requirements – Planner", () => {
  const validPlanner = {
    category: "planner",
    eventName: "Annual Gala",
    eventType: "corporate_event",
    dateMode: "range",
    startDate: futureDate(30),
    endDate: futureDate(32),
    location: "Mumbai, Maharashtra",
    details: {
      guestCount: 200,
      currency: "INR",
      servicesRequired: ["decoration_theme", "catering_coordination"],
      planningScope: "full_planning",
      coordinationDays: 3,
    },
  };

  it("creates a valid planner requirement (201)", async () => {
    const res = await request(app).post("/api/requirements").send(validPlanner);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data._id).toBeTruthy();
    expect(res.body.data.category).toBe("planner");
    expect(res.body.data.details.guestCount).toBe(200);
  });

  it("persists the correct category and details in DB", async () => {
    const res = await request(app).post("/api/requirements").send(validPlanner);
    const id = res.body.data._id;
    const getRes = await request(app).get(`/api/requirements/${id}`);
    expect(getRes.body.data.category).toBe("planner");
    expect(getRes.body.data.details.servicesRequired).toContain("decoration_theme");
  });

  it("rejects planner with empty servicesRequired array (400)", async () => {
    const res = await request(app)
      .post("/api/requirements")
      .send({ ...validPlanner, details: { ...validPlanner.details, servicesRequired: [] } });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("rejects guestCount = 0 (400)", async () => {
    const res = await request(app)
      .post("/api/requirements")
      .send({ ...validPlanner, details: { ...validPlanner.details, guestCount: 0 } });
    expect(res.status).toBe(400);
  });

  it("rejects planner payload containing performer-specific keys (400)", async () => {
    const res = await request(app)
      .post("/api/requirements")
      .send({
        ...validPlanner,
        performanceType: "dj", // unknown key at root — strict mode
      });
    expect(res.status).toBe(400);
  });
});

// ---------------------------------------------------------------------------
// Performer submissions
// ---------------------------------------------------------------------------
describe("POST /api/requirements – Performer", () => {
  const validPerformer = {
    category: "performer",
    eventName: "New Year Party",
    eventType: "private_party",
    dateMode: "single",
    startDate: futureDate(60),
    location: "Delhi NCR",
    details: {
      performanceType: "dj",
      performerCount: 2,
      durationMinutes: 180,
      performanceCount: 1,
      soundSystemRequired: true,
      lightingRequired: false,
      stageRequired: false,
      budgetCurrency: "INR",
    },
  };

  it("creates a valid performer requirement (201)", async () => {
    const res = await request(app).post("/api/requirements").send(validPerformer);
    expect(res.status).toBe(201);
    expect(res.body.data.category).toBe("performer");
    expect(res.body.data.details.performanceType).toBe("dj");
  });

  it("rejects budgetMax < budgetMin (400)", async () => {
    const res = await request(app).post("/api/requirements").send({
      ...validPerformer,
      details: { ...validPerformer.details, budgetMin: 50000, budgetMax: 10000 },
    });
    expect(res.status).toBe(400);
    const fields = res.body.errors?.map((e: { field: string }) => e.field) ?? [];
    expect(fields).toContain("details.budgetMax");
  });

  it("rejects single-mode event with endDate present (400)", async () => {
    const res = await request(app)
      .post("/api/requirements")
      .send({ ...validPerformer, endDate: futureDate(65) });
    expect(res.status).toBe(400);
  });

  it("does not accept planner-only fields (details.planningScope) for performer (400)", async () => {
    const res = await request(app).post("/api/requirements").send({
      ...validPerformer,
      details: { ...validPerformer.details, planningScope: "full_planning" },
    });
    expect(res.status).toBe(400);
  });
});

// ---------------------------------------------------------------------------
// Crew submissions
// ---------------------------------------------------------------------------
describe("POST /api/requirements – Crew", () => {
  const validCrew = {
    category: "crew",
    eventName: "Rock Festival",
    eventType: "concert",
    dateMode: "range",
    startDate: futureDate(90),
    endDate: futureDate(92),
    location: "Bengaluru",
    details: {
      roles: ["sound_technician", "stagehand"],
      crewCount: 15,
      shiftHours: 8,
      shiftCount: 3,
      experienceLevel: "intermediate",
    },
  };

  it("creates a valid crew requirement (201)", async () => {
    const res = await request(app).post("/api/requirements").send(validCrew);
    expect(res.status).toBe(201);
    expect(res.body.data.category).toBe("crew");
    expect(res.body.data.details.roles).toContain("sound_technician");
  });

  it("rejects empty roles array (400)", async () => {
    const res = await request(app)
      .post("/api/requirements")
      .send({ ...validCrew, details: { ...validCrew.details, roles: [] } });
    expect(res.status).toBe(400);
  });

  it("rejects crewCount > 500 (400)", async () => {
    const res = await request(app)
      .post("/api/requirements")
      .send({ ...validCrew, details: { ...validCrew.details, crewCount: 501 } });
    expect(res.status).toBe(400);
  });
});
