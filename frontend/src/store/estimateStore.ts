"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { LineItem } from "@/components/ui/PriceBreakdown";
import type { Category } from "@/types";

export interface EstimateBreakupRecord {
  id: string;
  orderId: string;
  eventName: string;
  category: Category;
  location?: string;
  eventDate?: string;
  breakdownItems: LineItem[];
  totalAmount: number;
  date: string;
  read: boolean;
  notes?: string;
}

interface EstimateState {
  estimates: EstimateBreakupRecord[];
  selectedEstimateId: string | null;
  selectEstimate: (id: string | null) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addEstimate: (estimate: Omit<EstimateBreakupRecord, "id" | "date" | "read">) => string;
  getUnreadCount: () => number;
}

export const useEstimateStore = create<EstimateState>()(
  persist(
    (set, get) => ({
      estimates: [],
      selectedEstimateId: null,

      selectEstimate: (id) => {
        set({ selectedEstimateId: id });
        if (id) {
          get().markAsRead(id);
        }
      },

      markAsRead: (id) => {
        set((state) => ({
          estimates: state.estimates.map((e) => (e.id === id ? { ...e, read: true } : e)),
        }));
      },

      markAllAsRead: () => {
        set((state) => ({
          estimates: state.estimates.map((e) => ({ ...e, read: true })),
        }));
      },

      addEstimate: (data) => {
        const id = `est-${Date.now()}`;
        const newRecord: EstimateBreakupRecord = {
          ...data,
          id,
          date: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          read: false,
        };
        set((state) => ({
          estimates: [newRecord, ...state.estimates],
          selectedEstimateId: id,
        }));
        return id;
      },

      getUnreadCount: () => {
        return get().estimates.filter((e) => !e.read).length;
      },
    }),
    {
      name: "gopratle-estimate-breakups-v1",
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
