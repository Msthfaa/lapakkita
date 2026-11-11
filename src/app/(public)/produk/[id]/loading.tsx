export default function ProductDetailLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-28 sm:pt-32 pb-20 sm:px-6 lg:px-8 space-y-8 animate-pulse">
      {/* Breadcrumb Shimmer */}
      <div className="flex items-center gap-2">
        <div className="h-4 w-24 rounded-full bg-neutral-200/60 dark:bg-neutral-800" />
        <div className="h-4 w-4 rounded-full bg-neutral-200/40 dark:bg-neutral-800" />
        <div className="h-4 w-32 rounded-full bg-neutral-200/60 dark:bg-neutral-800" />
      </div>

      {/* Main Detail Grid Shimmer */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Left: Large Image Placeholder */}
        <div className="aspect-square w-full rounded-3xl bg-neutral-200/70 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-800" />

        {/* Right: Info & WhatsApp Button Placeholder */}
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="h-6 w-28 rounded-full bg-emerald-100/70 dark:bg-emerald-950/40" />
            <div className="h-9 w-4/5 rounded-xl bg-neutral-200/80 dark:bg-neutral-800" />
            <div className="h-8 w-1/3 rounded-xl bg-emerald-100 dark:bg-emerald-950/50" />
          </div>

          {/* Seller Card Shimmer */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60 p-5 space-y-3">
            <div className="h-4 w-32 rounded bg-neutral-100 dark:bg-neutral-800" />
            <div className="h-5 w-48 rounded bg-neutral-200/70 dark:bg-neutral-700" />
            <div className="h-4 w-36 rounded bg-neutral-100 dark:bg-neutral-800" />
          </div>

          {/* Description Lines Shimmer */}
          <div className="space-y-2.5 pt-2">
            <div className="h-4 w-full rounded bg-neutral-200/60 dark:bg-neutral-800" />
            <div className="h-4 w-5/6 rounded bg-neutral-200/50 dark:bg-neutral-800" />
            <div className="h-4 w-4/6 rounded bg-neutral-200/50 dark:bg-neutral-800" />
          </div>

          {/* WhatsApp Button Shimmer */}
          <div className="h-14 w-full rounded-2xl bg-emerald-600/30 dark:bg-emerald-600/20" />
        </div>
      </div>
    </div>
  )
}
