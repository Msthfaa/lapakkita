export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6 animate-pulse">
      {/* Header Shimmer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div className="space-y-1.5">
          <div className="h-7 w-48 rounded-lg bg-neutral-200/80" />
          <div className="h-4 w-72 rounded bg-neutral-100" />
        </div>
        <div className="h-10 w-44 rounded-lg bg-emerald-600/30" />
      </div>

      {/* Grid Produk Shimmer */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 pt-2">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col rounded-xl border border-neutral-200 bg-white p-4 shadow-xs space-y-3"
          >
            <div className="h-44 w-full rounded-lg bg-neutral-200/60" />
            <div className="flex items-center justify-between">
              <div className="h-5 w-24 rounded-full bg-neutral-100" />
              <div className="h-4 w-16 rounded bg-neutral-100" />
            </div>
            <div className="h-5 w-3/4 rounded bg-neutral-200/70" />
            <div className="h-5 w-1/3 rounded bg-emerald-100" />
            <div className="pt-2 border-t border-neutral-100 flex justify-end gap-2">
              <div className="h-8 w-16 rounded-md bg-neutral-100" />
              <div className="h-8 w-16 rounded-md bg-neutral-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
