export default function CorrespondenceLoading() {
  return (
    <div className="p-6 animate-pulse">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="h-4 w-40 bg-muted rounded" />
        <div className="border border-border rounded-xl overflow-hidden">
          <div className="h-10 bg-muted/30" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 border-t border-border bg-muted/15" />
          ))}
        </div>
      </div>
    </div>
  )
}
