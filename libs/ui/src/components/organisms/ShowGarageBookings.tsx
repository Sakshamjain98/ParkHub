import {
  BookingStatus,
  BookingsForGarageDocument,
  QueryMode,
} from '@ParkHub/network/src/gql/generated'
import { IconSearch } from '@tabler/icons-react'
import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { useTakeSkip } from '@ParkHub/util/hooks/pagination'
import { ShowData } from './ShowData'
import { ManageBookingCard } from './ManageBookingCard'
import { CheckInOutButton } from './CheckInOutButtons'

export const ShowGarageBookings = ({
  title,
  garageId,
  statuses,
  showCheckIn = false,
  showCheckOut = false,
}: {
  title: string
  garageId: number
  statuses: BookingStatus[]
  showCheckIn?: boolean
  showCheckOut?: boolean
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const { take, setTake, skip, setSkip } = useTakeSkip()

  const { data, loading, error } = useQuery(BookingsForGarageDocument, {
    variables: {
      skip,
      take,
      where: {
        status: { in: statuses },
        Slot: {
          is: {
            garageId: { equals: garageId },
          },
        },
        ...(searchTerm && {
          vehicleNumber: {
            contains: searchTerm,
            mode: QueryMode.Insensitive,
          },
        }),
      },
    },
  })

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex justify-center pt-1">
        <div className="flex w-full max-w-xl items-center gap-2 rounded-full border border-gray-200 bg-white px-4 shadow-sm">
          <IconSearch className="text-gray-500" />
          <input
            placeholder="Search vehicle number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow bg-transparent py-3 text-sm font-medium"
          />
        </div>
      </div>
      <ShowData
        loading={loading}
        error={error?.message}
        title={title}
        childrenClassName="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3"
        pagination={{
          skip,
          take,
          resultCount: data?.bookingsForGarage.length,
          totalCount: data?.bookingsCount.count,
          setSkip,
          setTake,
        }}
      >
        {data?.bookingsForGarage.map((booking) => (
          <div key={booking.id}>
            <ManageBookingCard booking={booking} />
            {showCheckIn ? (
              <CheckInOutButton
                status={BookingStatus.CheckedIn}
                buttonText="CHECK IN"
                bookingId={booking.id}
              />
            ) : null}
            {showCheckOut ? (
              <CheckInOutButton
                status={BookingStatus.CheckedOut}
                buttonText="CHECK OUT"
                bookingId={booking.id}
              />
            ) : null}
          </div>
        ))}
      </ShowData>
    </div>
  )
}
