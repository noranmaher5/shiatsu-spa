export default function AdminLoading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading dashboard">
      <div className="space-y-2">
        <div className="h-8 w-40 animate-pulse rounded-lg bg-secondary/70" />
        <div className="h-4 w-64 animate-pulse rounded bg-secondary/50" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-24 animate-pulse rounded-xl border border-border bg-card/70"
          />
        ))}
      </div>
    </div>
  );
}
