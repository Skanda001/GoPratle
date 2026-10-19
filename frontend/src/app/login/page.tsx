"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Lock, Mail, User, Loader2, ArrowRight } from "lucide-react";
import { useUserStore } from "@/store/userStore";

export default function LoginPage() {
  const router = useRouter();
  const { login, register, user, isAuthenticated, logout, isLoading } = useUserStore();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [isSignUp, setIsSignUp] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isSignUp) {
      if (!name.trim() || name.trim().length < 2) {
        setError("Please enter your full name (minimum 2 characters).");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
      const res = await register(name.trim(), email.trim(), password);
      if (!res.ok) {
        setError(res.error || "Registration failed. Please try again.");
        return;
      }
      router.push("/");
    } else {
      const res = await login(email.trim(), password);
      if (!res.ok) {
        setError(res.error || "Invalid email or password.");
        return;
      }
      router.push("/");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6">
      <div className="w-full max-w-md space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 text-violet-600">
            <Sparkles className="w-6 h-6" />
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              Go<span className="text-violet-600">Pratle</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {isAuthenticated ? "Your Account" : isSignUp ? "Create Your Account" : "Sign in to GoPratle"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {isAuthenticated
              ? "You are logged in with your verified credentials."
              : isSignUp
              ? "Register with your real name and email to track requirements and receive itemized estimate breakups."
              : "Sign in with your email and password to access your bookings and quotations."}
          </p>
        </div>

        {/* If already logged in */}
        {isAuthenticated && user ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-violet-600 text-white font-bold flex items-center justify-center text-sm">
                {user.avatar}
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-bold text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
                <span className="inline-block text-[11px] font-semibold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-full">
                  {user.role}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex gap-2">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="flex-1 py-2 px-3 rounded-xl bg-violet-600 text-white text-xs font-semibold hover:bg-violet-700 transition-colors text-center"
              >
                Go to Dashboard
              </button>
              <button
                type="button"
                onClick={logout}
                className="py-2 px-3 rounded-xl border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          /* Real Credentials Form (Zero Demo Users) */
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
            {/* Tab switch between Sign In and Sign Up */}
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(false);
                  setError(null);
                }}
                className={[
                  "py-2 rounded-lg transition-all",
                  !isSignUp ? "bg-white text-violet-700 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900",
                ].join(" ")}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(true);
                  setError(null);
                }}
                className={[
                  "py-2 rounded-lg transition-all",
                  isSignUp ? "bg-white text-violet-700 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900",
                ].join(" ")}
              >
                Create Account
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-700">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-700">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-700">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                {isSignUp && (
                  <p className="text-[11px] text-slate-400">Must be at least 6 characters.</p>
                )}
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-700 font-medium">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl bg-violet-600 text-white text-xs font-semibold hover:bg-violet-700 transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSignUp ? "Register Account" : "Sign In to GoPratle"}
                {!isLoading && <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </form>
          </div>
        )}

        <div className="text-center">
          <Link href="/" className="text-xs text-slate-400 hover:text-slate-600">
            ← Back to GoPratle Home
          </Link>
        </div>
      </div>
    </div>
  );
}
