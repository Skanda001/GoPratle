"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReceiptText } from "lucide-react";
import { CategoryRequirementsStep, type FieldConfig } from "./CategoryRequirementsStep";
import { plannerStep2Schema, plannerStep3Schema } from "@/lib/validation";
import {
  SERVICES_REQUIRED_LABELS,
  PLANNING_SCOPE_LABELS,
  EXPERIENCE_LEVEL_LABELS,
} from "@/lib/constants";
import { NumberField, TextField, ChipMultiSelect } from "@/components/ui/Fields";
import type { PlannerDetails } from "@/types";

// ---------------------------------------------------------------------------
// Field configs per step
// ---------------------------------------------------------------------------

const SERVICES_OPTIONS = Object.entries(SERVICES_REQUIRED_LABELS).map(([v, l]) => ({ value: v, label: l }));
const SCOPE_OPTIONS = Object.entries(PLANNING_SCOPE_LABELS).map(([v, l]) => ({ value: v, label: l }));
const EXP_OPTIONS = Object.entries(EXPERIENCE_LEVEL_LABELS).map(([v, l]) => ({ value: v, label: l }));

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
// PlannerStep2
// ---------------------------------------------------------------------------

interface PlannerStep2Props {
  formId: string;
  defaultValues: Partial<PlannerDetails>;
  onSubmit: (data: Partial<PlannerDetails>) => void;
}

export function PlannerStep2({ formId, defaultValues, onSubmit }: PlannerStep2Props) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(plannerStep2Schema),
    defaultValues: {
      guestCount: defaultValues.guestCount,
      budget: defaultValues.budget,
      currency: "INR" as const,
      servicesRequired: defaultValues.servicesRequired ?? [],
      styleTheme: defaultValues.styleTheme ?? "",
    },
  });

  const selectedServices = watch("servicesRequired") ?? [];

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-5">
        {/* Guest Count */}
        <Controller
          name="guestCount"
          control={control}
          render={({ field: f }) => (
            <NumberField
              id="guestCount"
              label="Expected Guests"
              min={1}
              max={100000}
              placeholder="e.g. 200"
              error={errors.guestCount}
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

        {/* Budget */}
        <Controller
          name="budget"
          control={control}
          render={({ field: f }) => (
            <NumberField
              id="budget"
              label="Total Budget (₹ INR)"
              optional
              min={0}
              placeholder="e.g. 500000"
              hint="Typical range: ₹50K–₹5L for partial, ₹2L–₹20L+ for full planning"
              error={errors.budget}
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

        {/* Services Required */}
        <Controller
          name="servicesRequired"
          control={control}
          defaultValue={[]}
          render={({ field: f }) => (
            <ChipMultiSelect
              id="servicesRequired"
              label="Services Required"
              hint="Select all that apply"
              error={errors.servicesRequired as import("react-hook-form").FieldError | undefined}
              options={SERVICES_OPTIONS}
              value={Array.isArray(f.value) ? f.value : []}
              onChange={f.onChange}
            />
          )}
        />

        {/* Estimate breakup delivery note */}
        {selectedServices.length > 0 && (
          <div className="flex items-center gap-2 p-3 bg-violet-50/70 border border-violet-100 rounded-xl text-xs text-violet-800">
            <ReceiptText className="w-4 h-4 text-violet-600 flex-shrink-0" />
            <span>
              Detailed price estimate & service breakup will be generated in your Estimate Breakups dashboard upon placing the requirement.
            </span>
          </div>
        )}

        {/* Style / Theme */}
        <TextField
          id="styleTheme"
          label="Style / Theme"
          optional
          placeholder="e.g. Black Tie Elegance"
          error={errors.styleTheme}
          registration={register("styleTheme")}
        />
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------
// PlannerStep3 — unchanged, uses generic renderer
// ---------------------------------------------------------------------------

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
