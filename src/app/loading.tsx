export default function Loading() {
  return (
    <div className="w-full">
      <div className="mx-auto max-w-7xl px-4 pt-28 sm:pt-32 pb-16 sm:px-6 lg:px-8 space-y-6">
        <div className="h-7 w-48 bg-neutral-200/70 dark:bg-neutral-800 rounded-md animate-pulse" />
        <div className="h-4 w-72 bg-neutral-200/50 dark:bg-neutral-800 rounded-md animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 space-y-3 animate-pulse">
              <div className="h-36 w-full rounded-xl bg-neutral-100 dark:bg-neutral-800" />
              <div className="h-4 w-3/4 bg-neutral-200 dark:bg-neutral-700 rounded" />
              <div className="h-4 w-1/2 bg-neutral-100 dark:bg-neutral-800 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
