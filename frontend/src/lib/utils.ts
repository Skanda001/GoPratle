import { CURRENCY_SYMBOLS } from "./constants";

// ---------------------------------------------------------------------------
// Date formatting
// ---------------------------------------------------------------------------

/** Format a YYYY-MM-DD string as "12 Dec 2026" */
export function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(Date.UTC(year ?? 0, (month ?? 1) - 1, day ?? 1));
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Format a date range or single date */
export function formatDateRange(startDate: string, endDate?: string): string {
  if (!endDate || endDate === startDate) return formatDate(startDate);
  return `${formatDate(startDate)} – ${formatDate(endDate)}`;
}

// ---------------------------------------------------------------------------
// Number / money formatting
// ---------------------------------------------------------------------------

/** Format a number as currency using Intl.NumberFormat */
export function formatMoney(amount: number, currency: string): string {
  const locale = currency === "INR" ? "en-IN" : "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Get the symbol for a currency code */
export function getCurrencySymbol(currency: string): string {
  return CURRENCY_SYMBOLS[currency] ?? currency;
}

// ---------------------------------------------------------------------------
// Today's date as YYYY-MM-DD (for <input type="date" min=...>)
// ---------------------------------------------------------------------------

export function getTodayString(): string {
  return new Date().toISOString().slice(0, 10);
}

// ---------------------------------------------------------------------------
// UUID v4 generation (crypto.randomUUID — available in modern browsers + Node)
// ---------------------------------------------------------------------------

export function generateUUID(): string {
  return crypto.randomUUID();
}

// ---------------------------------------------------------------------------
// Step field path → step number mapping (for navigating to error step)
// ---------------------------------------------------------------------------

/** Given a dot-path field from an API error, return the wizard step number (1-3) */
export function fieldToStep(field: string, category: string): number {
  if (!field.startsWith("details.")) return 1;
  const subField = field.replace("details.", "");

  const step2Fields: Record<string, string[]> = {
    planner: ["guestCount", "budget", "currency", "servicesRequired", "styleTheme"],
    performer: ["performanceType", "performerCount", "durationMinutes", "performanceCount", "genre"],
    crew: ["roles", "crewCount", "shiftHours", "shiftCount"],
  };

  const fields2 = step2Fields[category] ?? [];
  if (fields2.some((f) => subField.startsWith(f))) return 2;
  return 3;
}
