// ---------------------------------------------------------------------------
// TypeScript discriminated-union types for the frontend.
// Field names are identical to the backend domain model.
// ---------------------------------------------------------------------------

export type EventType =
  | "wedding"
  | "corporate_event"
  | "college_fest"
  | "birthday"
  | "concert"
  | "private_party"
  | "other";

export type Category = "planner" | "performer" | "crew";
export type DateMode = "single" | "range";
export type Currency = "INR" | "USD" | "EUR" | "GBP";
export type PlanningScope = "full_planning" | "partial_planning" | "day_of_coordination";
export type ExperienceLevel = "entry_level" | "intermediate" | "experienced";
export type ServiceRequired =
  | "venue_selection"
  | "decoration_theme"
  | "catering_coordination"
  | "vendor_management"
  | "guest_management"
  | "complete_event_planning";

export type PerformanceType =
  | "singer"
  | "dj"
  | "live_band"
  | "dancer"
  | "instrumentalist"
  | "comedian"
  | "other";

export type CrewRole =
  | "sound_technician"
  | "lighting_technician"
  | "stagehand"
  | "photographer"
  | "videographer"
  | "security_staff"
  | "setup_logistics"
  | "other";

// ---------------------------------------------------------------------------
// Form data per step (used by React Hook Form instances)
// ---------------------------------------------------------------------------

export interface BasicsFormData {
  eventName: string;
  eventType: EventType;
  eventTypeOther?: string;
  dateMode: DateMode;
  startDate: string;
  endDate?: string;
  location: string;
  venue?: string;
  category: Category;
}

export interface PlannerStep2Data {
  guestCount: number;
  budget?: number;
  currency: Currency;
  servicesRequired: ServiceRequired[];
  styleTheme?: string;
}

export interface PlannerStep3Data {
  planningScope: PlanningScope;
  coordinationDays: number;
  preferredExperience?: ExperienceLevel;
  specialRequests?: string;
}

export interface PerformerStep2Data {
  performanceType: PerformanceType;
  performerCount: number;
  durationMinutes: number;
  performanceCount: number;
  genre?: string;
}

export interface PerformerStep3Data {
  soundSystemRequired: boolean;
  lightingRequired: boolean;
  stageRequired: boolean;
  equipmentRequirements?: string;
  specialInstructions?: string;
  budgetMin?: number;
  budgetMax?: number;
  budgetCurrency: Currency;
}

export interface CrewStep2Data {
  roles: CrewRole[];
  crewCount: number;
  shiftHours: number;
  shiftCount: number;
}

export interface CrewStep3Data {
  experienceLevel: ExperienceLevel;
  equipmentRequired?: string;
  dressCode?: string;
  reportingInstructions?: string;
  specialRequests?: string;
}

// ---------------------------------------------------------------------------
// Full details per category (Step 2 + Step 3 merged)
// ---------------------------------------------------------------------------
export type PlannerDetails = PlannerStep2Data & PlannerStep3Data;
export type PerformerDetails = PerformerStep2Data & PerformerStep3Data;
export type CrewDetails = CrewStep2Data & CrewStep3Data;

// ---------------------------------------------------------------------------
// API response types
// ---------------------------------------------------------------------------

export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  success: false;
  message: string;
  errors?: { field: string; message: string }[];
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export interface RequirementRecord {
  _id: string;
  category: Category;
  eventName: string;
  eventType: EventType;
  dateMode: DateMode;
  startDate: string;
  endDate?: string;
  location: string;
  venue?: string;
  details: PlannerDetails | PerformerDetails | CrewDetails;
  status: "submitted" | "cancelled";
  idempotencyKey?: string;
  createdAt: string;
  updatedAt: string;
}
