import { IsLoggedIn } from '@ParkHub/ui/src/components/organisms/IsLoggedIn'
import { IsManager } from '@ParkHub/ui/src/components/organisms/IsManager'
import { ListGarageBookings } from '@ParkHub/ui/src/components/templates/ListGarageBookings'

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const garageId = Number(searchParams['garageId'])

  return (
    <main className="mx-auto w-full max-w-7xl px-3 pb-8 pt-3 sm:px-6 sm:pt-4">
      <IsLoggedIn>
        <IsManager>
          <ListGarageBookings garageId={garageId} />
        </IsManager>
      </IsLoggedIn>
    </main>
  )
}
