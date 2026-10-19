"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, ReceiptText, Clock, Briefcase, Plus, User, LogOut, ChevronDown } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { useEstimateStore } from "@/store/estimateStore";
import { useNavigationStore, type NavTab } from "@/store/navigationStore";

interface HeaderProps {
  activeTab?: NavTab;
  onTabChange?: (tab: NavTab) => void;
}

export function Header({ activeTab, onTabChange }: HeaderProps) {
  const { user, isAuthenticated, logout, checkAuth } = useUserStore();
  const { getUnreadCount } = useEstimateStore();
  const { activeTab: storeTab, setActiveTab } = useNavigationStore();
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  const unreadCount = getUnreadCount();

  React.useEffect(() => {
    void checkAuth();
  }, [checkAuth]);

  const currentTab = activeTab ?? storeTab;

  const handleNavClick = (tab: NavTab) => {
    setActiveTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  return (
    <header className="border-b border-slate-100 bg-white sticky top-0 z-40 backdrop-blur-md bg-white/95">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            onClick={() => handleNavClick("wizard")}
            className="flex items-center gap-2 text-violet-600 focus:outline-none"
          >
            <div className="w-8 h-8 rounded-xl bg-violet-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 leading-none">
                Go<span className="text-violet-600">Pratle</span>
              </span>
              <span className="text-[10px] font-medium text-slate-400 tracking-wider uppercase mt-0.5">
                Event & Production Talent
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => handleNavClick("wizard")}
              className={[
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors",
                currentTab === "wizard"
                  ? "bg-violet-50 text-violet-700 font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50",
              ].join(" ")}
            >
              <Plus className="w-3.5 h-3.5" />
              Post Requirement
            </button>

            <button
              type="button"
              onClick={() => handleNavClick("showcase")}
              className={[
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors",
                currentTab === "showcase"
                  ? "bg-violet-50 text-violet-700 font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50",
              ].join(" ")}
            >
              <Briefcase className="w-3.5 h-3.5" />
              Our Work
            </button>

            <button
              type="button"
              onClick={() => handleNavClick("history")}
              className={[
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors",
                currentTab === "history"
                  ? "bg-violet-50 text-violet-700 font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50",
              ].join(" ")}
            >
              <Clock className="w-3.5 h-3.5" />
              Order History
            </button>

            <button
              type="button"
              onClick={() => handleNavClick("estimates")}
              className={[
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors relative",
                currentTab === "estimates"
                  ? "bg-violet-50 text-violet-700 font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50",
              ].join(" ")}
            >
              <ReceiptText className="w-3.5 h-3.5" />
              Estimate Breakups
              {unreadCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-violet-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Right Area: User Profile or Login */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 bg-white hover:border-violet-300 transition-all text-left"
              >
                <div className="w-7 h-7 rounded-lg bg-violet-600 text-white font-bold flex items-center justify-center text-xs">
                  {user.avatar}
                </div>
                <div className="hidden sm:block text-xs">
                  <p className="font-semibold text-slate-800 leading-tight">{user.name}</p>
                  <p className="text-[10px] text-slate-400 leading-none">{user.role}</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Profile Dropdown */}
              {userMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-100 shadow-xl p-2 z-50 space-y-1 text-xs"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="font-bold text-slate-900">{user.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 font-medium text-left transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-semibold hover:bg-violet-700 transition-colors shadow-xs"
            >
              <User className="w-3.5 h-3.5" />
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Subnav Strip */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-100 px-2 py-2 bg-slate-50/60 text-xs">
        <button
          type="button"
          onClick={() => handleNavClick("wizard")}
          className={[
            "flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg font-medium",
            currentTab === "wizard" ? "text-violet-700 font-bold" : "text-slate-500",
          ].join(" ")}
        >
          <Plus className="w-4 h-4" />
          <span>Post</span>
        </button>

        <button
          type="button"
          onClick={() => handleNavClick("showcase")}
          className={[
            "flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg font-medium",
            currentTab === "showcase" ? "text-violet-700 font-bold" : "text-slate-500",
          ].join(" ")}
        >
          <Briefcase className="w-4 h-4" />
          <span>Our Work</span>
        </button>

        <button
          type="button"
          onClick={() => handleNavClick("history")}
          className={[
            "flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg font-medium",
            currentTab === "history" ? "text-violet-700 font-bold" : "text-slate-500",
          ].join(" ")}
        >
          <Clock className="w-4 h-4" />
          <span>History</span>
        </button>

        <button
          type="button"
          onClick={() => handleNavClick("estimates")}
          className={[
            "flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg font-medium relative",
            currentTab === "estimates" ? "text-violet-700 font-bold" : "text-slate-500",
          ].join(" ")}
        >
          <div className="relative">
            <ReceiptText className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-violet-600 text-white text-[9px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <span>Estimates</span>
        </button>
      </div>
    </header>
  );
}
