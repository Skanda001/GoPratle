import type { Request, Response } from "express";
import { sendError } from "../utils/response.js";

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json(sendError("Route not found"));
}
