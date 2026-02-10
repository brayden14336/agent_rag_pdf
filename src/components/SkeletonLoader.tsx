export default function SkeletonLoader() {
  return (
    <div className="flex w-full justify-start">
      <div className="w-full max-w-[42rem] rounded-2xl border border-white/10 bg-zinc-800/85 px-4 py-3">
        <div className="h-3 w-24 animate-pulse rounded bg-zinc-700/90" />
        <div className="mt-3 space-y-2">
          <div className="h-3 w-full animate-pulse rounded bg-zinc-700/80" />
          <div className="h-3 w-[92%] animate-pulse rounded bg-zinc-700/80" />
          <div className="h-3 w-[72%] animate-pulse rounded bg-zinc-700/80" />
        </div>
      </div>
    </div>
  )
}
