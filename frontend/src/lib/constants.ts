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
