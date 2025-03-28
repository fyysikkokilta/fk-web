export const SkipLink = () => {
  return (
    <a
      href="#page-content"
      className="bg-fk-white sr-only z-[1000] block focus-visible:not-sr-only focus-visible:fixed focus-visible:top-0 focus-visible:left-0 focus-visible:size-fit focus-visible:p-2 focus-visible:font-semibold"
    >
      {'Skip to main content'}
    </a>
  )
}
