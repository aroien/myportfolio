export function LoadingSkeleton() {
  return (
    <div className="mx-auto max-w-5xl animate-pulse space-y-4" aria-busy="true" aria-label="Loading">
      <div className="h-9 w-56 rounded-lg bg-surface-2" />
      <div className="h-4 w-80 rounded bg-surface-2" />
      <div className="mt-8 h-20 rounded-2xl bg-surface" />
      <div className="h-20 rounded-2xl bg-surface" />
      <div className="h-20 rounded-2xl bg-surface" />
    </div>
  );
}
