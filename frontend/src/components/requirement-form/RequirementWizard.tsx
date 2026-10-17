"use client";

import * as React from "react";
import { AlertCircle, RefreshCw, X, Loader2, Wifi } from "lucide-react";
import { useRequirementStore, getCompletedStepsSet } from "@/store/requirementStore";
import { ProgressIndicator } from "@/components/layout/ProgressIndicator";
import { Step1EventBasics } from "./Step1EventBasics";
import { PlannerStep2, PlannerStep3 } from "./PlannerRequirementsStep";
import { PerformerStep2, PerformerStep3 } from "./PerformerRequirementsStep";
import { CrewStep2, CrewStep3 } from "./CrewRequirementsStep";
import { Step4Review } from "./Step4Review";
import { SuccessScreen } from "./SuccessScreen";
import { submitRequirement } from "@/lib/api";
import { fieldToStep } from "@/lib/utils";
import { STEP_TITLES } from "@/lib/constants";
import type { BasicsFormData, Category } from "@/types";

// ---------------------------------------------------------------------------
// Step Navigation Bar (sticky on mobile)
// ---------------------------------------------------------------------------

interface NavBarProps {
  step: number;
  isStep4: boolean;
  isSubmitting: boolean;
  onBack: () => void;
  formId: string;
}

