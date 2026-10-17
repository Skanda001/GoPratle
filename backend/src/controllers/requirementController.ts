import type { Request, Response, NextFunction } from "express";
import type { ZodIssue } from "zod";
import * as service from "../services/requirementService.js";
import { getDBStatus } from "../config/db.js";
import { sendSuccess, sendError, sendValidationError } from "../utils/response.js";

// ---------------------------------------------------------------------------
// POST /api/requirements
// ---------------------------------------------------------------------------
export async function createRequirement(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (getDBStatus() === "disconnected") {
      res.status(503).json(sendError("Database unavailable. Please try again later."));
      return;
    }

    const idempotencyKey =
      typeof req.headers["idempotency-key"] === "string"
        ? req.headers["idempotency-key"]
        : undefined;

    const { doc, created } = await service.createRequirement(req.body, idempotencyKey);

    res.status(created ? 201 : 200).json(
      sendSuccess(
        created ? "Requirement created successfully" : "Requirement already exists",
        doc
      )
    );
  } catch (err) {
    if (isValidationError(err)) {
      res.status(400).json(sendValidationError(err.errors));
      return;
    }
    next(err);
  }
}

// ---------------------------------------------------------------------------
// GET /api/requirements/:id
// ---------------------------------------------------------------------------
export async function getRequirementById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = typeof req.params["id"] === "string" ? req.params["id"] : "";
    if (!id) {
      res.status(404).json(sendError("Requirement not found"));
      return;
    }

    const doc = await service.getRequirementById(id);
    if (!doc) {
      res.status(404).json(sendError("Requirement not found"));
      return;
    }

    res.status(200).json(sendSuccess("Requirement retrieved successfully", doc));
  } catch (err) {
    next(err);
  }
}

// ---------------------------------------------------------------------------
// GET /api/requirements
// ---------------------------------------------------------------------------
export async function listRequirements(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await service.listRequirements(req.query);
    res
      .status(200)
      .json(sendSuccess("Requirements retrieved successfully", result.data, result.meta));
  } catch (err) {
    if (isValidationError(err)) {
      res.status(400).json(sendValidationError(err.errors));
      return;
    }
    next(err);
  }
}

// ---------------------------------------------------------------------------
// GET /api/health
// ---------------------------------------------------------------------------
export function healthCheck(_req: Request, res: Response): void {
  const dbStatus = getDBStatus();
  const statusCode = dbStatus === "connected" ? 200 : 503;

  res.status(statusCode).json({
    success: dbStatus === "connected",
    status: dbStatus === "connected" ? "ok" : "degraded",
    uptime: process.uptime(),
    database: dbStatus,
  });
}

// ---------------------------------------------------------------------------
// Type guard for service validation errors
// ---------------------------------------------------------------------------
interface ServiceValidationError {
  type: "validation";
  errors: ZodIssue[];
}

function isValidationError(err: unknown): err is ServiceValidationError {
  return (
    typeof err === "object" &&
    err !== null &&
    "type" in err &&
    (err as ServiceValidationError).type === "validation"
  );
}
