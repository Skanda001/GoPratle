"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReceiptText } from "lucide-react";
import { CategoryRequirementsStep, type FieldConfig } from "./CategoryRequirementsStep";
import { crewStep2Schema, crewStep3Schema } from "@/lib/validation";
import { CREW_ROLE_LABELS, EXPERIENCE_LEVEL_LABELS } from "@/lib/constants";
import { NumberField, ChipMultiSelect } from "@/components/ui/Fields";
import type { CrewDetails } from "@/types";

// ---------------------------------------------------------------------------
// Options
// ---------------------------------------------------------------------------

const ROLE_OPTIONS = Object.entries(CREW_ROLE_LABELS).map(([v, l]) => ({ value: v, label: l }));
const EXP_OPTIONS = Object.entries(EXPERIENCE_LEVEL_LABELS).map(([v, l]) => ({ value: v, label: l }));

// ---------------------------------------------------------------------------
// Step 3 fields
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// CrewStep2
// ---------------------------------------------------------------------------

interface CrewStep2Props {
  formId: string;
  defaultValues: Partial<CrewDetails>;
  onSubmit: (data: Partial<CrewDetails>) => void;
}

export function CrewStep2({ formId, defaultValues, onSubmit }: CrewStep2Props) {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(crewStep2Schema),
    defaultValues: {
      roles: defaultValues.roles ?? [],
      crewCount: defaultValues.crewCount,
      shiftHours: defaultValues.shiftHours,
      shiftCount: defaultValues.shiftCount,
    },
  });

  const selectedRoles = watch("roles") ?? [];

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-5">
        {/* Roles Required */}
        <Controller
          name="roles"
          control={control}
          defaultValue={[]}
          render={({ field: f }) => (
            <ChipMultiSelect
              id="roles"
              label="Roles Required"
              hint="Select all that apply"
              error={errors.roles as import("react-hook-form").FieldError | undefined}
              options={ROLE_OPTIONS}
              value={Array.isArray(f.value) ? f.value : []}
              onChange={f.onChange}
            />
          )}
        />

        {/* Crew Count */}
        <Controller
          name="crewCount"
          control={control}
          render={({ field: f }) => (
            <NumberField
              id="crewCount"
              label="Total Crew Count"
              min={1}
              max={500}
              placeholder="e.g. 10"
              error={errors.crewCount}
              registration={{
                ...f,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  const v = e.target.value;
                  f.onChange(v === "" ? undefined : Number(v));
                },
                value: f.value === undefined ? "" : String(f.value),
              }}
            />
          )}
        />

        {/* Shift Hours */}
        <Controller
          name="shiftHours"
          control={control}
          render={({ field: f }) => (
            <NumberField
              id="shiftHours"
              label="Hours per Shift"
              min={0.5}
              max={24}
              step={0.5}
              placeholder="e.g. 8"
              error={errors.shiftHours}
              registration={{
                ...f,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  const v = e.target.value;
                  f.onChange(v === "" ? undefined : Number(v));
                },
                value: f.value === undefined ? "" : String(f.value),
              }}
            />
          )}
        />

        {/* Shift Count */}
        <Controller
          name="shiftCount"
          control={control}
          render={({ field: f }) => (
            <NumberField
              id="shiftCount"
              label="Number of Shifts"
              min={1}
              max={90}
              placeholder="e.g. 2"
              error={errors.shiftCount}
              registration={{
                ...f,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  const v = e.target.value;
                  f.onChange(v === "" ? undefined : Number(v));
                },
                value: f.value === undefined ? "" : String(f.value),
              }}
            />
          )}
        />

        {/* Estimate breakup delivery note */}
        {selectedRoles.length > 0 && (
          <div className="flex items-center gap-2 p-3 bg-violet-50/70 border border-violet-100 rounded-xl text-xs text-violet-800">
            <ReceiptText className="w-4 h-4 text-violet-600 flex-shrink-0" />
            <span>
              Crew shift rate calculation and total staffing estimate breakup will be generated in your Estimate Breakups dashboard upon submission.
            </span>
          </div>
        )}
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------
// CrewStep3 — unchanged, uses generic renderer
// ---------------------------------------------------------------------------

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
