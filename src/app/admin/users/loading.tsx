export default function AdminUsersLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* 3 User Stats Shimmer */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-xs"
          >
            <div className="h-10 w-10 rounded-lg bg-neutral-200/60" />
            <div className="space-y-1.5 flex-1">
              <div className="h-6 w-12 rounded bg-neutral-200/80" />
              <div className="h-3 w-28 rounded bg-neutral-100" />
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filter Bar Shimmer */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-xs">
        <div className="h-10 flex-1 max-w-md rounded-lg bg-neutral-100" />
        <div className="flex gap-2">
          <div className="h-8 w-24 rounded-lg bg-neutral-100" />
          <div className="h-8 w-24 rounded-lg bg-neutral-100" />
        </div>
      </div>

      {/* Table Shimmer */}
      <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-neutral-200/70" />
              <div className="space-y-1">
                <div className="h-4 w-32 rounded bg-neutral-200/70" />
                <div className="h-3 w-44 rounded bg-neutral-100" />
              </div>
            </div>
            <div className="h-6 w-20 rounded-full bg-neutral-100" />
            <div className="h-6 w-24 rounded-md bg-neutral-100 hidden sm:block" />
            <div className="flex gap-2">
              <div className="h-8 w-20 rounded-md bg-neutral-100" />
              <div className="h-8 w-14 rounded-md bg-neutral-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
