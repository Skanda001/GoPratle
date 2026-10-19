"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { LineItem } from "@/components/ui/PriceBreakdown";
import type { Category, DateMode } from "@/types";
import { getMyRequirements } from "@/lib/api";

export interface OrderHistoryItem {
  id: string;
  createdAt: string;
  eventName: string;
  eventType: string;
  category: Category;
  startDate: string;
  endDate?: string;
  dateMode: DateMode;
  location: string;
  venue?: string;
  status: "Order Placed" | "Matching Vendors" | "In Review" | "Confirmed";
  estimatedTotal: number;
  breakdownItems: LineItem[];
  emailId?: string;
}

interface OrderHistoryState {
  orders: OrderHistoryItem[];
  isLoading: boolean;
  addOrder: (order: OrderHistoryItem) => void;
  fetchMyOrders: (token: string) => Promise<void>;
  getOrderById: (id: string) => OrderHistoryItem | undefined;
}

export const useOrderHistoryStore = create<OrderHistoryState>()(
  persist(
    (set, get) => ({
      orders: [],
      isLoading: false,

      addOrder: (newOrder) => {
        set((state) => ({
          orders: [newOrder, ...state.orders.filter((o) => o.id !== newOrder.id)],
        }));
      },

      fetchMyOrders: async (token: string) => {
        set({ isLoading: true });
        const res = await getMyRequirements(token);
        set({ isLoading: false });

        if (res.ok && res.data) {
          const backendOrders: OrderHistoryItem[] = res.data.map((rec) => {
            const existing = get().orders.find((o) => o.id === rec._id);
            return {
              id: rec._id,
              createdAt: rec.createdAt,
              eventName: rec.eventName,
              eventType: rec.eventType,
              category: rec.category,
              startDate: rec.startDate,
              endDate: rec.endDate,
              dateMode: rec.dateMode,
              location: rec.location,
              venue: rec.venue,
              status: "Order Placed",
              estimatedTotal: existing?.estimatedTotal ?? 0,
              breakdownItems: existing?.breakdownItems ?? [],
            };
          });

          // Merge without losing locally submitted breakdownItems
          set((state) => {
            const mergedMap = new Map<string, OrderHistoryItem>();
            backendOrders.forEach((o) => mergedMap.set(o.id, o));
            state.orders.forEach((o) => {
              if (mergedMap.has(o.id)) {
                mergedMap.set(o.id, { ...mergedMap.get(o.id)!, ...o });
              } else {
                mergedMap.set(o.id, o);
              }
            });
            return { orders: Array.from(mergedMap.values()) };
          });
        }
      },

      getOrderById: (id) => {
        return get().orders.find((o) => o.id === id);
      },
    }),
    {
      name: "gopratle-real-order-history-v1",
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
