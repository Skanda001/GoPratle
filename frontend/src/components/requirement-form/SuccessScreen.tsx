"use client";

import * as React from "react";
import { CheckCircle2, Copy, Check, Plus, ReceiptText, Clock } from "lucide-react";
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
  onViewEstimates?: () => void;
  onViewEmail?: () => void;
  onViewHistory?: () => void;
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
  onViewEstimates,
  onViewEmail,
  onViewHistory,
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
    <div className="flex flex-col items-center text-center py-8 px-4 gap-5">
      <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
        <CheckCircle2 className="w-9 h-9 text-green-500" aria-hidden="true" />
      </div>

      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-slate-900">Order Placed Successfully!</h2>
        <p className="text-slate-500 text-sm max-w-sm">
          Your event requirement is registered. We have notified verified event professionals.
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

      {/* Estimate Breakup Alert */}
      <div className="w-full max-w-sm rounded-xl border border-violet-100 bg-violet-50/70 p-4 text-left flex items-start gap-3">
        <ReceiptText className="w-5 h-5 text-violet-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-xs font-semibold text-violet-900 uppercase tracking-wide">
            Estimate Breakup Generated
          </p>
          <p className="text-xs text-slate-600 leading-relaxed">
            An itemized price estimate breakup and talent quotation have been generated for your order.
          </p>
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

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-2.5 w-full max-w-sm">
        {(onViewEstimates || onViewEmail) && (
          <button
            type="button"
            onClick={onViewEstimates || onViewEmail}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors shadow-sm"
          >
            <ReceiptText className="w-4 h-4" />
            View Estimate Breakup
          </button>
        )}
        {onViewHistory && (
          <button
            type="button"
            onClick={onViewHistory}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            <Clock className="w-4 h-4" />
            Order History
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={onCreateAnother}
        className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-violet-600 font-medium transition-colors pt-1"
      >
        <Plus className="w-3.5 h-3.5" />
        Create Another Requirement
      </button>
    </div>
  );
}
