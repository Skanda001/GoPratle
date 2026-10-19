"use client";

import * as React from "react";
import { ReceiptText, Sparkles, MapPin, Calendar, IndianRupee, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useEstimateStore } from "@/store/estimateStore";
import { CATEGORY_LABELS } from "@/lib/constants";
import { formatMoney } from "@/lib/utils";

interface EstimateBreakupViewProps {
  initialOrderId?: string | null;
}

export function EstimateBreakupView({ initialOrderId }: EstimateBreakupViewProps) {
  const { estimates, selectedEstimateId, selectEstimate, markAllAsRead } = useEstimateStore();

  React.useEffect(() => {
    if (initialOrderId) {
      const match = estimates.find((e) => e.orderId === initialOrderId);
      if (match) {
        selectEstimate(match.id);
        return;
      }
    }
    if (!selectedEstimateId && estimates.length > 0) {
      selectEstimate(estimates[0]?.id ?? null);
    }
  }, [initialOrderId, estimates, selectedEstimateId, selectEstimate]);

  const activeEstimate = estimates.find((e) => e.id === selectedEstimateId) || estimates[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100/80 text-violet-700 text-xs font-semibold uppercase tracking-wider mb-2">
            <ReceiptText className="w-3.5 h-3.5" />
            Estimate Breakups
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Price Estimate Breakups
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Official itemized cost breakups and service quotations for your event requirements.
          </p>
        </div>

        {estimates.length > 0 && (
          <button
            type="button"
            onClick={markAllAsRead}
            className="text-xs text-violet-600 hover:text-violet-800 font-semibold self-start sm:self-auto"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Empty State */}
      {estimates.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center mx-auto">
            <ReceiptText className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800">No Estimate Breakups Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              When you post an event requirement, your official itemized cost breakup and talent quotation will be generated here.
            </p>
          </div>
        </div>
      ) : (
        /* Quotation Viewer Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm min-h-[560px]">
          {/* Left Column: Estimates List */}
          <div className="lg:col-span-5 border-r border-slate-100 flex flex-col">
            <div className="p-3.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Quotations ({estimates.length})
              </span>
              <span className="text-xs text-slate-400">
                {estimates.filter((e) => !e.read).length} New
              </span>
            </div>

            <div className="divide-y divide-slate-100 overflow-y-auto max-h-[600px] flex-1">
              {estimates.map((est) => {
                const isSelected = activeEstimate?.id === est.id;
                return (
                  <button
                    key={est.id}
                    type="button"
                    onClick={() => selectEstimate(est.id)}
                    className={[
                      "w-full text-left p-4 transition-all relative flex flex-col gap-1.5",
                      isSelected
                        ? "bg-violet-50/60 border-l-4 border-l-violet-600"
                        : "hover:bg-slate-50",
                      !est.read ? "font-semibold" : "opacity-90",
                    ].join(" ")}
                  >
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-mono text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        REF: {est.orderId}
                      </span>
                      <span className="text-[11px] text-slate-400">{est.date}</span>
                    </div>

                    <p
                      className={[
                        "text-xs line-clamp-1",
                        isSelected ? "text-violet-900 font-bold" : "text-slate-800",
                      ].join(" ")}
                    >
                      {est.eventName}
                    </p>

                    <div className="flex items-center justify-between gap-2 mt-1">
                      <span className="text-[11px] font-medium text-slate-500">
                        {CATEGORY_LABELS[est.category] ?? est.category}
                      </span>

                      <span className="text-xs font-bold text-violet-700 tabular-nums">
                        {formatMoney(est.totalAmount, "INR")}
                      </span>
                    </div>

                    {!est.read && (
                      <span className="absolute top-4 right-3 w-2 h-2 rounded-full bg-violet-600" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Full Itemized Quotation Document */}
          <div className="lg:col-span-7 flex flex-col bg-slate-50/30">
            {activeEstimate ? (
              <div className="p-6 flex-1 flex flex-col overflow-y-auto max-h-[640px] space-y-6">
                {/* Quotation Document Card */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
                  {/* Brand & Reference Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2 text-violet-600">
                      <Sparkles className="w-5 h-5" />
                      <span className="text-base font-bold tracking-tight text-slate-900">
                        Go<span className="text-violet-600">Pratle</span> Quotation
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Estimate Confirmed
                    </span>
                  </div>

                  {/* Order & Event Header Details */}
                  <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 space-y-2 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-2">
                      <div>
                        <span className="text-slate-400">Reference ID: </span>
                        <strong className="font-mono text-violet-700">{activeEstimate.orderId}</strong>
                      </div>
                      <span className="text-slate-400">{activeEstimate.date}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      <div>
                        <span className="text-slate-500">Event Name: </span>
                        <strong className="text-slate-900">{activeEstimate.eventName}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500">Category: </span>
                        <strong className="text-violet-700">
                          {CATEGORY_LABELS[activeEstimate.category] ?? activeEstimate.category}
                        </strong>
                      </div>
                      {activeEstimate.location && (
                        <div className="flex items-center gap-1 text-slate-700">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{activeEstimate.location}</span>
                        </div>
                      )}
                      {activeEstimate.eventDate && (
                        <div className="flex items-center gap-1 text-slate-700">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{activeEstimate.eventDate}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ITEMIzED ESTIMATE BREAKUP TABLE */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-slate-900">
                      <IndianRupee className="w-4 h-4 text-violet-600" />
                      <h4 className="text-sm font-bold tracking-tight">
                        Itemized Cost Breakup
                      </h4>
                    </div>

                    <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                      <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                          <tr>
                            <th className="py-2.5 px-3">Service / Role Scope</th>
                            <th className="py-2.5 px-3 text-right">Estimated Amount (₹)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                          {activeEstimate.breakdownItems.map((item, i) => (
                            <tr key={i} className="hover:bg-slate-50/50">
                              <td className="py-2.5 px-3">
                                <span className="font-medium text-slate-800">{item.label}</span>
                                {item.note && (
                                  <span className="block text-[11px] text-slate-400 mt-0.5">
                                    {item.note}
                                  </span>
                                )}
                              </td>
                              <td className="py-2.5 px-3 text-right font-semibold text-slate-900 tabular-nums">
                                {formatMoney(item.amount, "INR")}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-violet-50/80 border-t-2 border-violet-200 font-bold text-violet-900">
                          <tr>
                            <td className="py-3 px-3 text-xs uppercase tracking-wider">
                              Estimated Grand Total
                            </td>
                            <td className="py-3 px-3 text-right text-sm tabular-nums text-violet-800">
                              {formatMoney(activeEstimate.totalAmount, "INR")}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    <p className="text-[11px] text-slate-400 italic">
                      * This estimate is calculated based on current market rates and the parameters you provided. Final pricing is confirmed upon partner booking.
                    </p>
                  </div>

                  {/* Next Steps Note */}
                  <div className="border border-emerald-100 bg-emerald-50/40 rounded-xl p-4 space-y-1 text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Next Steps & Vendor Allocation</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      Our platform is matching your event specifications against verified professionals. Shortlisted partners will be assigned according to this estimate breakup.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-400 text-xs p-8">
                Select an estimate breakup from the list to view its details.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
