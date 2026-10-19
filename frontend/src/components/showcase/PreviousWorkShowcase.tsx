"use client";

import * as React from "react";
import { Star, MapPin, Calendar, Users, CheckCircle2, X, ArrowRight, Sparkles } from "lucide-react";
import { PREVIOUS_WORK, type PreviousWorkItem } from "@/data/previousWork";

interface PreviousWorkShowcaseProps {
  onPostRequirement?: () => void;
}

export function PreviousWorkShowcase({ onPostRequirement }: PreviousWorkShowcaseProps) {
  const [activeFilter, setActiveFilter] = React.useState<"all" | "planner" | "performer" | "crew">("all");
  const [selectedWork, setSelectedWork] = React.useState<PreviousWorkItem | null>(null);

  const filteredWork = PREVIOUS_WORK.filter((item) =>
    activeFilter === "all" ? true : item.category === activeFilter
  );

  return (
    <div className="space-y-8">
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100/80 text-violet-700 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Verified Case Studies
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Previous Work & Event Portfolio
          </h2>
          <p className="text-sm text-slate-500 mt-1 max-w-xl">
            Explore past productions orchestrated through GoPratle — from royal destination weddings to stadium concerts and tech keynotes.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-xl self-start sm:self-auto text-xs font-medium">
          {(
            [
              { id: "all", label: "All Work" },
              { id: "planner", label: "Planners" },
              { id: "performer", label: "Performers" },
              { id: "crew", label: "Technical Crew" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id)}
              className={[
                "px-3 py-1.5 rounded-lg transition-all",
                activeFilter === tab.id
                  ? "bg-white text-violet-700 font-semibold shadow-sm"
                  : "text-slate-600 hover:text-slate-900",
              ].join(" ")}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWork.map((item) => (
          <div
            key={item.id}
            className="group rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
          >
            {/* Image Container with Fallback Gradient */}
            <div className="relative h-48 w-full bg-slate-800 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.coverImage}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                onError={(e) => {
                  // Fallback if network blocked
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-medium">
                {item.categoryLabel}
              </span>

              <div className="absolute bottom-3 left-3 right-3 text-white">
                <p className="text-xs text-slate-300 font-medium">{item.client}</p>
                <h3 className="text-base font-bold leading-snug line-clamp-1">{item.title}</h3>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {item.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {item.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    {item.scale}
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {item.summary}
                </p>
              </div>

              {/* Work Done highlights */}
              <div className="border-t border-slate-100 pt-3 space-y-1.5">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Work Done
                </p>
                <div className="space-y-1">
                  {item.workDone.slice(0, 2).map((w, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{w}</span>
                    </div>
                  ))}
                  {item.workDone.length > 2 && (
                    <p className="text-[11px] text-violet-600 font-medium pl-5">
                      +{item.workDone.length - 2} more deliverables
                    </p>
                  )}
                </div>
              </div>

              {/* Action */}
              <button
                type="button"
                onClick={() => setSelectedWork(item)}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:text-violet-700 hover:border-violet-300 hover:bg-violet-50/50 transition-colors"
              >
                View Full Work Details & Photos
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA to Wizard */}
      <div className="rounded-2xl bg-gradient-to-r from-violet-900 to-indigo-900 p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-xl font-bold">Planning a similar event?</h3>
          <p className="text-violet-200 text-xs sm:text-sm max-w-md">
            Submit your requirements in 2 minutes. Receive verified artist quotes, crew bookings, and a detailed price estimate breakup directly to your email.
          </p>
        </div>
        {onPostRequirement && (
          <button
            type="button"
            onClick={onPostRequirement}
            className="flex-shrink-0 px-6 py-3 rounded-xl bg-white text-violet-900 text-sm font-bold hover:bg-violet-50 transition-colors shadow-sm"
          >
            Post a Requirement Now
          </button>
        )}
      </div>

      {/* Case Study Modal */}
      {selectedWork && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedWork(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-100 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image Header */}
            <div className="relative h-64 sm:h-72 w-full bg-slate-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedWork.coverImage}
                alt={selectedWork.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-black/20 to-transparent" />
              <button
                type="button"
                onClick={() => setSelectedWork(null)}
                aria-label="Close modal"
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-violet-600 text-[11px] font-semibold uppercase tracking-wider">
                  {selectedWork.categoryLabel}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold">{selectedWork.title}</h3>
                <p className="text-xs text-slate-300">
                  {selectedWork.client} • {selectedWork.venue}
                </p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl text-center">
                {selectedWork.metrics.map((m, i) => (
                  <div key={i} className="space-y-0.5">
                    <p className="text-base sm:text-lg font-bold text-violet-700">{m.value}</p>
                    <p className="text-[11px] text-slate-500 font-medium">{m.label}</p>
                  </div>
                ))}
              </div>

              {/* Event Description */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Event Overview
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {selectedWork.summary}
                </p>
              </div>

              {/* Scope of Work Done */}
              <div className="space-y-2.5">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Work Done & Execution Scope
                </h4>
                <ul className="space-y-2">
                  {selectedWork.workDone.map((w, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Testimonial */}
              <div className="rounded-xl bg-violet-50/60 border border-violet-100 p-4 space-y-2">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 italic">
                  &ldquo;{selectedWork.testimonial.quote}&rdquo;
                </p>
                <div className="text-xs font-semibold text-violet-900">
                  {selectedWork.testimonial.author}
                  <span className="font-normal text-slate-500 ml-1">
                    ({selectedWork.testimonial.title})
                  </span>
                </div>
              </div>

              {/* Gallery thumbnails */}
              {selectedWork.galleryImages.length > 1 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Event Gallery
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedWork.galleryImages.map((img, i) => (
                      <div key={i} className="h-20 rounded-lg overflow-hidden bg-slate-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img} alt="Gallery thumb" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedWork(null);
                    onPostRequirement?.();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-violet-600 text-white text-xs font-semibold hover:bg-violet-700 transition-colors"
                >
                  Post a Requirement Similar to This
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
