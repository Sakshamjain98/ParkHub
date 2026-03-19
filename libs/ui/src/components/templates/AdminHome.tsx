'use client'
import { useTakeSkip } from '@ParkHub/util/hooks/pagination'
import { useQuery } from '@apollo/client'
import { GaragesDocument } from '@ParkHub/network/src/gql/generated'
import { ShowData } from '../organisms/ShowData'
import { GarageAdminCard } from '../organisms/GarageAdminCard'
import { VerificationToggle } from '../organisms/admin/VerificationToggle'

export const AdminHome = () => {
  return <ShowGarages />
}

export const ShowGarages = () => {
  const { setSkip, setTake, skip, take } = useTakeSkip()
  const { loading, data, error } = useQuery(GaragesDocument, {
    variables: { skip, take },
  })

  return (
    <ShowData
      error={error?.message}
      title="Garages"
      childrenClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-3"
      loading={loading}
      pagination={{
        resultCount: data?.garages.length || 0,
        totalCount: data?.garagesCount.count || 0,
        setSkip,
        setTake,
        skip,
        take,
      }}
    >
      {data?.garages.map((garage) => (
        <GarageAdminCard key={garage.id} garage={garage}>
          <div className="flex justify-end">
            <VerificationToggle
              garageId={garage.id}
              verified={Boolean(garage?.verification?.verified)}
            />
          </div>
        </GarageAdminCard>
      ))}
    </ShowData>
  )
}
