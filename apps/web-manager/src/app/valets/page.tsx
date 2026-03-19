import { ManageValets } from '@ParkHub/ui/src/components/templates/ManageValets'
import { IsLoggedIn } from '@ParkHub/ui/src/components/organisms/IsLoggedIn'

export default function Page() {
  return (
    <IsLoggedIn>
      <ManageValets />
    </IsLoggedIn>
  )
}
