export default function Loading() {
  return (
    <div className="w-full">
      {/* Sleek top loading progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-emerald-100/60 overflow-hidden">
        <div className="h-full bg-emerald-600 animate-pulse w-full" />
      </div>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <div className="h-7 w-48 bg-neutral-200/70 rounded-md animate-pulse" />
        <div className="h-4 w-72 bg-neutral-200/50 rounded-md animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 rounded-xl border border-neutral-200 bg-white p-4 space-y-3 animate-pulse">
              <div className="h-36 w-full rounded-lg bg-neutral-100" />
              <div className="h-4 w-3/4 bg-neutral-200 rounded" />
              <div className="h-4 w-1/2 bg-neutral-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
