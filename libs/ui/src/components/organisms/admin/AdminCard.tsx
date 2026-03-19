import { AdminsQuery } from '@ParkHub/network/src/gql/generated'
import { ReactNode } from 'react'
import { useSession } from 'next-auth/react'
import { format } from 'date-fns'

type AdminCardProps = {
  admin: AdminsQuery['admins'][number]
  children?: ReactNode
}

export const AdminCard = ({ admin, children }: AdminCardProps) => {
  const session = useSession()
  const uid = session.data?.user?.uid

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="p-2.5">
        <div className="flex items-start justify-between gap-1.5">
          <div>
            <h2 className="text-sm font-semibold leading-tight text-black">
              {admin.user?.name || 'Unknown Admin'}
            </h2>
            <p className="mt-0.5 text-[10px] text-gray-600">{admin.uid}</p>
          </div>

          {uid === admin.uid ? (
            <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold">
              You
            </span>
          ) : null}
        </div>

        <div className="mt-2.5 grid grid-cols-2 gap-1.5">
          <div className="rounded-md border border-gray-100 bg-gray-50 p-1.5">
            <p className="text-[10px] font-medium text-gray-500">Since</p>
            <p className="mt-0.5 text-xs font-semibold text-black">
              {format(new Date(admin.createdAt), 'PP')}
            </p>
          </div>
          <div className="rounded-md border border-gray-100 bg-gray-50 p-1.5">
            <p className="text-[10px] font-medium text-gray-500">Verifications</p>
            <p className="mt-0.5 text-base font-semibold leading-none text-black">
              {admin.verificationsCount}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 bg-gray-50/60 px-2.5 py-1.5">
        <div className="flex items-center justify-end">{children}</div>
      </div>
    </div>
  )
}
