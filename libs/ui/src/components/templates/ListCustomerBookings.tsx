'use client'
import { Tab, Tabs, TabPanel } from '../molecules/Tabs'
import { useState } from 'react'
import { ShowCustomerBookings } from '../organisms/ShowCustomerBookings'
import { BookingStatus } from '@ParkHub/network/src/gql/generated'

export const ListCustomerBookings = () => {
  const [value, setValue] = useState<0 | 1>(1)
  return (
    <div className="space-y-2 sm:space-y-3">
      <div className="rounded-lg border border-gray-200 bg-white px-3 shadow-sm sm:px-4">
        <Tabs
          value={value}
          onChange={(e, v) => setValue(v)}
          aria-label="bookings"
        >
          <Tab label={'PAST'} />
          <Tab label={'ON GOING'} />
        </Tabs>
      </div>
      <TabPanel value={value} index={0}>
        <ShowCustomerBookings
          title={'Past bookings'}
          statuses={[BookingStatus.CheckedOut, BookingStatus.ValetReturned]}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ShowCustomerBookings
          title={'On going bookings'}
          statuses={[
            BookingStatus.Booked,
            BookingStatus.ValetPickedUp,
            BookingStatus.ValetAssignedForCheckIn,
            BookingStatus.CheckedIn,
            BookingStatus.ValetAssignedForCheckOut,
          ]}
        />
      </TabPanel>
    </div>
  )
}
