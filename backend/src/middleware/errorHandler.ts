import type { Request, Response, NextFunction } from "express";
import { env } from "../config/env.js";
import { sendError } from "../utils/response.js";

interface HttpError extends Error {
  status?: number;
  statusCode?: number;
  type?: string;
}

export function errorHandler(
  err: HttpError,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  // Express body-parser SyntaxError (malformed JSON)
  if (err instanceof SyntaxError && "body" in err) {
    res.status(400).json(sendError("Invalid JSON in request body"));
    return;
  }

  // Express body-parser PayloadTooLargeError
  if (err.type === "entity.too.large") {
    res.status(413).json(sendError("Request body too large"));
    return;
  }

  const statusCode = err.status ?? err.statusCode ?? 500;

  // Never expose stack traces in production
  if (env.NODE_ENV !== "production") {
    console.error("Unhandled error:", err);
  } else {
    console.error("Unhandled error:", err.message);
  }

  res.status(statusCode).json(sendError("An unexpected error occurred"));
}
