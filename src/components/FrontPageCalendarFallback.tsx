export const FrontPageCalendarFallback = () => (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
    {Array.from({ length: 8 }).map((_, index) => (
      <div
        key={`frontpage-calendar-fallback-${index}`}
        className="flex h-40 animate-pulse flex-col rounded-lg bg-neutral-200/80 p-6 shadow-lg dark:bg-neutral-700/40"
      >
        <div className="mb-4 h-5 w-3/4 rounded bg-neutral-300 dark:bg-neutral-600" />
        <div className="mt-auto space-y-2">
          <div className="h-4 w-1/2 rounded bg-neutral-300 dark:bg-neutral-600" />
          <div className="h-4 w-1/3 rounded bg-neutral-300 dark:bg-neutral-600" />
        </div>
      </div>
    ))}
  </div>
)
