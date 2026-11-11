export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-pulse">
      {/* Header Shimmer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-6 border-b border-neutral-200/80 dark:border-white/[0.06]">
        <div className="space-y-2">
          <div className="h-5 w-36 rounded-full bg-neutral-200/80 dark:bg-white/[0.05]" />
          <div className="h-8 w-60 rounded-xl bg-neutral-200/80 dark:bg-white/[0.08]" />
          <div className="h-4 w-80 rounded bg-neutral-100 dark:bg-white/[0.03]" />
        </div>
        <div className="flex gap-2.5">
          <div className="h-10 w-36 rounded-xl bg-neutral-200/60 dark:bg-white/[0.05]" />
          <div className="h-10 w-44 rounded-xl bg-emerald-600/30" />
        </div>
      </div>

      {/* 4 Stat Cards Shimmer */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-neutral-200/80 dark:border-white/[0.07] bg-white dark:bg-[#111216] p-4 sm:p-5 space-y-3"
          >
            <div className="flex justify-between items-center">
              <div className="h-4 w-20 rounded bg-neutral-100 dark:bg-white/[0.04]" />
              <div className="h-8 w-8 rounded-lg bg-neutral-100 dark:bg-white/[0.04]" />
            </div>
            <div className="h-7 w-14 rounded-lg bg-neutral-200/70 dark:bg-white/[0.08]" />
            <div className="h-3 w-28 rounded bg-neutral-100 dark:bg-white/[0.03]" />
          </div>
        ))}
      </div>

      {/* List Shimmer */}
      <div className="space-y-4 pt-2">
        <div className="h-5 w-40 rounded bg-neutral-200/80 dark:bg-white/[0.05]" />
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col sm:flex-row gap-4 sm:gap-5 rounded-2xl border border-neutral-200/80 dark:border-white/[0.07] bg-white dark:bg-[#111216] p-4 sm:p-5"
          >
            <div className="h-32 w-full sm:w-36 sm:h-36 rounded-xl bg-neutral-200/60 dark:bg-white/[0.04] shrink-0" />
            <div className="flex-1 space-y-3 py-1">
              <div className="flex gap-2">
                <div className="h-5 w-20 rounded-full bg-neutral-100 dark:bg-white/[0.04]" />
                <div className="h-5 w-24 rounded-full bg-neutral-100 dark:bg-white/[0.04]" />
              </div>
              <div className="h-6 w-1/2 rounded bg-neutral-200/70 dark:bg-white/[0.08]" />
              <div className="h-5 w-1/4 rounded bg-emerald-100 dark:bg-emerald-950/40" />
              <div className="h-6 w-48 rounded-lg bg-neutral-100 dark:bg-white/[0.04]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
