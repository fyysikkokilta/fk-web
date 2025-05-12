import { Link } from '@/i18n/navigation'
import type { Page, PageNavigationBlock as PageNavigationBlockType } from '@/payload-types'

interface PageNavigationProps {
  block: PageNavigationBlockType
}

export const PageNavigation = ({ block }: PageNavigationProps) => {
  const { pageNavigation, style } = block

  if (typeof pageNavigation === 'number') {
    return null
  }

  const renderPage = (page: Page, label: string) => {
    if (typeof page === 'string' || typeof page === 'number') {
      return null
    }

    return <Link href={`/${page.path}`}>{label}</Link>
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
    <div className="not-prose text-fk-white grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
      {pageNavigation.pages?.map(
        ({ page, label }) =>
          typeof page === 'object' && (
            <Link
              key={page.id}
              href={`/${page.path}`}
              className="bg-fk-orange hover:bg-fk-red flex aspect-square items-center justify-center px-4 py-2 text-center text-3xl font-bold transition-colors duration-200 hover:scale-120"
            >
              {label}
            </Link>
          )
      )}
    </div>
  )
}
