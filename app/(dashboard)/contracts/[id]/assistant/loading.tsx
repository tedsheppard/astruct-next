export default function AssistantLoading() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 animate-pulse">
      <div className="w-full max-w-[680px] space-y-8">
        <div className="h-10 w-40 bg-muted rounded-lg mx-auto" />
        <div className="h-32 bg-muted/60 rounded-2xl" />
        <div className="flex justify-center gap-2">
          <div className="h-8 w-28 bg-muted/40 rounded-full" />
          <div className="h-8 w-32 bg-muted/40 rounded-full" />
          <div className="h-8 w-36 bg-muted/40 rounded-full" />
          <div className="h-8 w-24 bg-muted/40 rounded-full" />
        </div>
      </div>
    </div>
  )
}
