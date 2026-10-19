import { FilterQuery, isValidObjectId } from "mongoose";
import { requirementValidator, listQueryValidator } from "../validators/requirementValidator.js";
import RequirementModel from "../models/Requirement.js";
import PlannerRequirementModel from "../models/PlannerRequirement.js";
import PerformerRequirementModel from "../models/PerformerRequirement.js";
import CrewRequirementModel from "../models/CrewRequirement.js";
import type { RequirementDocument, Category } from "../models/Requirement.js";
import type { ListQueryInput } from "../validators/requirementValidator.js";

// Touch discriminator models to register them before any query runs
void PlannerRequirementModel;
void PerformerRequirementModel;
void CrewRequirementModel;

// ---------------------------------------------------------------------------
// Map category → discriminator model
// ---------------------------------------------------------------------------
function getModelForCategory(category: Category) {
  switch (category) {
    case "planner":
      return PlannerRequirementModel;
    case "performer":
      return PerformerRequirementModel;
    case "crew":
      return CrewRequirementModel;
  }
}

// ---------------------------------------------------------------------------
// Create
// ---------------------------------------------------------------------------
export async function createRequirement(
  body: unknown,
  idempotencyKey?: string,
  user?: { userId: string; email: string }
): Promise<{ doc: RequirementDocument; created: boolean }> {
  // Validate with Zod
  const parsed = requirementValidator.safeParse(body);
  if (!parsed.success) {
    throw { type: "validation", errors: parsed.error.issues };
  }

  const data = parsed.data;
  const category = data.category as Category;

  // Idempotency check
  if (idempotencyKey) {
    const existing = await RequirementModel.findOne({ idempotencyKey }).lean<RequirementDocument>();
    if (existing) {
      return { doc: existing, created: false };
    }
  }

  const Model = getModelForCategory(category);

  const docData: Record<string, unknown> = {
    eventName: data.eventName,
    eventType: data.eventType,
    dateMode: data.dateMode,
    startDate: data.startDate,
    location: data.location,
    details: data.details,
    ...(data.venue !== undefined && { venue: data.venue }),
    ...(data.dateMode === "range" && data.endDate !== undefined && { endDate: data.endDate }),
    ...(idempotencyKey && { idempotencyKey }),
    ...(user && { userId: user.userId, userEmail: user.email }),
  };

  // Using Model as any to work around TypeScript's union call signature incompatibility
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const created = await (Model as any).create(docData) as RequirementDocument;
  return { doc: created.toObject ? created.toObject() as RequirementDocument : created, created: true };
}

// ---------------------------------------------------------------------------
// Get user requirements
// ---------------------------------------------------------------------------
export async function getUserRequirements(userId: string): Promise<RequirementDocument[]> {
  return RequirementModel.find({ userId }).sort({ createdAt: -1 }).lean<RequirementDocument[]>();
}

// ---------------------------------------------------------------------------
// Get one
// ---------------------------------------------------------------------------
export async function getRequirementById(id: string): Promise<RequirementDocument | null> {
  if (!isValidObjectId(id)) return null;
  return RequirementModel.findById(id).lean<RequirementDocument>();
}

// ---------------------------------------------------------------------------
// List with pagination
// ---------------------------------------------------------------------------
export interface ListResult {
  data: RequirementDocument[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function listRequirements(rawQuery: unknown): Promise<ListResult> {
  const parsed = listQueryValidator.safeParse(rawQuery);
  if (!parsed.success) {
    throw { type: "validation", errors: parsed.error.issues };
  }

  const { category, page, limit } = parsed.data as ListQueryInput;
  const filter: FilterQuery<RequirementDocument> = {};
  if (category) filter["category"] = category;

  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    RequirementModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean<RequirementDocument[]>(),
    RequirementModel.countDocuments(filter),
  ]);

  return {
    data,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}
