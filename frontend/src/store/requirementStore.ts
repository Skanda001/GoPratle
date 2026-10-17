"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { generateUUID } from "@/lib/utils";
import type {
  BasicsFormData,
  PlannerDetails,
  PerformerDetails,
  CrewDetails,
  Category,
} from "@/types";

// ---------------------------------------------------------------------------
// Store shape
// ---------------------------------------------------------------------------

interface RequirementState {
  currentStep: 1 | 2 | 3 | 4;
  // Store completedSteps as a plain number[] for JSON-serialisability;
  // expose a computed Set via selector for convenience.
  completedStepsArr: number[];

  basics: Partial<BasicsFormData>;
  plannerDetails: Partial<PlannerDetails>;
  performerDetails: Partial<PerformerDetails>;
  crewDetails: Partial<CrewDetails>;

  idempotencyKey: string;
  submittedId: string | null;
  hasDraft: boolean;
}

interface RequirementActions {
  setBasics: (data: Partial<BasicsFormData>) => void;
  setPlannerDetails: (data: Partial<PlannerDetails>) => void;
  setPerformerDetails: (data: Partial<PerformerDetails>) => void;
  setCrewDetails: (data: Partial<CrewDetails>) => void;
  advanceStep: () => void;
  goToStep: (step: 1 | 2 | 3 | 4) => void;
  markStepComplete: (step: number) => void;
  setSubmittedId: (id: string) => void;
  reset: () => void;
  clearDraft: () => void;
}

export type RequirementStore = RequirementState & RequirementActions;

// ---------------------------------------------------------------------------
// Computed selector: completedStepsArr → Set<number>
// ---------------------------------------------------------------------------
export function getCompletedStepsSet(store: RequirementState): Set<number> {
  return new Set(store.completedStepsArr);
}

// ---------------------------------------------------------------------------
// Initial state
// ---------------------------------------------------------------------------

function initialState(): RequirementState {
  return {
    currentStep: 1,
    completedStepsArr: [],
    basics: {},
    plannerDetails: {},
    performerDetails: {},
    crewDetails: {},
    idempotencyKey: generateUUID(),
    submittedId: null,
    hasDraft: false,
  };
}

// ---------------------------------------------------------------------------
// Store
// Design decision: category slices are independent. Switching category never
// deletes the other slices. On submit, only the active category's slice is
// included in the payload. This lets users freely explore without data loss.
// ---------------------------------------------------------------------------

export const useRequirementStore = create<RequirementStore>()(
  persist(
    (set, get) => ({
      ...initialState(),

      setBasics: (data) =>
        set((state) => ({
          basics: { ...state.basics, ...data },
          hasDraft: true,
        })),

      setPlannerDetails: (data) =>
        set((state) => ({ plannerDetails: { ...state.plannerDetails, ...data } })),

      setPerformerDetails: (data) =>
        set((state) => ({ performerDetails: { ...state.performerDetails, ...data } })),

      setCrewDetails: (data) =>
        set((state) => ({ crewDetails: { ...state.crewDetails, ...data } })),

      advanceStep: () => {
        const current = get().currentStep;
        const next = Math.min(current + 1, 4) as 1 | 2 | 3 | 4;
        set((state) => ({
          currentStep: next,
          completedStepsArr: state.completedStepsArr.includes(current)
            ? state.completedStepsArr
            : [...state.completedStepsArr, current],
        }));
      },

      goToStep: (step) => set({ currentStep: step }),

      markStepComplete: (step) =>
        set((state) => ({
          completedStepsArr: state.completedStepsArr.includes(step)
            ? state.completedStepsArr
            : [...state.completedStepsArr, step],
        })),

      setSubmittedId: (id) => set({ submittedId: id }),

      reset: () =>
        set({
          ...initialState(),
          idempotencyKey: generateUUID(),
        }),

      clearDraft: () => set({ hasDraft: false }),
    }),
    {
      name: "gopratle-requirement-v1",
      storage: createJSONStorage(() => {
        // SSR-safe: return a no-op storage during server-side rendering
        if (typeof window === "undefined") {
          return {
            getItem: () => null,
            setItem: () => undefined,
            removeItem: () => undefined,
          };
        }
        return localStorage;
      }),
    }
  )
);

// ---------------------------------------------------------------------------
// Selector helpers (used by the wizard)
// ---------------------------------------------------------------------------

export function getActiveCategory(store: RequirementState): Category | undefined {
  return store.basics.category;
}

export function getActiveDetails(
  store: RequirementState
): Partial<PlannerDetails | PerformerDetails | CrewDetails> {
  const cat = store.basics.category;
  if (cat === "planner") return store.plannerDetails;
  if (cat === "performer") return store.performerDetails;
  if (cat === "crew") return store.crewDetails;
  return {};
}
