import type { ZodIssue } from "zod";

// ---------------------------------------------------------------------------
// Response shape helpers — always return plain objects (not Response objects)
// ---------------------------------------------------------------------------

export interface SuccessResponse<T = unknown> {
  success: true;
  message: string;
  data: T;
  meta?: Record<string, unknown>;
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: { field: string; message: string }[];
}

export function sendSuccess<T>(
  message: string,
  data: T,
  meta?: Record<string, unknown>
): SuccessResponse<T> {
  return meta !== undefined
    ? { success: true, message, data, meta }
    : { success: true, message, data };
}

export function sendError(message: string, errors?: { field: string; message: string }[]): ErrorResponse {
  return { success: false, message, ...(errors && { errors }) };
}

export function sendValidationError(issues: ZodIssue[]): ErrorResponse {
  const errors = issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));
  return { success: false, message: "Validation failed", errors };
}
