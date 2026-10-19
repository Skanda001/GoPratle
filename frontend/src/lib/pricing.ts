import {
  SERVICE_PRICES,
  SERVICES_REQUIRED_LABELS,
  PERFORMER_BASE_RATES,
  PERFORMANCE_TYPE_LABELS,
  CREW_ROLE_RATES,
} from "./constants";
import type { LineItem } from "@/components/ui/PriceBreakdown";
import type { PlannerDetails, PerformerDetails, CrewDetails, Category } from "@/types";

export function computePlannerBreakdown(details: Partial<PlannerDetails>): { items: LineItem[]; total: number } {
  const items: LineItem[] = (details.servicesRequired ?? [])
    .filter((s) => SERVICE_PRICES[s] !== undefined)
    .map((s) => ({
      label: SERVICES_REQUIRED_LABELS[s] ?? s,
      amount: SERVICE_PRICES[s] ?? 0,
    }));
  const total = items.reduce((sum, i) => sum + i.amount, 0);
  return { items, total };
}

export function computePerformerBreakdown(details: Partial<PerformerDetails>): { items: LineItem[]; total: number } {
  const { performanceType, performerCount, performanceCount } = details;
  if (!performanceType || !performerCount || !performanceCount) return { items: [], total: 0 };
  const baseRate = PERFORMER_BASE_RATES[performanceType] ?? 0;
  const total = performerCount * performanceCount * baseRate;
  if (total === 0) return { items: [], total: 0 };
  const items: LineItem[] = [
    {
      label: `${PERFORMANCE_TYPE_LABELS[performanceType] ?? performanceType} × ${performerCount} performer${performerCount !== 1 ? "s" : ""} × ${performanceCount} performance${performanceCount !== 1 ? "s" : ""}`,
      amount: total,
      note: `₹${baseRate.toLocaleString("en-IN")}/performance`,
    },
  ];
  return { items, total };
}

export function computeCrewBreakdown(details: Partial<CrewDetails>): { items: LineItem[]; total: number } {
  const { roles, crewCount, shiftHours, shiftCount } = details;
  if (!roles?.length || !crewCount || !shiftHours || !shiftCount) return { items: [], total: 0 };
  const roleRates = roles.map((r) => CREW_ROLE_RATES[r] ?? 0).filter((r) => r > 0);
  const avgRate = roleRates.length > 0 ? roleRates.reduce((s, r) => s + r, 0) / roleRates.length : 0;
  const total = Math.round(crewCount * shiftHours * shiftCount * avgRate);
  if (total === 0) return { items: [], total: 0 };
  const items: LineItem[] = [
    {
      label: `${crewCount} crew × ${shiftHours}h × ${shiftCount} shift${shiftCount !== 1 ? "s" : ""}`,
      amount: total,
      note: `avg ₹${Math.round(avgRate)}/hr per person`,
    },
  ];
  return { items, total };
}

export function computeCategoryBreakdown(
  category: Category | undefined,
  details: {
    planner?: Partial<PlannerDetails>;
    performer?: Partial<PerformerDetails>;
    crew?: Partial<CrewDetails>;
  }
): { items: LineItem[]; total: number } {
  if (category === "planner" && details.planner) return computePlannerBreakdown(details.planner);
  if (category === "performer" && details.performer) return computePerformerBreakdown(details.performer);
  if (category === "crew" && details.crew) return computeCrewBreakdown(details.crew);
  return { items: [], total: 0 };
}
