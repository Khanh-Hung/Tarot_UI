import { Skeleton } from "@/components/ui/Skeleton";

export default function RootLoading() {
  return (
    <div className="min-h-[85vh] max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-300">
      {/* Top bar header */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-5">
        <div className="space-y-2">
          <Skeleton className="w-48 h-7 rounded-lg" />
          <Skeleton className="w-72 h-4 rounded-md" />
        </div>
        <Skeleton className="w-32 h-10 rounded-xl" />
      </div>

      {/* Hero section */}
      <div className="rounded-3xl border border-white/[0.08] bg-[#17181c] p-8 sm:p-12 space-y-6 text-center flex flex-col items-center">
        <Skeleton className="w-24 h-24 rounded-full" />
        <Skeleton className="w-44 h-5 rounded-full" />
        <Skeleton className="w-72 h-8 rounded-lg" />
        <div className="space-y-2 max-w-md w-full flex flex-col items-center">
          <Skeleton className="w-full h-4 rounded-md" />
          <Skeleton className="w-4/5 h-4 rounded-md" />
        </div>
        <Skeleton className="w-48 h-11 rounded-xl" />
      </div>

      {/* Grid items */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Skeleton className="h-28 rounded-2xl" />
        <Skeleton className="h-28 rounded-2xl" />
        <Skeleton className="h-28 rounded-2xl" />
      </div>
    </div>
  );
}
