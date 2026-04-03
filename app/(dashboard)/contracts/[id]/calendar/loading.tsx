export default function CalendarLoading() {
  return (
    <div className="p-6 animate-pulse">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-40 bg-muted rounded-md" />
          <div className="flex gap-2">
            <div className="h-8 w-8 bg-muted rounded-md" />
            <div className="h-8 w-20 bg-muted rounded-md" />
            <div className="h-8 w-8 bg-muted rounded-md" />
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={`h${i}`} className="h-6 bg-muted/30 rounded" />
          ))}
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="h-20 bg-muted/20 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  )
}
