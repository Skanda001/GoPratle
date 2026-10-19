"use client";

// Re-export estimateStore for backwards compatibility
export { useEstimateStore as useInboxStore } from "./estimateStore";
export type { EstimateBreakupRecord as EmailMessage } from "./estimateStore";
