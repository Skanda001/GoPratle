"use client";

import { CategoryRequirementsStep, type FieldConfig } from "./CategoryRequirementsStep";
import { performerStep2Schema, performerStep3Schema } from "@/lib/validation";
import {
  PERFORMANCE_TYPE_LABELS,
  CURRENCY_LABELS,
} from "@/lib/constants";
import type { PerformerDetails } from "@/types";

const PERF_TYPE_OPTIONS = Object.entries(PERFORMANCE_TYPE_LABELS).map(([v, l]) => ({ value: v, label: l }));
const CURRENCY_OPTIONS = Object.entries(CURRENCY_LABELS).map(([v, l]) => ({ value: v, label: l }));

const STEP2_FIELDS: FieldConfig[] = [
  {
    type: "select",
    name: "performanceType",
    label: "Performance Type",
    options: PERF_TYPE_OPTIONS,
    placeholder: "Select type",
  },
  { type: "number", name: "performerCount", label: "Number of Performers", min: 1, max: 50, placeholder: "e.g. 1" },
  { type: "number", name: "durationMinutes", label: "Performance Duration (minutes)", min: 5, max: 720, placeholder: "e.g. 90" },
  { type: "number", name: "performanceCount", label: "Number of Performances", min: 1, max: 20, placeholder: "e.g. 1" },
  { type: "text", name: "genre", label: "Genre / Style", optional: true, placeholder: "e.g. Bollywood, EDM" },
];

const STEP3_FIELDS: FieldConfig[] = [
  { type: "radio-yes-no", name: "soundSystemRequired", label: "Sound System Required" },
  { type: "radio-yes-no", name: "lightingRequired", label: "Lighting Required" },
  { type: "radio-yes-no", name: "stageRequired", label: "Stage Required" },
  {
    type: "textarea",
    name: "equipmentRequirements",
    label: "Equipment Requirements",
    optional: true,
    placeholder: "List any specific equipment needs...",
    maxLength: 500,
  },
  {
    type: "currency-amount",
    name: "budgetMin",
    amountName: "budgetMin",
    currencyName: "budgetCurrency",
    label: "Budget Min",
    optional: true,
    currencies: CURRENCY_OPTIONS,
  },
  {
    type: "currency-amount",
    name: "budgetMax",
    amountName: "budgetMax",
    currencyName: "budgetCurrency",
    label: "Budget Max",
    optional: true,
    hint: "Must be ≥ budget min",
    currencies: CURRENCY_OPTIONS,
  },
  {
    type: "textarea",
    name: "specialInstructions",
    label: "Special Instructions",
    optional: true,
    placeholder: "Sound check times, arrival instructions, etc.",
    maxLength: 1000,
  },
];

interface PerformerStep2Props {
  formId: string;
  defaultValues: Partial<PerformerDetails>;
  onSubmit: (data: Partial<PerformerDetails>) => void;
}

export function PerformerStep2({ formId, defaultValues, onSubmit }: PerformerStep2Props) {
  return (
    <CategoryRequirementsStep
      formId={formId}
      schema={performerStep2Schema}
      defaultValues={{
        performanceType: defaultValues.performanceType,
        performerCount: defaultValues.performerCount,
        durationMinutes: defaultValues.durationMinutes,
        performanceCount: defaultValues.performanceCount,
        genre: defaultValues.genre ?? "",
      }}
      fields={STEP2_FIELDS}
      onSubmit={onSubmit}
    />
  );
}

interface PerformerStep3Props {
  formId: string;
  defaultValues: Partial<PerformerDetails>;
  onSubmit: (data: Partial<PerformerDetails>) => void;
}

export function PerformerStep3({ formId, defaultValues, onSubmit }: PerformerStep3Props) {
  return (
    <CategoryRequirementsStep
      formId={formId}
      schema={performerStep3Schema}
      defaultValues={{
        soundSystemRequired: defaultValues.soundSystemRequired ?? false,
        lightingRequired: defaultValues.lightingRequired ?? false,
        stageRequired: defaultValues.stageRequired ?? false,
        equipmentRequirements: defaultValues.equipmentRequirements ?? "",
        specialInstructions: defaultValues.specialInstructions ?? "",
        budgetMin: defaultValues.budgetMin,
        budgetMax: defaultValues.budgetMax,
        budgetCurrency: defaultValues.budgetCurrency ?? "INR",
      }}
      fields={STEP3_FIELDS}
      onSubmit={onSubmit}
    />
  );
}
