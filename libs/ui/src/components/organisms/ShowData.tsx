import { AlertSection } from '../molecules/AlertSection'
import { LoaderPanel } from '../molecules/Loader'
import { NoResults } from '../molecules/NoResults'
import { Pagination } from '@mui/material'

interface ShowDataProps {
  error?: string
  loading?: boolean
  pagination: {
    setSkip: (skip: number) => void
    setTake: (take: number) => void
    skip: number
    take: number
    resultCount?: number
    totalCount?: number
  }
  title?: React.ReactNode
  children: React.ReactNode
  childrenClassName?: string
}

export const ShowData = ({
  error,
  loading,
  pagination,
  title,
  children,
  childrenClassName = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3',
}: ShowDataProps) => {
  const { setSkip, setTake, skip, take, resultCount, totalCount } = pagination

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number,
  ) => {
    setSkip((page - 1) * take)
  }

  const totalPages = Math.ceil((totalCount || 0) / take)

  return (
    <section className="space-y-2.5 px-2 pb-4 pt-4 sm:px-0 sm:pt-5">
      <div className="flex items-end justify-between gap-3">
        <h2 className="text-xl font-semibold tracking-tight text-black">{title}</h2>
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
          {totalCount || 0} total
        </p>
      </div>

      {loading && <LoaderPanel />}
      {!loading && !error && resultCount === 0 && <NoResults />}

      {error && (
        <AlertSection>
          Oops. Something went wrong.{' '}
          <span className="text-xs">Psst. {error}</span>
        </AlertSection>
      )}

      <div className={childrenClassName}>{children}</div>

      {totalPages > 1 ? (
        <div className="flex justify-center pb-1 pt-2.5">
          <Pagination
            count={totalPages}
            showFirstButton
            showLastButton
            page={skip / take + 1}
            onChange={handlePageChange}
          />
        </div>
      ) : null}
    </section>
  )
}
