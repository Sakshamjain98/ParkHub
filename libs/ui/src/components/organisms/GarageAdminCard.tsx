import { GaragesQuery } from '@ParkHub/network/src/gql/generated'
import { ReactNode } from 'react'
import { MapLink } from '../molecules/MapLink'
import { IconTypes } from '../molecules/IconTypes'

export const GarageAdminCard = ({
  children,
  garage,
}: {
  children: ReactNode
  garage: GaragesQuery['garages'][0]
}) => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col gap-2 p-3">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[11px] font-medium text-gray-600">#{garage.id}</p>
          {garage.verification?.verified ? (
            <span className="rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-700">
              Verified
            </span>
          ) : (
            <span className="rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-medium text-red-700">
              Not Verified
            </span>
          )}
        </div>

        <div>
          <h2 className="text-md font-semibold leading-tight text-black">
            {garage.displayName}
          </h2>
          {garage.address ? (
            <MapLink
              waypoints={[garage.address]}
              className="mt-0.5 inline-block text-xs leading-tight text-gray-600 hover:underline underline-offset-4"
            >
              {garage.address.address}
            </MapLink>
          ) : (
            <p className="mt-0.5 text-sm text-gray-500">No address added</p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-sm text-gray-600">
          {garage.slotCounts.length === 0 ? (
            <div>No slots</div>
          ) : null}
          {garage.slotCounts.map((slot, index) => (
            <div
              key={index}
              className="inline-flex items-center gap-1 rounded-md bg-gray-50 px-2 py-1"
            >
              {IconTypes[slot.type]}
              <span className="text-xs font-medium">{slot.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100 bg-gray-50/70 p-1">
        <div className="flex justify-end">{children}</div>
      </div>
    </div>
  )
}
