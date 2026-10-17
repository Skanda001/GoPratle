/**
 * Vitest global setup: set required env vars before any module is imported.
 * Tests use mongodb-memory-server so the URI value is overridden anyway.
 */
process.env["NODE_ENV"] = "test";
process.env["MONGODB_URI"] = "mongodb://127.0.0.1:27017/gopratle_test";
process.env["FRONTEND_URL"] = "http://localhost:3000";
process.env["PORT"] = "5001";
