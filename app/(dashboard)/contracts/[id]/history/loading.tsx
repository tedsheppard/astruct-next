export default function HistoryLoading() {
  return (
    <div className="p-6 animate-pulse">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="space-y-2">
          <div className="h-6 w-36 bg-muted rounded-md" />
          <div className="h-4 w-64 bg-muted/60 rounded-md" />
        </div>
        <div className="border border-border rounded-xl overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 border-b border-border bg-muted/15" />
          ))}
        </div>
      </div>
    </div>
  )
}
