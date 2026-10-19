"use client";

import * as React from "react";
import { IndianRupee } from "lucide-react";
import { formatMoney } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface LineItem {
  label: string;
  amount: number;
  note?: string;
}

interface PriceBreakdownProps {
  items: LineItem[];
  total: number;
  title?: string;
  className?: string;
}

// ---------------------------------------------------------------------------
// Helper — compact abbreviation: 15000 → "₹15K", 150000 → "₹1.5L"
// ---------------------------------------------------------------------------

export function formatCompact(amount: number): string {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(amount % 100000 === 0 ? 0 : 1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1)}K`;
  return `₹${amount}`;
}

// ---------------------------------------------------------------------------
// PriceBreakdown component
// ---------------------------------------------------------------------------

export function PriceBreakdown({ items, total, title = "Estimated Cost Breakdown", className }: PriceBreakdownProps) {
  if (items.length === 0) return null;

  return (
    <div className={["mt-4 rounded-xl border border-violet-100 bg-violet-50/40 overflow-hidden", className].filter(Boolean).join(" ")}>
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-violet-100 bg-violet-50">
        <IndianRupee className="w-4 h-4 text-violet-600" />
        <h4 className="text-sm font-semibold text-violet-700">{title}</h4>
      </div>

      {/* Line items */}
      <div className="px-4 py-3 space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-baseline justify-between text-sm gap-4">
            <span className="text-slate-600 flex-1">
              {item.label}
              {item.note && <span className="ml-1 text-slate-400 text-xs">({item.note})</span>}
            </span>
            <span className="text-slate-800 font-medium tabular-nums whitespace-nowrap">
              {formatMoney(item.amount, "INR")}
            </span>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-violet-100 bg-violet-50">
        <span className="text-sm font-semibold text-violet-700">Estimated Total</span>
        <span className="text-base font-bold text-violet-700 tabular-nums">
          {formatMoney(total, "INR")}
        </span>
      </div>

      <p className="px-4 pb-3 text-xs text-slate-400">
        * These are indicative estimates only. Final pricing may vary.
      </p>
    </div>
  );
}
