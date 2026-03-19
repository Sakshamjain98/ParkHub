import { ListCustomerBookings } from '@ParkHub/ui/src/components/templates/ListCustomerBookings'
import { IsLoggedIn } from '@ParkHub/ui/src/components/organisms/IsLoggedIn'

export default function Page() {
  return (
    <IsLoggedIn>
      <ListCustomerBookings />
    </IsLoggedIn>
  )
}
