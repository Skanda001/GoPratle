"use client";

import * as React from "react";
import { Edit2 } from "lucide-react";
import {
  EVENT_TYPE_LABELS,
  CATEGORY_LABELS,
  DATE_MODE_LABELS,
  SERVICES_REQUIRED_LABELS,
  PLANNING_SCOPE_LABELS,
  EXPERIENCE_LEVEL_LABELS,
  PERFORMANCE_TYPE_LABELS,
  CREW_ROLE_LABELS,
} from "@/lib/constants";
import { formatDateRange, formatMoney } from "@/lib/utils";
import type {
  BasicsFormData,
  PlannerDetails,
  PerformerDetails,
  CrewDetails,
  Category,
} from "@/types";

// ---------------------------------------------------------------------------
// Section wrapper
// ---------------------------------------------------------------------------

function ReviewSection({
  title,
  onEdit,
  step,
  children,
}: {
  title: string;
  onEdit: (step: 1 | 2 | 3 | 4) => void;
  step: 1 | 2 | 3;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-slate-100 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between bg-slate-50 px-4 py-3 border-b border-slate-100">
        <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
        <button
          type="button"
          onClick={() => onEdit(step)}
          className="flex items-center gap-1 text-xs text-violet-600 hover:text-violet-800 font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded"
          aria-label={`Edit ${title}`}
        >
          <Edit2 className="w-3 h-3" />
          Edit
        </button>
      </div>
      <dl className="px-4 py-3 space-y-2">{children}</dl>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: React.ReactNode }) {
  if (!value && value !== 0 && value !== false) return null;
  return (
    <div className="flex gap-4 text-sm">
      <dt className="text-slate-500 w-40 flex-shrink-0">{label}</dt>
      <dd className="text-slate-800 font-medium">{value}</dd>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Planner review
// ---------------------------------------------------------------------------

function PlannerReview({ details, onEdit }: { details: Partial<PlannerDetails>; onEdit: (step: 1 | 2 | 3 | 4) => void }) {
  return (
    <>
      <ReviewSection title="Planning Details" onEdit={onEdit} step={2}>
        <ReviewRow label="Guest Count" value={details.guestCount?.toLocaleString("en-IN")} />
        <ReviewRow
          label="Budget"
          value={
            details.budget !== undefined
              ? formatMoney(details.budget, details.currency ?? "INR")
              : undefined
          }
        />
        <ReviewRow
          label="Services Required"
          value={
            details.servicesRequired?.length
              ? details.servicesRequired.map((s) => SERVICES_REQUIRED_LABELS[s] ?? s).join(", ")
              : undefined
          }
        />
        <ReviewRow label="Style / Theme" value={details.styleTheme} />
      </ReviewSection>

      <ReviewSection title="Additional Requirements" onEdit={onEdit} step={3}>
        <ReviewRow label="Planning Scope" value={details.planningScope ? PLANNING_SCOPE_LABELS[details.planningScope] : undefined} />
        <ReviewRow label="Coordination Days" value={details.coordinationDays} />
        <ReviewRow label="Experience Level" value={details.preferredExperience ? EXPERIENCE_LEVEL_LABELS[details.preferredExperience] : undefined} />
        <ReviewRow label="Special Requests" value={details.specialRequests} />
      </ReviewSection>
    </>
  );
}

// ---------------------------------------------------------------------------
// Performer review
// ---------------------------------------------------------------------------

function PerformerReview({ details, onEdit }: { details: Partial<PerformerDetails>; onEdit: (step: 1 | 2 | 3 | 4) => void }) {
  return (
    <>
      <ReviewSection title="Performance Details" onEdit={onEdit} step={2}>
        <ReviewRow label="Performance Type" value={details.performanceType ? PERFORMANCE_TYPE_LABELS[details.performanceType] : undefined} />
        <ReviewRow label="Performers" value={details.performerCount} />
        <ReviewRow label="Duration" value={details.durationMinutes ? `${details.durationMinutes} minutes` : undefined} />
        <ReviewRow label="Performances" value={details.performanceCount} />
        <ReviewRow label="Genre / Style" value={details.genre} />
      </ReviewSection>

      <ReviewSection title="Technical Requirements" onEdit={onEdit} step={3}>
        <ReviewRow label="Sound System" value={details.soundSystemRequired ? "Yes" : "No"} />
        <ReviewRow label="Lighting" value={details.lightingRequired ? "Yes" : "No"} />
        <ReviewRow label="Stage" value={details.stageRequired ? "Yes" : "No"} />
        <ReviewRow label="Equipment" value={details.equipmentRequirements} />
        <ReviewRow
          label="Budget Range"
          value={
            details.budgetMin !== undefined || details.budgetMax !== undefined
              ? [
                  details.budgetMin !== undefined ? formatMoney(details.budgetMin, details.budgetCurrency ?? "INR") : "–",
                  details.budgetMax !== undefined ? formatMoney(details.budgetMax, details.budgetCurrency ?? "INR") : "–",
                ].join(" – ")
              : undefined
          }
        />
        <ReviewRow label="Special Instructions" value={details.specialInstructions} />
      </ReviewSection>
    </>
  );
}

// ---------------------------------------------------------------------------
// Crew review
// ---------------------------------------------------------------------------

function CrewReview({ details, onEdit }: { details: Partial<CrewDetails>; onEdit: (step: 1 | 2 | 3 | 4) => void }) {
  return (
    <>
      <ReviewSection title="Staffing Requirements" onEdit={onEdit} step={2}>
        <ReviewRow
          label="Roles"
          value={details.roles?.length ? details.roles.map((r) => CREW_ROLE_LABELS[r] ?? r).join(", ") : undefined}
        />
        <ReviewRow label="Crew Count" value={details.crewCount} />
        <ReviewRow label="Shift Hours" value={details.shiftHours ? `${details.shiftHours}h` : undefined} />
        <ReviewRow label="Shifts" value={details.shiftCount} />
      </ReviewSection>

      <ReviewSection title="Work Details" onEdit={onEdit} step={3}>
        <ReviewRow label="Experience Level" value={details.experienceLevel ? EXPERIENCE_LEVEL_LABELS[details.experienceLevel] : undefined} />
        <ReviewRow label="Equipment Required" value={details.equipmentRequired} />
        <ReviewRow label="Dress Code" value={details.dressCode} />
        <ReviewRow label="Reporting Instructions" value={details.reportingInstructions} />
        <ReviewRow label="Special Requests" value={details.specialRequests} />
      </ReviewSection>
    </>
  );
}

// ---------------------------------------------------------------------------
// Main Step4Review
// ---------------------------------------------------------------------------

interface Step4ReviewProps {
  basics: Partial<BasicsFormData>;
  plannerDetails: Partial<PlannerDetails>;
  performerDetails: Partial<PerformerDetails>;
  crewDetails: Partial<CrewDetails>;
  onEdit: (step: 1 | 2 | 3 | 4) => void;
}

export function Step4Review({
  basics,
  plannerDetails,
  performerDetails,
  crewDetails,
  onEdit,
}: Step4ReviewProps) {
  const category = basics.category as Category | undefined;

  return (
    <div className="space-y-4">
      {/* Event Basics */}
      <ReviewSection title="Event Basics" onEdit={onEdit} step={1}>
        <ReviewRow label="Event Name" value={basics.eventName} />
        <ReviewRow label="Event Type" value={basics.eventType ? EVENT_TYPE_LABELS[basics.eventType] : undefined} />
        <ReviewRow
          label="Date"
          value={
            basics.startDate
              ? formatDateRange(basics.startDate, basics.dateMode === "range" ? basics.endDate : undefined)
              : undefined
          }
        />
        <ReviewRow label="Date Mode" value={basics.dateMode ? DATE_MODE_LABELS[basics.dateMode] : undefined} />
        <ReviewRow label="Location" value={basics.location} />
        <ReviewRow label="Venue" value={basics.venue} />
      </ReviewSection>

      {/* Category */}
      <div className="border border-slate-100 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between bg-slate-50 px-4 py-3">
          <h3 className="text-sm font-semibold text-slate-700">Category</h3>
          <button
            type="button"
            onClick={() => onEdit(1)}
            className="flex items-center gap-1 text-xs text-violet-600 hover:text-violet-800 font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded"
          >
            <Edit2 className="w-3 h-3" />
            Edit
          </button>
        </div>
        <div className="px-4 py-3">
          <p className="text-sm font-semibold text-violet-700">
            {category ? CATEGORY_LABELS[category] : "—"}
          </p>
        </div>
      </div>

      {/* Category-specific details */}
      {category === "planner" && (
        <PlannerReview details={plannerDetails} onEdit={onEdit} />
      )}
      {category === "performer" && (
        <PerformerReview details={performerDetails} onEdit={onEdit} />
      )}
      {category === "crew" && (
        <CrewReview details={crewDetails} onEdit={onEdit} />
      )}
    </div>
  );
}
