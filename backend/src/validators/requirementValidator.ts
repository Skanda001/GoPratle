import { z } from "zod";
import {
  EVENT_TYPES,
  DATE_MODES,
  SERVICES_REQUIRED,
  PLANNING_SCOPES,
  EXPERIENCE_LEVELS,
  CURRENCIES,
  PERFORMANCE_TYPES,
  CREW_ROLES,
} from "../models/Requirement.js";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Trim a string; return undefined if empty after trimming */
const optionalString = (maxLength: number) =>
  z
    .string()
    .trim()
    .max(maxLength)
    .optional()
    .transform((v) => (v === "" ? undefined : v));

/** Date-only string "YYYY-MM-DD" that must be a real calendar date */
const dateOnlyString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
  .refine((v) => {
    const d = new Date(v + "T00:00:00Z");
    return !isNaN(d.getTime()) && d.toISOString().startsWith(v);
  }, "Invalid calendar date");

// UTC today minus 1 day (so IST users at end-of-day never get false rejections)
function getMinAllowedDate(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

// ---------------------------------------------------------------------------
// Common (Step 1) base shape
// ---------------------------------------------------------------------------
const commonBaseSchema = z.object({
  eventName: z.string().trim().min(3).max(100),
  eventType: z.enum(EVENT_TYPES),
  dateMode: z.enum(DATE_MODES),
  location: z.string().trim().min(2).max(100),
  venue: optionalString(100),
});

// Date refinement applied after discriminated union resolution
const dateRefinement = commonBaseSchema.extend({
  startDate: dateOnlyString,
  endDate: z.string().optional(),
});

/** Validate the date fields according to dateMode rules */
function refineDates<T extends { dateMode: string; startDate: string; endDate?: string }>(
  data: T,
  ctx: z.RefinementCtx
): void {
  const minDate = getMinAllowedDate();

  if (data.startDate < minDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["startDate"],
      message: "Start date cannot be in the past",
    });
  }

  if (data.dateMode === "single") {
    if (data.endDate !== undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: "endDate must be absent for single-date events",
      });
    }
  } else {
    // range mode
    if (!data.endDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: "endDate is required for range events",
      });
      return;
    }
    if (data.endDate < data.startDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: "endDate must be on or after startDate",
      });
    }
    // Max 90-day span
    const start = new Date(data.startDate + "T00:00:00Z");
    const end = new Date(data.endDate + "T00:00:00Z");
    const spanDays = (end.getTime() - start.getTime()) / 86_400_000;
    if (spanDays > 90) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: "Event span cannot exceed 90 days",
      });
    }
  }
}

// ---------------------------------------------------------------------------
// Planner details validator
// ---------------------------------------------------------------------------
const plannerDetailsSchema = z.object({
  guestCount: z.number().int().min(1).max(100000),
  budget: z.number().min(0).optional(),
  currency: z.enum(CURRENCIES).default("INR"),
  servicesRequired: z.array(z.enum(SERVICES_REQUIRED)).min(1),
  styleTheme: optionalString(100),
  planningScope: z.enum(PLANNING_SCOPES),
  coordinationDays: z.number().int().min(1).max(90),
  preferredExperience: z.enum(EXPERIENCE_LEVELS).optional(),
  specialRequests: optionalString(1000),
});

// ---------------------------------------------------------------------------
// Performer details validator
// ---------------------------------------------------------------------------
const performerDetailsSchema = z
  .object({
    performanceType: z.enum(PERFORMANCE_TYPES),
    performerCount: z.number().int().min(1).max(50),
    durationMinutes: z.number().int().min(5).max(720),
    performanceCount: z.number().int().min(1).max(20),
    genre: optionalString(100),
    soundSystemRequired: z.boolean(),
    lightingRequired: z.boolean(),
    stageRequired: z.boolean(),
    equipmentRequirements: optionalString(500),
    specialInstructions: optionalString(1000),
    budgetMin: z.number().min(0).optional(),
    budgetMax: z.number().min(0).optional(),
    budgetCurrency: z.enum(CURRENCIES).default("INR"),
  })
  .superRefine((data, ctx) => {
    if (
      data.budgetMin !== undefined &&
      data.budgetMax !== undefined &&
      data.budgetMax < data.budgetMin
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["budgetMax"],
        message: "budgetMax must be greater than or equal to budgetMin",
      });
    }
  });

// ---------------------------------------------------------------------------
// Crew details validator
// ---------------------------------------------------------------------------
const crewDetailsSchema = z.object({
  roles: z.array(z.enum(CREW_ROLES)).min(1),
  crewCount: z.number().int().min(1).max(500),
  shiftHours: z.number().min(0.5).max(24),
  shiftCount: z.number().int().min(1).max(90),
  experienceLevel: z.enum(EXPERIENCE_LEVELS),
  equipmentRequired: optionalString(500),
  dressCode: optionalString(200),
  reportingInstructions: optionalString(500),
  specialRequests: optionalString(1000),
});

// ---------------------------------------------------------------------------
// Combined discriminated union validator (strict mode)
// ---------------------------------------------------------------------------
const plannerSchema = dateRefinement
  .extend({ category: z.literal("planner"), details: plannerDetailsSchema })
  .strict()
  .superRefine(refineDates);

const performerSchema = dateRefinement
  .extend({ category: z.literal("performer"), details: performerDetailsSchema })
  .strict()
  .superRefine(refineDates);

const crewSchema = dateRefinement
  .extend({ category: z.literal("crew"), details: crewDetailsSchema })
  .strict()
  .superRefine(refineDates);

export const requirementValidator = z.discriminatedUnion("category", [
  plannerSchema,
  performerSchema,
  crewSchema,
]);

// ---------------------------------------------------------------------------
// Query validators
// ---------------------------------------------------------------------------
export const listQueryValidator = z.object({
  category: z.enum(["planner", "performer", "crew"]).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export type CreateRequirementInput = z.infer<typeof requirementValidator>;
export type ListQueryInput = z.infer<typeof listQueryValidator>;
