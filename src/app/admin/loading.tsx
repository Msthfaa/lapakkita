export default function AdminLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* 4 Kartu Statistik Shimmer */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-neutral-200 bg-white p-5 space-y-3 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-28 rounded bg-neutral-200/70" />
              <div className="h-5 w-5 rounded-full bg-neutral-200/50" />
            </div>
            <div className="h-8 w-16 rounded-md bg-neutral-200/80" />
            <div className="h-3 w-36 rounded bg-neutral-100" />
          </div>
        ))}
      </div>

      {/* Action Banner Shimmer */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-5 w-48 rounded bg-neutral-200/70" />
          <div className="h-4 w-72 rounded bg-neutral-100" />
        </div>
        <div className="h-10 w-40 rounded-lg bg-purple-200/60" />
      </div>
    </div>
  )
}
