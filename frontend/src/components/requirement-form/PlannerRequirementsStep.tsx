"use client";

import { CategoryRequirementsStep, type FieldConfig } from "./CategoryRequirementsStep";
import { plannerStep2Schema, plannerStep3Schema } from "@/lib/validation";
import {
  SERVICES_REQUIRED_LABELS,
  PLANNING_SCOPE_LABELS,
  EXPERIENCE_LEVEL_LABELS,
  CURRENCY_LABELS,
} from "@/lib/constants";
import type { PlannerDetails } from "@/types";

// ---------------------------------------------------------------------------
// Field configs per step
// ---------------------------------------------------------------------------

const SERVICES_OPTIONS = Object.entries(SERVICES_REQUIRED_LABELS).map(([v, l]) => ({ value: v, label: l }));
const SCOPE_OPTIONS = Object.entries(PLANNING_SCOPE_LABELS).map(([v, l]) => ({ value: v, label: l }));
const EXP_OPTIONS = Object.entries(EXPERIENCE_LEVEL_LABELS).map(([v, l]) => ({ value: v, label: l }));
const CURRENCY_OPTIONS = Object.entries(CURRENCY_LABELS).map(([v, l]) => ({ value: v, label: l }));

const STEP2_FIELDS: FieldConfig[] = [
  { type: "number", name: "guestCount", label: "Expected Guests", min: 1, max: 100000, placeholder: "e.g. 200" },
  {
    type: "currency-amount",
    name: "budget",
    amountName: "budget",
    currencyName: "currency",
    label: "Budget",
    optional: true,
    hint: "Approximate total budget for planning services",
    currencies: CURRENCY_OPTIONS,
  },
  {
    type: "chip-multi",
    name: "servicesRequired",
    label: "Services Required",
    options: SERVICES_OPTIONS,
    hint: "Select all that apply",
  },
  { type: "text", name: "styleTheme", label: "Style / Theme", optional: true, placeholder: "e.g. Black Tie Elegance" },
];

const STEP3_FIELDS: FieldConfig[] = [
  { type: "select", name: "planningScope", label: "Planning Scope", options: SCOPE_OPTIONS, placeholder: "Select scope" },
  { type: "number", name: "coordinationDays", label: "Coordination Days", min: 1, max: 90, placeholder: "e.g. 3" },
  {
    type: "select",
    name: "preferredExperience",
    label: "Preferred Experience Level",
    optional: true,
    options: EXP_OPTIONS,
    placeholder: "Any",
  },
  {
    type: "textarea",
    name: "specialRequests",
    label: "Special Requests",
    optional: true,
    placeholder: "Any special requirements or notes...",
    maxLength: 1000,
  },
];

// ---------------------------------------------------------------------------
// Wrapper components
// ---------------------------------------------------------------------------

interface PlannerStep2Props {
  formId: string;
  defaultValues: Partial<PlannerDetails>;
  onSubmit: (data: Partial<PlannerDetails>) => void;
}

export function PlannerStep2({ formId, defaultValues, onSubmit }: PlannerStep2Props) {
  return (
    <CategoryRequirementsStep
      formId={formId}
      schema={plannerStep2Schema}
      defaultValues={{
        guestCount: defaultValues.guestCount,
        budget: defaultValues.budget,
        currency: defaultValues.currency ?? "INR",
        servicesRequired: defaultValues.servicesRequired ?? [],
        styleTheme: defaultValues.styleTheme ?? "",
      }}
      fields={STEP2_FIELDS}
      onSubmit={onSubmit}
    />
  );
}

interface PlannerStep3Props {
  formId: string;
  defaultValues: Partial<PlannerDetails>;
  onSubmit: (data: Partial<PlannerDetails>) => void;
}

export function PlannerStep3({ formId, defaultValues, onSubmit }: PlannerStep3Props) {
  return (
    <CategoryRequirementsStep
      formId={formId}
      schema={plannerStep3Schema}
      defaultValues={{
        planningScope: defaultValues.planningScope,
        coordinationDays: defaultValues.coordinationDays,
        preferredExperience: defaultValues.preferredExperience,
        specialRequests: defaultValues.specialRequests ?? "",
      }}
      fields={STEP3_FIELDS}
      onSubmit={onSubmit}
    />
  );
}
