import { Link } from '@/i18n/navigation'
import type { Page, PageNavigationBlock as PageNavigationBlockType } from '@/payload-types'

interface PageNavigationProps {
  block: PageNavigationBlockType
}

// Prefetches are disabled so that, for example, fuksi pages
// don't cause massive performance hits when a user goes to
// one page and the server renders ALL of them :D

export const PageNavigation = ({ block }: PageNavigationProps) => {
  const { pageNavigation, style } = block

  if (typeof pageNavigation === 'number') {
    return null
  }

  const renderPage = (page: Page, label: string) => {
    if (typeof page === 'string' || typeof page === 'number') {
      return null
    }

    return (
      <Link prefetch={false} href={`/${page.path}`}>
        {label}
      </Link>
    )
  }

  if (style === 'links') {
    return (
      <nav className="list-disc pl-4">
        <ul>
          {pageNavigation.pages?.map(
            ({ page, label }) =>
              typeof page === 'object' && <li key={page.id}>{renderPage(page, label)}</li>
          )}
        </ul>
      </nav>
    )
  }

  return (
    <div className="not-prose text-fk-white grid grid-cols-3 gap-x-4 gap-y-8 sm:grid-cols-6 md:grid-cols-9">
      {pageNavigation.pages?.map(
        ({ page, label }) =>
          typeof page === 'object' && (
            <Link
              key={page.id}
              href={`/${page.path}`}
              prefetch={false}
              className="text-fk-white bg-fk-orange-dark hover:bg-fk-orange flex aspect-square items-center justify-center text-center text-3xl font-bold transition-colors duration-200 hover:scale-110"
            >
              {label}
            </Link>
          )
      )}
    </div>
  )
}
