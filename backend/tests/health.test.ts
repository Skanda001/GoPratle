import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import { setupTestDB, teardownTestDB } from "./helpers.js";

beforeAll(async () => { await setupTestDB(); });
afterAll(async () => { await teardownTestDB(); });

describe("GET /api/health", () => {
  it("returns 200 with database=connected when DB is up", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.database).toBe("connected");
    expect(typeof res.body.uptime).toBe("number");
  });

  it("response has no credentials or sensitive data", async () => {
    const res = await request(app).get("/api/health");
    const bodyStr = JSON.stringify(res.body);
    expect(bodyStr).not.toContain("password");
    expect(bodyStr).not.toContain("mongodb://");
    expect(bodyStr).not.toContain("secret");
  });
});
