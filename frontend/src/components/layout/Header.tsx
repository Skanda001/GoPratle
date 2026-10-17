import * as React from "react";
import { Sparkles } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-slate-100 bg-white sticky top-0 z-30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
        <div className="flex items-center gap-2 text-violet-600">
          <Sparkles className="w-5 h-5" aria-hidden="true" />
          <span className="text-lg font-bold tracking-tight text-slate-900">
            Go<span className="text-violet-600">Pratle</span>
          </span>
        </div>
      </div>
    </header>
  );
}
