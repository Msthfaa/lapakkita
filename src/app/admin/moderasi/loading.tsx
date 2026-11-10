export default function ModerationLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Moderation Tabs Shimmer */}
      <div className="flex gap-2 border-b border-neutral-200 pb-3">
        <div className="h-9 w-36 rounded-lg bg-neutral-200/70" />
        <div className="h-9 w-36 rounded-lg bg-neutral-100" />
        <div className="h-9 w-36 rounded-lg bg-neutral-100" />
      </div>

      {/* Moderation List Shimmer */}
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col sm:flex-row gap-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-xs"
          >
            <div className="h-28 w-28 shrink-0 rounded-lg bg-neutral-200/70" />
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-5 w-24 rounded-full bg-amber-100/70" />
                <div className="h-5 w-20 rounded bg-neutral-100" />
              </div>
              <div className="h-6 w-1/2 rounded bg-neutral-200/80" />
              <div className="h-4 w-1/3 rounded bg-emerald-100" />
              <div className="h-3 w-2/3 rounded bg-neutral-100" />
            </div>
            <div className="flex sm:flex-col gap-2 shrink-0 self-end sm:self-center">
              <div className="h-9 w-24 rounded-lg bg-emerald-600/30" />
              <div className="h-9 w-24 rounded-lg bg-rose-600/20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
