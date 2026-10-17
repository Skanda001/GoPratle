"use client";

import * as React from "react";
import { CheckCircle2, Lock } from "lucide-react";
import { STEP_TITLES } from "@/lib/constants";
import type { Category } from "@/types";

interface ProgressIndicatorProps {
  currentStep: 1 | 2 | 3 | 4;
  completedSteps: Set<number>;
  category: Category | undefined;
  onStepClick: (step: 1 | 2 | 3 | 4) => void;
}

const STEP_4_TITLE = "Review & Submit";

function getStepTitle(step: number, category: Category | undefined): string {
  if (step === 1) return "Event Basics";
  if (step === 4) return STEP_4_TITLE;
  if (!category) return `Step ${step}`;
  const titles = STEP_TITLES[category];
  if (!titles) return `Step ${step}`;
  return titles[step - 2] ?? `Step ${step}`;
}

export function ProgressIndicator({
  currentStep,
  completedSteps,
  category,
  onStepClick,
}: ProgressIndicatorProps) {
  const steps = [1, 2, 3, 4] as const;

  return (
    <nav aria-label="Wizard progress" className="w-full">
      {/* Mobile: "Step X of 4" */}
      <div className="sm:hidden text-center text-sm text-slate-500 mb-4">
        <span className="font-semibold text-slate-800">Step {currentStep}</span> of 4 —{" "}
        {getStepTitle(currentStep, category)}
      </div>

      {/* Desktop: full step indicator */}
      <ol className="hidden sm:flex items-center justify-between w-full">
        {steps.map((step, idx) => {
          const isCompleted = completedSteps.has(step);
          const isCurrent = currentStep === step;
          const isLocked =
            !isCompleted &&
            !isCurrent &&
            (step > currentStep ||
              (step >= 2 && step <= 3 && !category));

          const canClick = isCompleted || isCurrent;

          return (
            <React.Fragment key={step}>
              <li className="flex flex-col items-center gap-1 flex-1">
                <button
                  type="button"
                  onClick={() => canClick && onStepClick(step)}
                  disabled={!canClick}
                  aria-current={isCurrent ? "step" : undefined}
                  aria-label={`Step ${step}: ${getStepTitle(step, category)}${isCompleted ? " (completed)" : isCurrent ? " (current)" : " (locked)"}`}
                  className={[
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all border-2",
                    isCompleted
                      ? "bg-violet-600 border-violet-600 text-white"
                      : isCurrent
                        ? "bg-white border-violet-600 text-violet-600"
                        : "bg-white border-slate-200 text-slate-400",
                    canClick ? "cursor-pointer hover:scale-105" : "cursor-not-allowed",
                  ].join(" ")}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : isLocked ? (
                    <Lock className="w-3 h-3" />
                  ) : (
                    step
                  )}
                </button>
                <span
                  className={[
                    "text-xs font-medium text-center leading-tight max-w-[80px]",
                    isCurrent ? "text-violet-700" : isCompleted ? "text-slate-600" : "text-slate-400",
                  ].join(" ")}
                >
                  {getStepTitle(step, category)}
                </span>
              </li>

              {/* Connector line */}
              {idx < steps.length - 1 && (
                <div
                  className={[
                    "h-0.5 flex-1 mx-1 mb-4 transition-colors",
                    completedSteps.has(step) ? "bg-violet-400" : "bg-slate-200",
                  ].join(" ")}
                  aria-hidden="true"
                />
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
