"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { loginUser, registerUser, getMe } from "@/lib/api";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
}

interface UserState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export function computeAvatar(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || "U";
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        const res = await loginUser(email, password);
        set({ isLoading: false });

        if (res.ok && res.data) {
          const u = res.data.user;
          const userObj: UserProfile = {
            id: u.id,
            name: u.name,
            email: u.email,
            avatar: computeAvatar(u.name),
            role: u.role || "Event Host",
          };
          set({
            user: userObj,
            token: res.data.token,
            isAuthenticated: true,
          });
          return { ok: true };
        }

        return {
          ok: false,
          error: res.error || "Invalid email or password",
        };
      },

      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true });
        const res = await registerUser(name, email, password);
        set({ isLoading: false });

        if (res.ok && res.data) {
          const u = res.data.user;
          const userObj: UserProfile = {
            id: u.id,
            name: u.name,
            email: u.email,
            avatar: computeAvatar(u.name),
            role: u.role || "Event Host",
          };
          set({
            user: userObj,
            token: res.data.token,
            isAuthenticated: true,
          });
          return { ok: true };
        }

        return {
          ok: false,
          error: res.error || "Registration failed",
        };
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      checkAuth: async () => {
        const token = get().token;
        if (!token) {
          set({ user: null, isAuthenticated: false });
          return;
        }

        const res = await getMe(token);
        if (res.ok && res.data) {
          const u = res.data.user;
          set({
            user: {
              id: u.id,
              name: u.name,
              email: u.email,
              avatar: computeAvatar(u.name),
              role: u.role || "Event Host",
            },
            isAuthenticated: true,
          });
        } else {
          // Token expired or invalid
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
        }
      },
    }),
    {
      name: "gopratle-real-auth-session-v1",
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") {
          return {
            getItem: () => null,
            setItem: () => undefined,
            removeItem: () => undefined,
          };
        }
        return localStorage;
      }),
    }
  )
);
