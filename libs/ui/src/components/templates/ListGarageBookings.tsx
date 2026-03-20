'use client'
import { useState } from 'react'
import { Tab, TabPanel, Tabs } from '../molecules/Tabs'
import { ShowGarageBookings } from '../organisms/ShowGarageBookings'
import { BookingStatus } from '@ParkHub/network/src/gql/generated'

export interface IListBookingsProps {
  garageId: number
}
export const ListGarageBookings = ({ garageId }: IListBookingsProps) => {
  const [value, setValue] = useState<0 | 1 | 2>(0)

  return (
    <div className="space-y-2 sm:space-y-3">
      <div className="rounded-lg border border-gray-200 bg-white px-3 shadow-sm sm:px-4">
        <Tabs
          value={value}
          onChange={(e, v) => setValue(v)}
          aria-label="bookings"
        >
          <Tab label={'IN'} />
          <Tab label={'OUT'} />
          <Tab label={'RESOLVED'} />
        </Tabs>
      </div>
      <TabPanel value={value} index={0}>
        <ShowGarageBookings
          title={'Inbound bookings'}
          garageId={garageId}
          statuses={[
            BookingStatus.Booked,
            BookingStatus.ValetPickedUp,
            BookingStatus.ValetAssignedForCheckIn,
          ]}
          showCheckIn
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ShowGarageBookings
          title={'Outbound bookings'}
          garageId={garageId}
          statuses={[
            BookingStatus.CheckedIn,
            BookingStatus.ValetAssignedForCheckOut,
          ]}
          showCheckOut
        />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <ShowGarageBookings
          title={'Resolved bookings'}
          garageId={garageId}
          statuses={[BookingStatus.CheckedOut]}
        />
      </TabPanel>
    </div>
  )
}
