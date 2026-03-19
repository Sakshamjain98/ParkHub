'use client'
import { useTakeSkip } from '@ParkHub/util/hooks/pagination'
import { useQuery } from '@apollo/client'
import { AdminsDocument } from '@ParkHub/network/src/gql/generated'
import { ShowData } from '../organisms/ShowData'
import { AdminCard } from '../organisms/admin/AdminCard'
import { RemoveAdminButton } from '../organisms/admin/RemoveAdminButton'
import { CreateAdmin } from '../organisms/admin/CreateAdmin'

export const ManageAdmins = () => {
  const { setSkip, setTake, skip, take } = useTakeSkip(0)

  const { data, loading } = useQuery(AdminsDocument, {
    variables: { skip, take },
  })

  return (
    <div className="space-y-3">
      <div className="flex justify-end mt-6 sm:mt-10 mr-2 sm:mr-0">
        <CreateAdmin />
      </div>
      <ShowData
        loading={loading}
        childrenClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6"
        pagination={{
          skip,
          take,
          resultCount: data?.admins.length,
          totalCount: data?.adminsCount,
          setSkip,
          setTake,
        }}
        title={'Manage admins'}
      >
        {data?.admins.map((admin) => (
          <AdminCard key={admin.uid} admin={admin}>
            <div className="flex justify-end">
              <RemoveAdminButton uid={admin.uid} />
            </div>
          </AdminCard>
        ))}
      </ShowData>
    </div>
  )
}
