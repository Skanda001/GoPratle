"use client";

import { OrderHistoryView } from "@/components/history/OrderHistoryView";
import { useRouter } from "next/navigation";
import { useNavigationStore } from "@/store/navigationStore";

export default function HistoryPage() {
  const router = useRouter();
  const { openEstimateForOrder, setActiveTab } = useNavigationStore();

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <OrderHistoryView
        onOpenEstimate={(orderId) => {
          openEstimateForOrder(orderId);
          router.push("/");
        }}
        onPostRequirement={() => {
          setActiveTab("wizard");
          router.push("/");
        }}
      />
    </div>
  );
}
