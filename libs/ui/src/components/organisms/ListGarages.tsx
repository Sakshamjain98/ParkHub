import {
  GaragesDocument,
  MyCompanyQuery,
} from '@ParkHub/network/src/gql/generated'
import { useTakeSkip } from '@ParkHub/util/hooks/pagination'
import { useQuery } from '@apollo/client'
import {} from '@ParkHub/network/src/gql/generated'
import { ShowData } from './ShowData'
import { IconPlus } from '@tabler/icons-react'
import Link from 'next/link'
import { GarageCard } from './GarageCard'

export const ListGarages = ({
  companyId,
}: {
  companyId: MyCompanyQuery['myCompany']['id']
}) => {
  const { setSkip, setTake, skip, take } = useTakeSkip()
  const { data, loading, error } = useQuery(GaragesDocument, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
    variables: {
      skip,
      take,
      where: { companyId: { equals: companyId } },
    },
  })
  return (
    <ShowData
      error={error?.message}
      loading={loading}
      pagination={{
        skip,
        take,
        resultCount: data?.garages.length,
        totalCount: data?.garagesCount.count,
        setSkip,
        setTake,
      }}
      childrenClassName="grid grid-cols-1 gap-4 pt-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3"
      title={
        <div className="flex items-center gap-3">
          <div>Garages</div>
          <Link
            href="/new-garage"
            className="rounded-full border border-gray-300 bg-white p-0.5 shadow-sm"
          >
            <IconPlus />
          </Link>
        </div>
      }
    >
      {data?.garages.map((garage) => (
        <GarageCard key={garage.id} garage={garage} />
      ))}
    </ShowData>
  )
}
