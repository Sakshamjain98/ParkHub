import { ManageValets } from '@ParkHub/ui/src/components/templates/ManageValets'
import { IsLoggedIn } from '@ParkHub/ui/src/components/organisms/IsLoggedIn'

export default function Page() {
  return (
    <IsLoggedIn>
      <main className="mx-auto w-full max-w-7xl px-3 pb-8 pt-3 sm:px-6 sm:pt-4">
        <ManageValets />
      </main>
    </IsLoggedIn>
  )
}
