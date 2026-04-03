export default function LibraryLoading() {
  return (
    <div className="p-6 animate-pulse">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="h-24 bg-muted/40 rounded-xl border-2 border-dashed border-border" />
        <div className="flex gap-2 flex-wrap">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-7 w-24 bg-muted/40 rounded-full" />
          ))}
        </div>
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
