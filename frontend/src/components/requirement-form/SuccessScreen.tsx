"use client";

import * as React from "react";
import { CheckCircle2, Copy, Check, Plus } from "lucide-react";
import { CATEGORY_LABELS, EVENT_TYPE_LABELS } from "@/lib/constants";
import { formatDateRange } from "@/lib/utils";
import type { Category, EventType, DateMode } from "@/types";

interface SuccessScreenProps {
  recordId: string;
  category: Category;
  eventName: string;
  eventType: EventType;
  startDate: string;
  endDate: string | undefined;
  dateMode: DateMode;
  onCreateAnother: () => void;
}

export function SuccessScreen({
  recordId,
  category,
  eventName,
  eventType,
  startDate,
  endDate,
  dateMode,
  onCreateAnother,
}: SuccessScreenProps) {
  const [copied, setCopied] = React.useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(recordId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable in some envs — graceful no-op
    }
  }

  return (
    <div className="flex flex-col items-center text-center py-10 px-4 gap-6">
      <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
        <CheckCircle2 className="w-9 h-9 text-green-500" aria-hidden="true" />
      </div>

      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-slate-900">Requirement Submitted!</h2>
        <p className="text-slate-500 text-sm max-w-sm">
          Your requirement has been saved. Matching professionals will be able to see your posting.
        </p>
      </div>

      {/* Reference ID */}
      <div className="w-full max-w-sm rounded-xl border border-slate-100 bg-slate-50 p-4 space-y-1">
        <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Reference ID</p>
        <div className="flex items-center justify-between gap-2">
          <code className="text-sm font-mono text-slate-800 break-all text-left">{recordId}</code>
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy reference ID"
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-violet-600 hover:border-violet-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="w-full max-w-sm rounded-xl border border-slate-100 bg-white p-4 text-left space-y-2">
        <div className="flex gap-3 text-sm">
          <span className="text-slate-500 w-24 flex-shrink-0">Category</span>
          <span className="font-semibold text-violet-700">{CATEGORY_LABELS[category]}</span>
        </div>
        <div className="flex gap-3 text-sm">
          <span className="text-slate-500 w-24 flex-shrink-0">Event</span>
          <span className="font-medium text-slate-800">{eventName}</span>
        </div>
        <div className="flex gap-3 text-sm">
          <span className="text-slate-500 w-24 flex-shrink-0">Type</span>
          <span className="font-medium text-slate-800">{EVENT_TYPE_LABELS[eventType] ?? eventType}</span>
        </div>
        <div className="flex gap-3 text-sm">
          <span className="text-slate-500 w-24 flex-shrink-0">Date</span>
          <span className="font-medium text-slate-800">
            {formatDateRange(startDate, dateMode === "range" ? endDate : undefined)}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onCreateAnother}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-violet-200 text-violet-700 text-sm font-medium hover:bg-violet-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
      >
        <Plus className="w-4 h-4" />
        Create Another Requirement
      </button>
    </div>
  );
}
