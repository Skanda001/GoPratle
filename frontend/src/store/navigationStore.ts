"use client";

import { create } from "zustand";

export type NavTab = "wizard" | "showcase" | "history" | "estimates";

interface NavigationState {
  activeTab: NavTab;
  selectedEstimateOrderId: string | null;
  setActiveTab: (tab: NavTab) => void;
  openEstimateForOrder: (orderId: string) => void;
  // Aliases for compatibility
  selectedEmailOrderId?: string | null;
  openEmailForOrder?: (orderId: string) => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  activeTab: "wizard",
  selectedEstimateOrderId: null,
  selectedEmailOrderId: null,

  setActiveTab: (tab) => set({ activeTab: tab }),

  openEstimateForOrder: (orderId) =>
    set({
      activeTab: "estimates",
      selectedEstimateOrderId: orderId,
      selectedEmailOrderId: orderId,
    }),

  openEmailForOrder: (orderId) =>
    set({
      activeTab: "estimates",
      selectedEstimateOrderId: orderId,
      selectedEmailOrderId: orderId,
    }),
}));
