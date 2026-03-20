import { CompanyValetsQuery } from '@ParkHub/network/src/gql/generated'
import { format } from 'date-fns'
import Image from 'next/image'

export interface IValetCardProps {
  valet: CompanyValetsQuery['companyValets'][0]
}

export const ValetCard = ({ valet }: IValetCardProps) => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="aspect-square overflow-hidden bg-gray-100">
        <Image
          className="h-full w-full object-cover"
          width={300}
          height={300}
          src={valet.image || '/valet.jpeg'}
          alt={valet.displayName}
        />
      </div>
      <div className="flex flex-col gap-2 p-3">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[11px] font-medium text-gray-600">#{valet.uid}</p>
          <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700">
            Active
          </span>
        </div>

        <div>
          <h2 className="text-md font-semibold leading-tight text-black">
            {valet.displayName}
          </h2>
          <p className="mt-0.5 text-xs text-gray-600">
            License: {valet.licenceID}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Joined {format(new Date(valet.createdAt), 'MMM dd, yyyy')}
          </p>
        </div>
      </div>
    </div>
  )
}
