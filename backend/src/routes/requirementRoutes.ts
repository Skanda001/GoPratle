import { Router } from "express";
import * as controller from "../controllers/requirementController.js";
import { requirementRateLimiter } from "../middleware/rateLimiter.js";

const router = Router();

// Health — no rate limiting, no credentials
router.get("/health", controller.healthCheck);

// Requirements
router.post("/requirements", requirementRateLimiter, controller.createRequirement);
router.get("/requirements", controller.listRequirements);
router.get("/requirements/:id", controller.getRequirementById);

export default router;