function StepNavBar({ step, isStep4, isSubmitting, onBack, formId }: NavBarProps) {
  return (
    <div className="sticky bottom-0 bg-white border-t border-slate-100 px-4 py-3 flex gap-3 sm:static sm:border-t-0 sm:pt-4 sm:px-0">
      {step > 1 && (
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 min-h-[44px]"
        >
          Back
        </button>
      )}
      <button
        type="submit"
        form={formId}
        disabled={isSubmitting}
        className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 min-h-[44px]"
      >
        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
        {isStep4 ? (isSubmitting ? "Submitting…" : "Submit Requirement") : "Continue"}
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main wizard
// ---------------------------------------------------------------------------

export function RequirementWizard() {
  const store = useRequirementStore();
  const [hasMounted, setHasMounted] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [slowRequest, setSlowRequest] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const headingRef = React.useRef<HTMLHeadingElement>(null);

  // SSR hydration safety: don't read localStorage until mounted
  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  // Scroll to top and focus heading on step change
  React.useEffect(() => {
    if (hasMounted) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      headingRef.current?.focus();
    }
  }, [store.currentStep, hasMounted]);

  const category = store.basics.category as Category | undefined;
  const step = store.currentStep;
  const formId = `wizard-step-${step}`;
  const isStep4 = step === 4;

  // ---------------------------------------------------------------------------
  // Step title
  // ---------------------------------------------------------------------------
  function getHeading(): string {
    if (step === 1) return "Event Basics";
    if (step === 4) return "Review & Submit";
    if (!category) return `Step ${step}`;
    const titles = STEP_TITLES[category];
    return titles?.[step - 2] ?? `Step ${step}`;
  }

  // ---------------------------------------------------------------------------
  // Step submit handlers
  // ---------------------------------------------------------------------------
  function handleStep1Submit(data: BasicsFormData) {
    // Normalize: strip endDate for single-mode
    const normalized = {
      ...data,
      endDate: data.dateMode === "range" ? data.endDate : undefined,
    };
    store.setBasics(normalized);
    store.advanceStep();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleStep2Submit(data: any) {
    if (category === "planner") store.setPlannerDetails(data);
    else if (category === "performer") store.setPerformerDetails(data);
    else if (category === "crew") store.setCrewDetails(data);
    store.advanceStep();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleStep3Submit(data: any) {
    if (category === "planner") store.setPlannerDetails(data);
    else if (category === "performer") store.setPerformerDetails(data);
    else if (category === "crew") store.setCrewDetails(data);
    store.advanceStep();
  }

  // ---------------------------------------------------------------------------
  // Final submit
  // ---------------------------------------------------------------------------
  async function handleFinalSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);
    setSlowRequest(false);

    // Build payload — only the active category's details are included
    const basics = store.basics;
    let details: Record<string, unknown> = {};

    if (category === "planner") details = store.plannerDetails as Record<string, unknown>;
    else if (category === "performer") details = store.performerDetails as Record<string, unknown>;
    else if (category === "crew") details = store.crewDetails as Record<string, unknown>;

    const payload: Record<string, unknown> = {
      eventName: basics.eventName,
      eventType: basics.eventType,
      dateMode: basics.dateMode,
      startDate: basics.startDate,
      ...(basics.dateMode === "range" && basics.endDate ? { endDate: basics.endDate } : {}),
      location: basics.location,
      ...(basics.venue ? { venue: basics.venue } : {}),
      category,
      details,
    };

    const result = await submitRequirement(payload, {
      idempotencyKey: store.idempotencyKey,
      onSlowRequest: () => setSlowRequest(true),
    });

    setIsSubmitting(false);
    setSlowRequest(false);

    if (result.ok && result.data) {
      store.setSubmittedId(result.data._id);
      store.clearDraft();
      setShowSuccess(true);
      return;
    }

    // Map field errors back to the right step
    if (result.fieldErrors.length > 0 && category) {
      const firstField = result.fieldErrors[0];
      if (firstField) {
        const errorStep = fieldToStep(firstField.field, category) as 1 | 2 | 3 | 4;
        if (errorStep < 4) {
          store.goToStep(errorStep);
        }
      }
    }

    setSubmitError(result.error ?? "Submission failed. Please try again.");
  }

  // ---------------------------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------------------------
  function handleBack() {
    store.goToStep((step - 1) as 1 | 2 | 3 | 4);
  }

  function handleEditStep(s: 1 | 2 | 3 | 4) {
    store.goToStep(s);
  }

  function handleReset() {
    store.reset();
    setShowSuccess(false);
    setSubmitError(null);
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  if (!hasMounted) {
    // Avoid hydration mismatch — render a skeleton until localStorage is read
    return (
      <div className="animate-pulse space-y-4 p-6">
        <div className="h-6 bg-slate-100 rounded w-1/3" />
        <div className="h-4 bg-slate-100 rounded w-full" />
        <div className="h-4 bg-slate-100 rounded w-5/6" />
      </div>
    );
  }

  if (showSuccess && store.submittedId && store.basics.category && store.basics.eventName) {
    return (
      <SuccessScreen
        recordId={store.submittedId}
        category={store.basics.category as Category}
        eventName={store.basics.eventName}
        eventType={store.basics.eventType!}
        startDate={store.basics.startDate!}
        endDate={store.basics.endDate}
        dateMode={store.basics.dateMode!}
        onCreateAnother={handleReset}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <ProgressIndicator
        currentStep={step}
        completedSteps={getCompletedStepsSet(store)}
        category={category}
        onStepClick={(s) => getCompletedStepsSet(store).has(s) && store.goToStep(s)}
      />

      {/* Draft restored banner */}
      {store.hasDraft && step === 1 && (
        <div className="flex items-center justify-between gap-3 bg-violet-50 border border-violet-100 rounded-xl px-4 py-2.5 text-sm text-violet-700">
          <span>Draft restored from a previous session.</span>
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 font-medium text-violet-800 hover:underline focus:outline-none"
          >
            <X className="w-3.5 h-3.5" />
            Start over
          </button>
        </div>
      )}

      {/* Slow-request banner */}
      {slowRequest && (
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-xl px-4 py-2.5 text-sm text-amber-700">
          <Wifi className="w-4 h-4 flex-shrink-0" />
          Waking up the server — this can take up to a minute on the free tier. Hang tight!
        </div>
      )}

      {/* Submit error banner */}
      {submitError && (
        <div className="flex items-start justify-between gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-700">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{submitError}</span>
          </div>
          <button
            type="button"
            onClick={() => setSubmitError(null)}
            className="text-red-400 hover:text-red-600"
            aria-label="Dismiss error"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Step heading */}
      <div>
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="text-xl font-bold text-slate-900 outline-none"
        >
          {getHeading()}
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Step {step} of 4
        </p>
      </div>

      {/* Step content */}
      {step === 1 && (
        <Step1EventBasics
          formId={formId}
          defaultValues={store.basics}
          onSubmit={handleStep1Submit}
        />
      )}

      {step === 2 && category === "planner" && (
        <PlannerStep2
          formId={formId}
          defaultValues={store.plannerDetails}
          onSubmit={handleStep2Submit}
        />
      )}
      {step === 2 && category === "performer" && (
        <PerformerStep2
          formId={formId}
          defaultValues={store.performerDetails}
          onSubmit={handleStep2Submit}
        />
      )}
      {step === 2 && category === "crew" && (
        <CrewStep2
          formId={formId}
          defaultValues={store.crewDetails}
          onSubmit={handleStep2Submit}
        />
      )}

      {step === 3 && category === "planner" && (
        <PlannerStep3
          formId={formId}
          defaultValues={store.plannerDetails}
          onSubmit={handleStep3Submit}
        />
      )}
      {step === 3 && category === "performer" && (
        <PerformerStep3
          formId={formId}
          defaultValues={store.performerDetails}
          onSubmit={handleStep3Submit}
        />
      )}
      {step === 3 && category === "crew" && (
        <CrewStep3
          formId={formId}
          defaultValues={store.crewDetails}
          onSubmit={handleStep3Submit}
        />
      )}

      {step === 4 && (
        <form id={formId} onSubmit={handleFinalSubmit}>
          <Step4Review
            basics={store.basics}
            plannerDetails={store.plannerDetails}
            performerDetails={store.performerDetails}
            crewDetails={store.crewDetails}
            onEdit={handleEditStep}
          />
        </form>
      )}

      {/* Retry banner for submission failures */}
      {submitError && step === 4 && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => {
              setSubmitError(null);
            }}
            className="flex items-center gap-2 text-sm text-violet-600 hover:text-violet-800 font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      )}

      {/* Navigation bar */}
      <StepNavBar
        step={step}
        isStep4={isStep4}
        isSubmitting={isSubmitting}
        onBack={handleBack}
        formId={formId}
      />
    </div>
  );
}
