export default function SettingsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-7 w-32 bg-muted rounded-md" />
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2"><div className="h-3 w-20 bg-muted/60 rounded" /><div className="h-10 bg-muted rounded-lg" /></div>
        <div className="space-y-2"><div className="h-3 w-24 bg-muted/60 rounded" /><div className="h-10 bg-muted rounded-lg" /></div>
        <div className="space-y-2"><div className="h-3 w-16 bg-muted/60 rounded" /><div className="h-10 bg-muted rounded-lg" /></div>
        <div className="space-y-2"><div className="h-3 w-20 bg-muted/60 rounded" /><div className="h-10 bg-muted rounded-lg" /></div>
      </div>
    </div>
  )
}
