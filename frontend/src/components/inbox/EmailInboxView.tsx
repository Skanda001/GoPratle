"use client";

import { EstimateBreakupView } from "@/components/estimates/EstimateBreakupView";

interface EmailInboxViewProps {
  initialOrderId?: string | null;
}

export function EmailInboxView({ initialOrderId }: EmailInboxViewProps) {
  return <EstimateBreakupView initialOrderId={initialOrderId} />;
}
