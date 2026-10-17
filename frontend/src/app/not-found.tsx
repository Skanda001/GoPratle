import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center">
      <p className="text-5xl font-bold text-violet-600 mb-4">404</p>
      <h2 className="text-xl font-semibold text-slate-800 mb-2">Page not found</h2>
      <p className="text-slate-500 text-sm mb-6">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="px-5 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-medium hover:bg-violet-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
      >
        Back to home
      </Link>
    </div>
  );
}
