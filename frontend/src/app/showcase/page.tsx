"use client";

import { PreviousWorkShowcase } from "@/components/showcase/PreviousWorkShowcase";
import { useRouter } from "next/navigation";
import { useNavigationStore } from "@/store/navigationStore";

export default function ShowcasePage() {
  const router = useRouter();
  const { setActiveTab } = useNavigationStore();

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <PreviousWorkShowcase
        onPostRequirement={() => {
          setActiveTab("wizard");
          router.push("/");
        }}
      />
    </div>
  );
}
