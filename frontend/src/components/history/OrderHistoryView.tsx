"use client";

import * as React from "react";
import { Clock, Calendar, MapPin, ReceiptText, ArrowRight, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { useOrderHistoryStore } from "@/store/orderHistoryStore";
import { useUserStore } from "@/store/userStore";
import { CATEGORY_LABELS } from "@/lib/constants";
import { formatDateRange, formatMoney } from "@/lib/utils";

interface OrderHistoryViewProps {
  onOpenEstimate?: (orderId: string) => void;
  onOpenEmail?: (orderId: string) => void;
  onPostRequirement?: () => void;
}

export function OrderHistoryView({ onOpenEstimate, onOpenEmail, onPostRequirement }: OrderHistoryViewProps) {
  const { orders, fetchMyOrders } = useOrderHistoryStore();
  const { token, isAuthenticated } = useUserStore();

  React.useEffect(() => {
    if (isAuthenticated && token) {
      void fetchMyOrders(token);
    }
  }, [isAuthenticated, token, fetchMyOrders]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Order Placed":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Matching Vendors":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Confirmed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100/80 text-violet-700 text-xs font-semibold uppercase tracking-wider mb-2">
            <Clock className="w-3.5 h-3.5" />
            Booking History
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Placed Requirements & Orders
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Track the status of your event postings, vendor matches, and itemized estimate breakups.
          </p>
        </div>

        {onPostRequirement && (
          <button
            type="button"
            onClick={onPostRequirement}
            className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 text-white text-xs font-semibold hover:bg-violet-700 transition-colors shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Post New Requirement
          </button>
        )}
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-slate-200 bg-white space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Clock className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-slate-800">No Requirements Placed Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven&apos;t posted any event requirements yet. Post your first requirement to get matched with verified talent.
            </p>
          </div>
          {onPostRequirement && (
            <button
              type="button"
              onClick={onPostRequirement}
              className="px-5 py-2.5 rounded-xl bg-violet-600 text-white text-xs font-semibold hover:bg-violet-700 transition-colors"
            >
              Post a Requirement
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border border-slate-100 bg-white p-5 sm:p-6 shadow-sm hover:shadow transition-shadow space-y-4"
            >
              {/* Top row: Order ID, Category, Status */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                    REF: {order.id}
                  </span>
                  <span className="text-xs font-semibold text-violet-700 bg-violet-50 px-2.5 py-1 rounded-md">
                    {CATEGORY_LABELS[order.category] ?? order.category}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={[
                      "text-xs px-2.5 py-1 rounded-full border font-medium flex items-center gap-1.5",
                      getStatusBadge(order.status),
                    ].join(" ")}
                  >
                    {order.status === "Confirmed" ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                    )}
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Event Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1">
                  <p className="text-slate-400 font-medium">Event Name</p>
                  <p className="text-sm font-bold text-slate-800">{order.eventName}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-slate-400 font-medium">Date & Schedule</p>
                  <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {order.startDate
                        ? formatDateRange(
                            order.startDate,
                            order.dateMode === "range" ? order.endDate : undefined
                          )
                        : "Date to be confirmed"}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-slate-400 font-medium">Location</p>
                  <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{order.location}</span>
                  </div>
                </div>
              </div>

              {/* Footer: Price hint + View Estimate action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 bg-slate-50/50 -mx-5 -mb-5 px-5 py-3 rounded-b-2xl">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <ReceiptText className="w-4 h-4 text-violet-600 flex-shrink-0" />
                  <span>
                    Itemized estimate breakup:{" "}
                    <strong className="text-slate-900 font-semibold">
                      {order.estimatedTotal > 0
                        ? formatMoney(order.estimatedTotal, "INR")
                        : "Available in Breakups"}
                    </strong>
                  </span>
                </div>

                {(onOpenEstimate || onOpenEmail) && (
                  <button
                    type="button"
                    onClick={() => (onOpenEstimate || onOpenEmail)?.(order.id)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-violet-700 hover:text-violet-900 transition-colors self-end sm:self-auto"
                  >
                    View Estimate Breakup
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
