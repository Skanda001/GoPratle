import { RequirementWizard } from "@/components/requirement-form/RequirementWizard";

/**
 * Home page — server component shell.
 * Renders the page heading server-side for SEO, then hands off to the
 * client-side wizard which owns all interactive state.
 */
export default function Home() {
  return (
    <div className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Page heading — rendered server-side */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Tell us what you&apos;re planning
        </h1>
        <p className="mt-2 text-slate-500 text-sm sm:text-base">
          Share a few details about your event, and tell us which professionals you need.
        </p>
      </div>

      {/* Wizard — client component */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-8">
        <RequirementWizard />
      </div>
    </div>
  );
}
