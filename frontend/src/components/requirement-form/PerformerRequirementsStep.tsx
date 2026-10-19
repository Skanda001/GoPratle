"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReceiptText } from "lucide-react";
import { CategoryRequirementsStep, type FieldConfig } from "./CategoryRequirementsStep";
import { performerStep2Schema, performerStep3Schema } from "@/lib/validation";
import { PERFORMANCE_TYPE_LABELS } from "@/lib/constants";
import { NumberField, SelectField, TextField } from "@/components/ui/Fields";
import type { PerformerDetails } from "@/types";

// ---------------------------------------------------------------------------
// Options
// ---------------------------------------------------------------------------

const PERF_TYPE_OPTIONS = Object.entries(PERFORMANCE_TYPE_LABELS).map(([v, l]) => ({ value: v, label: l }));

// ---------------------------------------------------------------------------
// Step 3 fields
// ---------------------------------------------------------------------------

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
    type: "number",
    name: "budgetMin",
    label: "Minimum Budget (₹ INR)",
    optional: true,
    min: 0,
    placeholder: "e.g. 25000",
    hint: "Typical range: ₹5K–₹50K for solo, ₹25K–₹2L for bands/DJs",
  },
  {
    type: "number",
    name: "budgetMax",
    label: "Maximum Budget (₹ INR)",
    optional: true,
    min: 0,
    placeholder: "e.g. 80000",
    hint: "Must be ≥ minimum budget",
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

// ---------------------------------------------------------------------------
// PerformerStep2
// ---------------------------------------------------------------------------

interface PerformerStep2Props {
  formId: string;
  defaultValues: Partial<PerformerDetails>;
  onSubmit: (data: Partial<PerformerDetails>) => void;
}

export function PerformerStep2({ formId, defaultValues, onSubmit }: PerformerStep2Props) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(performerStep2Schema),
    defaultValues: {
      performanceType: defaultValues.performanceType,
      performerCount: defaultValues.performerCount,
      durationMinutes: defaultValues.durationMinutes,
      performanceCount: defaultValues.performanceCount,
      genre: defaultValues.genre ?? "",
    },
  });

  const performanceType = watch("performanceType");

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-5">
        {/* Performance Type */}
        <SelectField
          id="performanceType"
          label="Performance Type"
          options={PERF_TYPE_OPTIONS}
          placeholder="Select type"
          error={errors.performanceType}
          registration={register("performanceType")}
        />

        {/* Performer Count */}
        <Controller
          name="performerCount"
          control={control}
          render={({ field: f }) => (
            <NumberField
              id="performerCount"
              label="Number of Performers"
              min={1}
              max={50}
              placeholder="e.g. 1"
              error={errors.performerCount}
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

        {/* Duration */}
        <Controller
          name="durationMinutes"
          control={control}
          render={({ field: f }) => (
            <NumberField
              id="durationMinutes"
              label="Performance Duration (minutes)"
              min={5}
              max={720}
              placeholder="e.g. 90"
              error={errors.durationMinutes}
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

        {/* Performance Count */}
        <Controller
          name="performanceCount"
          control={control}
          render={({ field: f }) => (
            <NumberField
              id="performanceCount"
              label="Number of Performances"
              min={1}
              max={20}
              placeholder="e.g. 1"
              error={errors.performanceCount}
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

        {/* Genre */}
        <TextField
          id="genre"
          label="Genre / Style"
          optional
          placeholder="e.g. Bollywood, EDM"
          error={errors.genre}
          registration={register("genre")}
        />

        {/* Estimate breakup delivery note */}
        {performanceType && (
          <div className="flex items-center gap-2 p-3 bg-violet-50/70 border border-violet-100 rounded-xl text-xs text-violet-800">
            <ReceiptText className="w-4 h-4 text-violet-600 flex-shrink-0" />
            <span>
              Performer rate card and estimated total breakup will be generated in your Estimate Breakups dashboard upon submission.
            </span>
          </div>
        )}
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------
// PerformerStep3 — unchanged, uses generic renderer
// ---------------------------------------------------------------------------

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
        budgetCurrency: "INR",
      }}
      fields={STEP3_FIELDS}
      onSubmit={onSubmit}
    />
  );
}
