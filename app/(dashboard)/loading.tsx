export default function DashboardLoading() {
  return (
    <div className="p-6 animate-pulse">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-6 w-48 bg-muted rounded-md" />
            <div className="h-4 w-72 bg-muted/60 rounded-md" />
          </div>
          <div className="h-9 w-28 bg-muted rounded-lg" />
        </div>

        {/* Content skeleton */}
        <div className="space-y-3">
          <div className="h-16 bg-muted rounded-xl" />
          <div className="h-16 bg-muted/80 rounded-xl" />
          <div className="h-16 bg-muted/60 rounded-xl" />
          <div className="h-16 bg-muted/40 rounded-xl" />
        </div>
      </div>
    </div>
  )
}
