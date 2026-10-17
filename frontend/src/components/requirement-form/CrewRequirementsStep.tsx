"use client";

import { CategoryRequirementsStep, type FieldConfig } from "./CategoryRequirementsStep";
import { crewStep2Schema, crewStep3Schema } from "@/lib/validation";
import { CREW_ROLE_LABELS, EXPERIENCE_LEVEL_LABELS } from "@/lib/constants";
import type { CrewDetails } from "@/types";

const ROLE_OPTIONS = Object.entries(CREW_ROLE_LABELS).map(([v, l]) => ({ value: v, label: l }));
const EXP_OPTIONS = Object.entries(EXPERIENCE_LEVEL_LABELS).map(([v, l]) => ({ value: v, label: l }));

const STEP2_FIELDS: FieldConfig[] = [
  {
    type: "chip-multi",
    name: "roles",
    label: "Roles Required",
    options: ROLE_OPTIONS,
    hint: "Select all that apply",
  },
  { type: "number", name: "crewCount", label: "Total Crew Count", min: 1, max: 500, placeholder: "e.g. 10" },
  { type: "number", name: "shiftHours", label: "Hours per Shift", min: 0.5, max: 24, step: 0.5, placeholder: "e.g. 8" },
  { type: "number", name: "shiftCount", label: "Number of Shifts", min: 1, max: 90, placeholder: "e.g. 2" },
];

const STEP3_FIELDS: FieldConfig[] = [
  {
    type: "select",
    name: "experienceLevel",
    label: "Experience Level",
    options: EXP_OPTIONS,
    placeholder: "Select level",
  },
  {
    type: "textarea",
    name: "equipmentRequired",
    label: "Equipment Required",
    optional: true,
    placeholder: "List any equipment crew should bring or expect...",
    maxLength: 500,
  },
  {
    type: "text",
    name: "dressCode",
    label: "Dress Code",
    optional: true,
    placeholder: "e.g. Black crew t-shirt and cargo pants",
  },
  {
    type: "textarea",
    name: "reportingInstructions",
    label: "Reporting Instructions",
    optional: true,
    placeholder: "Where and when to report, contact person...",
    maxLength: 500,
  },
  {
    type: "textarea",
    name: "specialRequests",
    label: "Special Requests",
    optional: true,
    placeholder: "Any additional notes...",
    maxLength: 1000,
  },
];

interface CrewStep2Props {
  formId: string;
  defaultValues: Partial<CrewDetails>;
  onSubmit: (data: Partial<CrewDetails>) => void;
}

export function CrewStep2({ formId, defaultValues, onSubmit }: CrewStep2Props) {
  return (
    <CategoryRequirementsStep
      formId={formId}
      schema={crewStep2Schema}
      defaultValues={{
        roles: defaultValues.roles ?? [],
        crewCount: defaultValues.crewCount,
        shiftHours: defaultValues.shiftHours,
        shiftCount: defaultValues.shiftCount,
      }}
      fields={STEP2_FIELDS}
      onSubmit={onSubmit}
    />
  );
}

interface CrewStep3Props {
  formId: string;
  defaultValues: Partial<CrewDetails>;
  onSubmit: (data: Partial<CrewDetails>) => void;
}

export function CrewStep3({ formId, defaultValues, onSubmit }: CrewStep3Props) {
  return (
    <CategoryRequirementsStep
      formId={formId}
      schema={crewStep3Schema}
      defaultValues={{
        experienceLevel: defaultValues.experienceLevel,
        equipmentRequired: defaultValues.equipmentRequired ?? "",
        dressCode: defaultValues.dressCode ?? "",
        reportingInstructions: defaultValues.reportingInstructions ?? "",
        specialRequests: defaultValues.specialRequests ?? "",
      }}
      fields={STEP3_FIELDS}
      onSubmit={onSubmit}
    />
  );
}
