import { GaragesQuery } from '@ParkHub/network/src/gql/generated'
import { AutoImageChanger } from './AutoImageChanger'
import Link from 'next/link'
import { IconTypes } from '../molecules/IconTypes'
import { CreateManySlotsDialog } from './CreateManySlotsDialog'

export interface IGarageCardProps {
  garage: GaragesQuery['garages'][number]
}

export const GarageCard = ({ garage }: IGarageCardProps) => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md flex flex-col h-full">
      <AutoImageChanger images={garage.images || []} durationPerImage={5000} />

      <div className="p-3 flex-grow flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[11px] font-medium text-gray-600">#{garage.id}</p>
          {garage.slotCounts.length > 0 && (
            <span className="rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-700">
              {garage.slotCounts.reduce((acc, slot) => acc + (slot.count ?? 0), 0)} Slots
            </span>
          )}
        </div>

        <div>
          <h2 className="text-sm font-semibold leading-tight text-black">
            {garage.displayName}
          </h2>
          {garage.description ? (
            <p className="mt-1 text-xs text-gray-600 line-clamp-2">
              {garage.description}
            </p>
          ) : null}
          {garage.address ? (
            <Link
              href={`/bookings?garageId=${garage.id}`}
              className="mt-1 inline-block text-xs leading-tight text-gray-600 hover:underline underline-offset-4"
            >
              {garage.address.address}
            </Link>
          ) : (
            <p className="mt-1 text-xs text-gray-500">No address added</p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {garage.slotCounts.length === 0 ? (
            <div className="text-xs text-gray-500">No slots added</div>
          ) : null}
          {garage.slotCounts.map((slot, index) => (
            <div
              key={index}
              className="inline-flex items-center gap-1.5 rounded-md bg-gray-50 px-2 py-1 text-xs"
            >
              {IconTypes[slot.type]}
              <span className="font-medium">{slot.count ?? 0}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100 bg-gray-50/70 p-2 flex gap-2">
        <Link
          href={`/bookings?garageId=${garage.id}`}
          className="flex-1 py-1.5 px-2 text-center text-xs font-medium rounded-md hover:bg-gray-200 transition-colors"
        >
          Bookings
        </Link>
        <CreateManySlotsDialog garageId={garage.id} />
      </div>
    </div>
  )
}
