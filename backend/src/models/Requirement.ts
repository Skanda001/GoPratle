import mongoose, { Schema, Document, Model } from "mongoose";

// ---------------------------------------------------------------------------
// Shared enums
// ---------------------------------------------------------------------------
export const EVENT_TYPES = [
  "wedding",
  "corporate_event",
  "college_fest",
  "birthday",
  "concert",
  "private_party",
  "other",
] as const;

export const CATEGORIES = ["planner", "performer", "crew"] as const;
export const DATE_MODES = ["single", "range"] as const;
export const STATUSES = ["submitted", "cancelled"] as const;

export type EventType = (typeof EVENT_TYPES)[number];
export type Category = (typeof CATEGORIES)[number];
export type DateMode = (typeof DATE_MODES)[number];
export type Status = (typeof STATUSES)[number];

// ---------------------------------------------------------------------------
// Planner detail types
// ---------------------------------------------------------------------------
export const SERVICES_REQUIRED = [
  "venue_selection",
  "decoration_theme",
  "catering_coordination",
  "vendor_management",
  "guest_management",
  "complete_event_planning",
] as const;

export const PLANNING_SCOPES = [
  "full_planning",
  "partial_planning",
  "day_of_coordination",
] as const;

export const EXPERIENCE_LEVELS = ["entry_level", "intermediate", "experienced"] as const;
export const CURRENCIES = ["INR", "USD", "EUR", "GBP"] as const;

export type ServiceRequired = (typeof SERVICES_REQUIRED)[number];
export type PlanningScope = (typeof PLANNING_SCOPES)[number];
export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number];
export type Currency = (typeof CURRENCIES)[number];

export interface PlannerDetails {
  guestCount: number;
  budget?: number;
  currency: Currency;
  servicesRequired: ServiceRequired[];
  styleTheme?: string;
  planningScope: PlanningScope;
  coordinationDays: number;
  preferredExperience?: ExperienceLevel;
  specialRequests?: string;
}

// ---------------------------------------------------------------------------
// Performer detail types
// ---------------------------------------------------------------------------
export const PERFORMANCE_TYPES = [
  "singer",
  "dj",
  "live_band",
  "dancer",
  "instrumentalist",
  "comedian",
  "other",
] as const;

export type PerformanceType = (typeof PERFORMANCE_TYPES)[number];

export interface PerformerDetails {
  performanceType: PerformanceType;
  performerCount: number;
  durationMinutes: number;
  performanceCount: number;
  genre?: string;
  soundSystemRequired: boolean;
  lightingRequired: boolean;
  stageRequired: boolean;
  equipmentRequirements?: string;
  specialInstructions?: string;
  budgetMin?: number;
  budgetMax?: number;
  budgetCurrency: Currency;
}

// ---------------------------------------------------------------------------
// Crew detail types
// ---------------------------------------------------------------------------
export const CREW_ROLES = [
  "sound_technician",
  "lighting_technician",
  "stagehand",
  "photographer",
  "videographer",
  "security_staff",
  "setup_logistics",
  "other",
] as const;

export type CrewRole = (typeof CREW_ROLES)[number];

export interface CrewDetails {
  roles: CrewRole[];
  crewCount: number;
  shiftHours: number;
  shiftCount: number;
  experienceLevel: ExperienceLevel;
  equipmentRequired?: string;
  dressCode?: string;
  reportingInstructions?: string;
  specialRequests?: string;
}

// ---------------------------------------------------------------------------
// Base document interface
// ---------------------------------------------------------------------------
export interface BaseRequirementFields {
  eventName: string;
  eventType: EventType;
  dateMode: DateMode;
  startDate: string;
  endDate?: string;
  location: string;
  venue?: string;
  status: Status;
  idempotencyKey?: string;
  userId?: string;
  userEmail?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Discriminated union for the full document
export type RequirementDocument = Document &
  BaseRequirementFields &
  (
    | { category: "planner"; details: PlannerDetails }
    | { category: "performer"; details: PerformerDetails }
    | { category: "crew"; details: CrewDetails }
  );

// ---------------------------------------------------------------------------
// Base Mongoose schema
// ---------------------------------------------------------------------------
const baseSchema = new Schema<RequirementDocument>(
  {
    eventName: { type: String, required: true, trim: true, minlength: 3, maxlength: 100 },
    eventType: { type: String, required: true, enum: EVENT_TYPES },
    dateMode: { type: String, required: true, enum: DATE_MODES },
    startDate: { type: String, required: true },
    endDate: { type: String },
    location: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    venue: { type: String, trim: true, maxlength: 100 },
    status: { type: String, enum: STATUSES, default: "submitted" },
    idempotencyKey: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: "User", sparse: true },
    userEmail: { type: String, sparse: true },
  },
  {
    timestamps: true,
    discriminatorKey: "category",
  }
);

// Indexes
baseSchema.index({ category: 1, createdAt: -1 });
baseSchema.index({ userId: 1, createdAt: -1 }, { sparse: true });
baseSchema.index({ idempotencyKey: 1 }, { unique: true, sparse: true });

// Disable lean documents returning __v
baseSchema.set("versionKey", "__v");

// ---------------------------------------------------------------------------
// Base model (typed loosely; discriminators add the details field)
// ---------------------------------------------------------------------------
export const RequirementModel: Model<RequirementDocument> =
  mongoose.models["Requirement"] ??
  mongoose.model<RequirementDocument>("Requirement", baseSchema, "requirements");

export default RequirementModel;
