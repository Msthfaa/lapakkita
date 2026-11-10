export default function PublicLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-pulse">
      {/* Hero Banner Shimmer */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-8 sm:p-12 space-y-4 shadow-xs">
        <div className="h-6 w-32 rounded-full bg-emerald-100/70" />
        <div className="h-10 w-3/4 max-w-lg rounded-lg bg-neutral-200/80" />
        <div className="h-5 w-2/3 max-w-md rounded-md bg-neutral-100" />
      </div>

      {/* Search & Filter Bar Shimmer */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between rounded-xl border border-neutral-200 bg-white p-4 shadow-xs">
        <div className="h-10 flex-1 max-w-md rounded-lg bg-neutral-100" />
        <div className="flex gap-2">
          <div className="h-10 w-36 rounded-lg bg-neutral-100" />
          <div className="h-10 w-36 rounded-lg bg-neutral-100" />
        </div>
      </div>

      {/* Grid Kartu Produk Shimmer */}
      <div className="space-y-4">
        <div className="h-6 w-48 rounded bg-neutral-200/60" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xs"
            >
              <div className="h-48 w-full bg-neutral-200/60" />
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="h-3 w-20 rounded bg-neutral-100" />
                  <div className="h-5 w-4/5 rounded bg-neutral-200/70" />
                  <div className="h-4 w-1/2 rounded bg-emerald-100/60" />
                </div>
                <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                  <div className="h-3 w-24 rounded bg-neutral-100" />
                  <div className="h-8 w-20 rounded-md bg-neutral-200/60" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
