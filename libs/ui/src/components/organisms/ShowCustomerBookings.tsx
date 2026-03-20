import {
  BookingStatus,
  BookingsForCustomerDocument,
} from '@ParkHub/network/src/gql/generated'
import { useTakeSkip } from '@ParkHub/util/hooks/pagination'
import { useSession } from 'next-auth/react'
import { useLazyQuery, useQuery } from '@apollo/client'
import { useEffect } from 'react'
import { ShowData } from './ShowData'
import { CustomerBookingCard } from './CustomerBookingCard'

export const ShowCustomerBookings = ({
  title,
  statuses,
}: {
  title: string
  statuses: BookingStatus[]
}) => {
  const session = useSession()
  const uid = session.data?.user?.uid

  const { setSkip, setTake, skip, take } = useTakeSkip()

  const { loading, data, error } = useQuery(BookingsForCustomerDocument, {
    variables: {
      skip,
      take,
      where: {
        status: {
          in: statuses,
        },
      },
    },
  })

  return (
    <ShowData
      error={error?.message}
      loading={loading}
      title={title}
      childrenClassName="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3"
      pagination={{
        skip,
        take,
        resultCount: data?.bookingsForCustomer.length || 0,
        totalCount: data?.bookingsCount.count || 0,
        setSkip,
        setTake,
      }}
    >
      {data?.bookingsForCustomer.map((booking) => (
        <CustomerBookingCard key={booking.id} booking={booking} />
      ))}
    </ShowData>
  )
}
