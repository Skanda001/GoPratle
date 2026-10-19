import { z } from "zod";

// ---------------------------------------------------------------------------
// Helpers (mirrored from backend — keep field names identical)
// ---------------------------------------------------------------------------

const optionalTrimmedString = (maxLength: number) =>
  z
    .string()
    .trim()
    .max(maxLength, `Must be ${maxLength} characters or less`)
    .optional()
    .transform((v) => (v === "" ? undefined : v));

const dateOnlyString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
  .refine((v) => {
    const d = new Date(v + "T00:00:00Z");
    return !isNaN(d.getTime()) && d.toISOString().startsWith(v);
  }, "Invalid calendar date");

// ---------------------------------------------------------------------------
// Step 1 – Event Basics
// ---------------------------------------------------------------------------

export const basicsSchema = z
  .object({
    eventName: z
      .string()
      .trim()
      .min(3, "Event name must be at least 3 characters")
      .max(100, "Event name must be 100 characters or less"),
    eventType: z.enum(
      [
        "wedding",
        "corporate_event",
        "college_fest",
        "birthday",
        "concert",
        "private_party",
        "other",
      ],
      { required_error: "Please select an event type" }
    ),
    eventTypeOther: z
      .string()
      .trim()
      .max(100, "Must be 100 characters or less")
      .optional(),
    dateMode: z.enum(["single", "range"], { required_error: "Please select a date mode" }),
    startDate: dateOnlyString,
    endDate: z.string().optional(),
    location: z
      .string()
      .trim()
      .min(2, "Location must be at least 2 characters")
      .max(100, "Location must be 100 characters or less"),
    venue: optionalTrimmedString(100),
    category: z.enum(["planner", "performer", "crew"], {
      required_error: "Please select a category",
    }),
  })
  .superRefine((data, ctx) => {
    // Require eventTypeOther when eventType is "other"
    if (data.eventType === "other" && !data.eventTypeOther?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["eventTypeOther"],
        message: "Please describe your event type",
      });
    }
    // Client-side date validation: check start isn't more than 1 day in the past
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    const minDate = yesterday.toISOString().slice(0, 10);

    if (data.startDate < minDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["startDate"],
        message: "Start date cannot be in the past",
      });
    }

    if (data.dateMode === "range") {
      if (!data.endDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["endDate"],
          message: "End date is required for range events",
        });
      } else if (data.endDate < data.startDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["endDate"],
          message: "End date must be on or after start date",
        });
      } else {
        const span =
          (new Date(data.endDate + "T00:00:00Z").getTime() -
            new Date(data.startDate + "T00:00:00Z").getTime()) /
          86_400_000;
        if (span > 90) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["endDate"],
            message: "Event span cannot exceed 90 days",
          });
        }
      }
    }
  });

// ---------------------------------------------------------------------------
// Planner schemas
// ---------------------------------------------------------------------------

export const plannerStep2Schema = z.object({
  guestCount: z
    .number({ invalid_type_error: "Guest count is required" })
    .int("Must be a whole number")
    .min(1, "At least 1 guest required")
    .max(100000, "Cannot exceed 100,000 guests"),
  budget: z.number().min(0, "Budget cannot be negative").optional(),
  currency: z.enum(["INR", "USD", "EUR", "GBP"]).default("INR"),
  servicesRequired: z
    .array(
      z.enum([
        "venue_selection",
        "decoration_theme",
        "catering_coordination",
        "vendor_management",
        "guest_management",
        "complete_event_planning",
      ])
    )
    .min(1, "Select at least one service"),
  styleTheme: optionalTrimmedString(100),
});

export const plannerStep3Schema = z.object({
  planningScope: z.enum(["full_planning", "partial_planning", "day_of_coordination"], {
    required_error: "Please select a planning scope",
  }),
  coordinationDays: z
    .number({ invalid_type_error: "Coordination days is required" })
    .int("Must be a whole number")
    .min(1, "At least 1 day required")
    .max(90, "Cannot exceed 90 days"),
  preferredExperience: z.enum(["entry_level", "intermediate", "experienced"]).optional(),
  specialRequests: optionalTrimmedString(1000),
});

// ---------------------------------------------------------------------------
// Performer schemas
// ---------------------------------------------------------------------------

export const performerStep2Schema = z.object({
  performanceType: z.enum(
    ["singer", "dj", "live_band", "dancer", "instrumentalist", "comedian", "other"],
    { required_error: "Please select a performance type" }
  ),
  performerCount: z
    .number({ invalid_type_error: "Performer count is required" })
    .int()
    .min(1)
    .max(50, "Cannot exceed 50 performers"),
  durationMinutes: z
    .number({ invalid_type_error: "Duration is required" })
    .int()
    .min(5, "Minimum 5 minutes")
    .max(720, "Maximum 720 minutes"),
  performanceCount: z
    .number({ invalid_type_error: "Performance count is required" })
    .int()
    .min(1)
    .max(20, "Cannot exceed 20 performances"),
  genre: optionalTrimmedString(100),
});

export const performerStep3Schema = z
  .object({
    soundSystemRequired: z.boolean(),
    lightingRequired: z.boolean(),
    stageRequired: z.boolean(),
    equipmentRequirements: optionalTrimmedString(500),
    specialInstructions: optionalTrimmedString(1000),
    budgetMin: z.number().min(0, "Cannot be negative").optional(),
    budgetMax: z.number().min(0, "Cannot be negative").optional(),
    budgetCurrency: z.enum(["INR", "USD", "EUR", "GBP"]).default("INR"),
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
        message: "Maximum budget must be at least the minimum budget",
      });
    }
  });

// ---------------------------------------------------------------------------
// Crew schemas
// ---------------------------------------------------------------------------

export const crewStep2Schema = z.object({
  roles: z
    .array(
      z.enum([
        "sound_technician",
        "lighting_technician",
        "stagehand",
        "photographer",
        "videographer",
        "security_staff",
        "setup_logistics",
        "other",
      ])
    )
    .min(1, "Select at least one role"),
  crewCount: z
    .number({ invalid_type_error: "Crew count is required" })
    .int()
    .min(1)
    .max(500, "Cannot exceed 500 crew members"),
  shiftHours: z
    .number({ invalid_type_error: "Shift hours is required" })
    .min(0.5, "Minimum 0.5 hours")
    .max(24, "Cannot exceed 24 hours"),
  shiftCount: z
    .number({ invalid_type_error: "Shift count is required" })
    .int()
    .min(1)
    .max(90, "Cannot exceed 90 shifts"),
});

export const crewStep3Schema = z.object({
  experienceLevel: z.enum(["entry_level", "intermediate", "experienced"], {
    required_error: "Please select an experience level",
  }),
  equipmentRequired: optionalTrimmedString(500),
  dressCode: optionalTrimmedString(200),
  reportingInstructions: optionalTrimmedString(500),
  specialRequests: optionalTrimmedString(1000),
});

// ---------------------------------------------------------------------------
// Inferred types
// ---------------------------------------------------------------------------
export type BasicsFormData = z.infer<typeof basicsSchema>;
export type PlannerStep2FormData = z.infer<typeof plannerStep2Schema>;
export type PlannerStep3FormData = z.infer<typeof plannerStep3Schema>;
export type PerformerStep2FormData = z.infer<typeof performerStep2Schema>;
export type PerformerStep3FormData = z.infer<typeof performerStep3Schema>;
export type CrewStep2FormData = z.infer<typeof crewStep2Schema>;
export type CrewStep3FormData = z.infer<typeof crewStep3Schema>;
