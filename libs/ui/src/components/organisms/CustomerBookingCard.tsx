import { BookingsForCustomerQuery } from '@ParkHub/network/src/gql/generated'
import { StartEndDateCard } from './DateCard'
import { MapLink } from '../molecules/MapLink'
import { StaticMapSimple } from './map/StaticMapSimple'
import { TitleStrongValue, TitleValue } from '../atoms/TitleValue'
import { Reveal } from '../molecules/Reveal'
import { Accordion } from '../atoms/Accordion'
import { format } from 'date-fns'

export interface IBookingCardProps {
  booking: NonNullable<BookingsForCustomerQuery['bookingsForCustomer']>[number]
}

export const CustomerBookingCard = ({ booking }: IBookingCardProps) => {
  const lat = booking.slot.garage.address?.lat || 0
  const lng = booking.slot.garage.address?.lng || 0

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-1 flex-col gap-3 p-3 sm:p-4">
        <StartEndDateCard
          startTime={booking.startTime}
          endTime={booking.endTime}
        />
        <div className="h-36 overflow-hidden rounded-md border border-gray-100">
          <MapLink waypoints={[{ lat, lng }]}>
            <StaticMapSimple
              position={{
                lat,
                lng,
              }}
              className="h-full w-full object-cover"
            />
          </MapLink>
        </div>

        <div className="grid w-full grid-cols-1 gap-2.5 sm:grid-cols-2">
          <div className="rounded-md border border-gray-100 bg-gray-50 p-2">
            <TitleStrongValue title={'Slot'}>
              {booking.slot.displayName}
            </TitleStrongValue>
          </div>
          <div className="rounded-md border border-gray-100 bg-gray-50 p-2">
            <TitleStrongValue title={'Vehicle number'}>
              {booking.vehicleNumber}
            </TitleStrongValue>
          </div>

          <div className="rounded-md border border-gray-100 bg-gray-50 p-2">
            <TitleStrongValue title={'Address'}>
              <div>
                {booking.slot.garage.address?.address}
                <div className="text-gray text-xs">
                  {lat.toFixed(2)} {lng.toFixed(2)}
                </div>
              </div>
            </TitleStrongValue>
          </div>
          <div className="rounded-md border border-gray-100 bg-gray-50 p-2">
            <TitleStrongValue title={'Code'}>
              <Reveal secret={booking.passcode || ''} />
            </TitleStrongValue>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 bg-gray-50/70 p-3 sm:p-4">
        <Accordion
          defaultOpen={false}
          title={
            <TitleStrongValue title={'Status'}>
              <div className="font-bold">
                {booking.status.split('_').join(' ')}
              </div>
            </TitleStrongValue>
          }
        >
          <div className="flex flex-col gap-2.5">
            {booking.bookingTimeline.map((timeline) => (
              <div key={timeline.timestamp}>
                <TitleValue title={timeline.status}>
                  {format(new Date(timeline.timestamp), 'PPp')}
                </TitleValue>
              </div>
            ))}
          </div>
        </Accordion>
      </div>
    </div>
  )
}
