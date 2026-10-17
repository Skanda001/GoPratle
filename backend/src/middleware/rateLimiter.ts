import rateLimit from "express-rate-limit";
import { env } from "../config/env.js";
import { sendError } from "../utils/response.js";

export const requirementRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.NODE_ENV === "test" ? 10000 : env.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json(sendError("Too many requests. Please try again later."));
  },
});
