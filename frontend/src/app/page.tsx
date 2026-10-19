"use client";

import * as React from "react";
import { Sparkles, Briefcase, Clock, ReceiptText, Plus } from "lucide-react";
import { RequirementWizard } from "@/components/requirement-form/RequirementWizard";
import { PreviousWorkShowcase } from "@/components/showcase/PreviousWorkShowcase";
import { OrderHistoryView } from "@/components/history/OrderHistoryView";
import { EstimateBreakupView } from "@/components/estimates/EstimateBreakupView";
import { useNavigationStore } from "@/store/navigationStore";
import { useEstimateStore } from "@/store/estimateStore";

export default function Home() {
  const { activeTab, setActiveTab, selectedEstimateOrderId, openEstimateForOrder } = useNavigationStore();
  const { getUnreadCount } = useEstimateStore();
  const unreadCount = getUnreadCount();

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      {/* Real Website Hero Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto pt-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-50 border border-violet-100 text-violet-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>India&apos;s Premier Event & Talent Infrastructure</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Hire Verified Planners, Performers & Production Crew
        </h1>

        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          From royal destination weddings to campus concerts and corporate summits — post your requirements, get matched with vetted professionals, and receive itemized estimate breakups for your event.
        </p>

        {/* Live Metrics Strip */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-2 max-w-md mx-auto text-center">
          <div className="p-2 sm:p-3 rounded-xl bg-slate-50 border border-slate-100">
            <p className="text-base sm:text-lg font-bold text-violet-700">1,200+</p>
            <p className="text-[11px] text-slate-500 font-medium">Events Produced</p>
          </div>
          <div className="p-2 sm:p-3 rounded-xl bg-slate-50 border border-slate-100">
            <p className="text-base sm:text-lg font-bold text-slate-800">450+</p>
            <p className="text-[11px] text-slate-500 font-medium">Verified Talent</p>
          </div>
          <div className="p-2 sm:p-3 rounded-xl bg-slate-50 border border-slate-100">
            <p className="text-base sm:text-lg font-bold text-emerald-600">99.4%</p>
            <p className="text-[11px] text-slate-500 font-medium">On-Time Execution</p>
          </div>
        </div>
      </div>

      {/* Main Tab Navigation Bar */}
      <div className="flex items-center justify-center">
        <div className="inline-flex p-1.5 bg-slate-100/90 rounded-2xl gap-1 text-xs sm:text-sm font-semibold max-w-full overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("wizard")}
            className={[
              "flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap",
              activeTab === "wizard"
                ? "bg-white text-violet-700 shadow-sm font-bold"
                : "text-slate-600 hover:text-slate-900",
            ].join(" ")}
          >
            <Plus className="w-4 h-4" />
            <span>Post Requirement</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("showcase")}
            className={[
              "flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap",
              activeTab === "showcase"
                ? "bg-white text-violet-700 shadow-sm font-bold"
                : "text-slate-600 hover:text-slate-900",
            ].join(" ")}
          >
            <Briefcase className="w-4 h-4" />
            <span>Previous Work (5)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("history")}
            className={[
              "flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap",
              activeTab === "history"
                ? "bg-white text-violet-700 shadow-sm font-bold"
                : "text-slate-600 hover:text-slate-900",
            ].join(" ")}
          >
            <Clock className="w-4 h-4" />
            <span>Order History</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("estimates")}
            className={[
              "flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap relative",
              activeTab === "estimates"
                ? "bg-white text-violet-700 shadow-sm font-bold"
                : "text-slate-600 hover:text-slate-900",
            ].join(" ")}
          >
            <ReceiptText className="w-4 h-4" />
            <span>Estimate Breakups</span>
            {unreadCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-violet-600 text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      <div className="pt-2">
        {activeTab === "wizard" && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-8">
              <RequirementWizard
                onViewEstimates={() => setActiveTab("estimates")}
                onViewHistory={() => setActiveTab("history")}
              />
            </div>
          </div>
        )}

        {activeTab === "showcase" && (
          <PreviousWorkShowcase onPostRequirement={() => setActiveTab("wizard")} />
        )}

        {activeTab === "history" && (
          <OrderHistoryView
            onOpenEstimate={(orderId) => openEstimateForOrder(orderId)}
            onPostRequirement={() => setActiveTab("wizard")}
          />
        )}

        {activeTab === "estimates" && (
          <EstimateBreakupView initialOrderId={selectedEstimateOrderId} />
        )}
      </div>
    </div>
  );
}
