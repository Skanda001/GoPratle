import { Router } from "express";
import * as controller from "../controllers/requirementController.js";
import { requirementRateLimiter } from "../middleware/rateLimiter.js";
import { requireAuth, optionalAuth } from "../middleware/auth.js";

const router = Router();

// Health — no rate limiting, no credentials
router.get("/health", controller.healthCheck);

// Requirements
router.post("/requirements", requirementRateLimiter, optionalAuth, controller.createRequirement);
router.get("/requirements", controller.listRequirements);
router.get("/requirements/my", requireAuth, controller.getMyRequirements);
router.get("/requirements/:id", controller.getRequirementById);

export default router;
