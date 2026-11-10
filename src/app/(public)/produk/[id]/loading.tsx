export default function ProductDetailLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-6 animate-pulse">
      {/* Breadcrumb Shimmer */}
      <div className="flex items-center gap-2">
        <div className="h-4 w-20 rounded bg-neutral-200/60" />
        <div className="h-4 w-4 rounded bg-neutral-200/40" />
        <div className="h-4 w-32 rounded bg-neutral-200/60" />
      </div>

      {/* Main Detail Grid Shimmer */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Left: Large Image Placeholder */}
        <div className="aspect-square w-full rounded-2xl bg-neutral-200/70 border border-neutral-200" />

        {/* Right: Info & WhatsApp Button Placeholder */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="h-5 w-24 rounded-full bg-emerald-100/70" />
            <div className="h-8 w-4/5 rounded-lg bg-neutral-200/80" />
            <div className="h-8 w-1/3 rounded-md bg-emerald-100" />
          </div>

          {/* Seller Card Shimmer */}
          <div className="rounded-xl border border-neutral-200 bg-white p-4 space-y-2">
            <div className="h-4 w-28 rounded bg-neutral-100" />
            <div className="h-5 w-48 rounded bg-neutral-200/70" />
            <div className="h-4 w-36 rounded bg-neutral-100" />
          </div>

          {/* Description Lines Shimmer */}
          <div className="space-y-2 pt-2">
            <div className="h-4 w-full rounded bg-neutral-200/60" />
            <div className="h-4 w-5/6 rounded bg-neutral-200/50" />
            <div className="h-4 w-4/6 rounded bg-neutral-200/50" />
          </div>

          {/* WhatsApp Button Shimmer */}
          <div className="h-12 w-full rounded-xl bg-emerald-600/30" />
        </div>
      </div>
    </div>
  )
}
