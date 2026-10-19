// ---------------------------------------------------------------------------
// All enum values and their human-readable labels — single source of truth
// for the frontend. Keep field names identical to the backend validators.
// ---------------------------------------------------------------------------

export const EVENT_TYPE_LABELS: Record<string, string> = {
  wedding: "Wedding",
  corporate_event: "Corporate Event",
  college_fest: "College Fest",
  birthday: "Birthday",
  concert: "Concert",
  private_party: "Private Party",
  other: "Other",
};

export const CATEGORY_LABELS: Record<string, string> = {
  planner: "Event Planner",
  performer: "Performer",
  crew: "Crew",
};

export const DATE_MODE_LABELS: Record<string, string> = {
  single: "Single Day",
  range: "Date Range",
};

export const SERVICES_REQUIRED_LABELS: Record<string, string> = {
  venue_selection: "Venue Selection",
  decoration_theme: "Decoration & Theme",
  catering_coordination: "Catering Coordination",
  vendor_management: "Vendor Management",
  guest_management: "Guest Management",
  complete_event_planning: "Complete Event Planning",
};

export const PLANNING_SCOPE_LABELS: Record<string, string> = {
  full_planning: "Full Planning",
  partial_planning: "Partial Planning",
  day_of_coordination: "Day-of Coordination",
};

export const EXPERIENCE_LEVEL_LABELS: Record<string, string> = {
  entry_level: "Entry Level",
  intermediate: "Intermediate",
  experienced: "Experienced",
};

export const CURRENCY_LABELS: Record<string, string> = {
  INR: "INR (₹)",
  USD: "USD ($)",
  EUR: "EUR (€)",
  GBP: "GBP (£)",
};

export const CURRENCY_SYMBOLS: Record<string, string> = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

export const PERFORMANCE_TYPE_LABELS: Record<string, string> = {
  singer: "Singer",
  dj: "DJ",
  live_band: "Live Band",
  dancer: "Dancer",
  instrumentalist: "Instrumentalist",
  comedian: "Comedian",
  other: "Other",
};

export const CREW_ROLE_LABELS: Record<string, string> = {
  sound_technician: "Sound Technician",
  lighting_technician: "Lighting Technician",
  stagehand: "Stagehand",
  photographer: "Photographer",
  videographer: "Videographer",
  security_staff: "Security Staff",
  setup_logistics: "Setup & Logistics",
  other: "Other",
};

// Step titles per category
export const STEP_TITLES: Record<string, [string, string]> = {
  planner: ["Planning Details", "Additional Requirements"],
  performer: ["Performance Details", "Technical Requirements"],
  crew: ["Staffing Requirements", "Work Details"],
};

// ---------------------------------------------------------------------------
// Estimated price data — INR only, for display purposes
// ---------------------------------------------------------------------------

/** Per-service estimated fee for event planners (₹ INR) */
export const SERVICE_PRICES: Record<string, number> = {
  venue_selection: 15000,
  decoration_theme: 25000,
  catering_coordination: 20000,
  vendor_management: 18000,
  guest_management: 12000,
  complete_event_planning: 75000,
};

/** Base rate per performance (₹ INR) for performers */
export const PERFORMER_BASE_RATES: Record<string, number> = {
  singer: 15000,
  dj: 20000,
  live_band: 40000,
  dancer: 8000,
  instrumentalist: 12000,
  comedian: 25000,
  other: 10000,
};

/** Hourly rate per crew member (₹ INR) */
export const CREW_ROLE_RATES: Record<string, number> = {
  sound_technician: 500,
  lighting_technician: 450,
  stagehand: 300,
  photographer: 800,
  videographer: 1000,
  security_staff: 350,
  setup_logistics: 300,
  other: 350,
};
