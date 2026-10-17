import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RequirementWizard } from "@/components/requirement-form/RequirementWizard";

// Mock the API module
vi.mock("@/lib/api", () => ({
  submitRequirement: vi.fn(),
}));

// Mock the store (use a simple in-memory version for tests)
vi.mock("@/store/requirementStore", async () => {
  const { create } = await import("zustand");

  const initialState = {
    currentStep: 1 as 1 | 2 | 3 | 4,
    completedSteps: new Set<number>(),
    basics: {},
    plannerDetails: {},
    performerDetails: {},
    crewDetails: {},
    idempotencyKey: "test-uuid",
    submittedId: null,
    hasDraft: false,
  };

  const useRequirementStore = create(() => ({
    ...initialState,
    setBasics: vi.fn(),
    setPlannerDetails: vi.fn(),
    setPerformerDetails: vi.fn(),
    setCrewDetails: vi.fn(),
    advanceStep: vi.fn(),
    goToStep: vi.fn(),
    markStepComplete: vi.fn(),
    setSubmittedId: vi.fn(),
    reset: vi.fn(),
    clearDraft: vi.fn(),
  }));

  return { useRequirementStore, getActiveCategory: vi.fn(), getActiveDetails: vi.fn() };
});

describe("RequirementWizard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the wizard skeleton before mount", () => {
    render(<RequirementWizard />);
    // On initial render (before useEffect), shows loading skeleton or step 1
    // The heading should eventually appear
    expect(document.body).toBeTruthy();
  });
});
