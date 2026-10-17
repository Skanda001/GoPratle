"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, MapPin, CalendarRange } from "lucide-react";
import { basicsSchema, type BasicsFormData } from "@/lib/validation";
import { EVENT_TYPE_LABELS } from "@/lib/constants";
import { getTodayString } from "@/lib/utils";
import { TextField, SelectField } from "@/components/ui/Fields";
import type { BasicsFormData as BasicsData } from "@/types";

interface CategoryCardData {
  value: "planner" | "performer" | "crew";
  icon: React.ReactNode;
  title: string;
  description: string;
}

const CATEGORY_CARDS: CategoryCardData[] = [
  {
    value: "planner",
    icon: <Calendar className="w-6 h-6" aria-hidden="true" />,
    title: "Event Planner",
    description: "Planning, coordination, and event management",
  },
  {
    value: "performer",
    icon: <CalendarRange className="w-6 h-6" aria-hidden="true" />,
    title: "Performer",
    description: "Singers, DJs, bands, dancers, and entertainers",
  },
  {
    value: "crew",
    icon: <MapPin className="w-6 h-6" aria-hidden="true" />,
    title: "Crew",
    description: "Technical staff, stagehands, photographers, and event support personnel",
  },
];

const EVENT_TYPE_OPTIONS = Object.entries(EVENT_TYPE_LABELS).map(([value, label]) => ({
  value,
  label,
}));

interface Step1Props {
  defaultValues: Partial<BasicsData>;
  onSubmit: (data: BasicsFormData) => void;
  formId: string;
}

export function Step1EventBasics({ defaultValues, onSubmit, formId }: Step1Props) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BasicsFormData>({
    resolver: zodResolver(basicsSchema),
    defaultValues: {
      eventName: defaultValues.eventName ?? "",
      eventType: defaultValues.eventType,
      dateMode: defaultValues.dateMode ?? "single",
      startDate: defaultValues.startDate ?? "",
      endDate: defaultValues.endDate ?? "",
      location: defaultValues.location ?? "",
      venue: defaultValues.venue ?? "",
      category: defaultValues.category,
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const dateMode = watch("dateMode");
  const today = getTodayString();

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-5">
        {/* Event Name */}
        <TextField
          id="eventName"
          label="Event Name"
          placeholder="e.g. Annual Company Gala"
          error={errors.eventName}
          registration={register("eventName")}
        />

        {/* Event Type */}
        <SelectField
          id="eventType"
          label="Event Type"
          placeholder="Select event type"
          options={EVENT_TYPE_OPTIONS}
          error={errors.eventType}
          registration={register("eventType")}
        />

        {/* Date Mode */}
        <div>
          <p className="block text-sm font-medium text-slate-700 mb-2">Event Date</p>
          <div role="radiogroup" aria-label="Date mode" className="flex gap-4 mb-3">
            {(["single", "range"] as const).map((mode) => (
              <label key={mode} className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                <input
                  type="radio"
                  value={mode}
                  className="accent-violet-600 w-4 h-4"
                  {...register("dateMode")}
                />
                {mode === "single" ? "Single day" : "Date range"}
              </label>
            ))}
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label htmlFor="startDate" className="block text-xs text-slate-500 mb-1">
                {dateMode === "range" ? "Start date" : "Date"}
              </label>
              <input
                id="startDate"
                type="date"
                min={today}
                className={[
                  "w-full rounded-lg border px-3 py-2.5 text-sm text-slate-900 bg-white",
                  "outline-none transition-shadow focus:ring-2 focus:ring-violet-500 focus:border-violet-500",
                  errors.startDate
                    ? "border-red-400"
                    : "border-slate-200 hover:border-slate-300",
                ].join(" ")}
                aria-describedby={errors.startDate ? "startDate-error" : undefined}
                {...register("startDate")}
              />
              {errors.startDate && (
                <p id="startDate-error" role="alert" aria-live="polite" className="mt-1 text-xs text-red-600">
                  {errors.startDate.message}
                </p>
              )}
            </div>

            {dateMode === "range" && (
              <div className="flex-1">
                <label htmlFor="endDate" className="block text-xs text-slate-500 mb-1">
                  End date
                </label>
                <input
                  id="endDate"
                  type="date"
                  min={today}
                  className={[
                    "w-full rounded-lg border px-3 py-2.5 text-sm text-slate-900 bg-white",
                    "outline-none transition-shadow focus:ring-2 focus:ring-violet-500 focus:border-violet-500",
                    errors.endDate
                      ? "border-red-400"
                      : "border-slate-200 hover:border-slate-300",
                  ].join(" ")}
                  aria-describedby={errors.endDate ? "endDate-error" : undefined}
                  {...register("endDate")}
                />
                {errors.endDate && (
                  <p id="endDate-error" role="alert" aria-live="polite" className="mt-1 text-xs text-red-600">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Location */}
        <TextField
          id="location"
          label="Location"
          placeholder="e.g. Mumbai, Maharashtra"
          error={errors.location}
          registration={register("location")}
        />

        {/* Venue */}
        <TextField
          id="venue"
          label="Venue"
          optional
          placeholder="e.g. Taj Mahal Palace"
          error={errors.venue}
          registration={register("venue")}
        />

        {/* Category Selector */}
        <div>
          <p className="block text-sm font-medium text-slate-700 mb-2">
            Who do you need?
          </p>
          {errors.category && (
            <p role="alert" aria-live="polite" className="mb-2 text-xs text-red-600">
              {errors.category.message}
            </p>
          )}
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <div role="radiogroup" aria-label="Category" className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {CATEGORY_CARDS.map((card) => {
                  const selected = field.value === card.value;
                  return (
                    <label
                      key={card.value}
                      className={[
                        "flex flex-col gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all",
                        selected
                          ? "border-violet-500 bg-violet-50"
                          : "border-slate-200 bg-white hover:border-slate-300",
                      ].join(" ")}
                    >
                      <input
                        type="radio"
                        className="sr-only"
                        value={card.value}
                        checked={selected}
                        onChange={() => field.onChange(card.value)}
                        aria-label={`${card.title}: ${card.description}`}
                      />
                      <span
                        className={selected ? "text-violet-600" : "text-slate-400"}
                        aria-hidden="true"
                      >
                        {card.icon}
                      </span>
                      <span className={`text-sm font-semibold ${selected ? "text-violet-700" : "text-slate-700"}`}>
                        {card.title}
                      </span>
                      <span className="text-xs text-slate-500 leading-snug">{card.description}</span>
                    </label>
                  );
                })}
              </div>
            )}
          />
        </div>
      </div>
    </form>
  );
}
