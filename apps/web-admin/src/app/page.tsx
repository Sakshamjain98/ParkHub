import { IsAdmin } from '@ParkHub/ui/src/components/organisms/IsAdmin'
import { AdminHome } from '@ParkHub/ui/src/components/templates/AdminHome'

export default function Home() {
  return (
    <main>
      <IsAdmin>
        <AdminHome />
      </IsAdmin>
    </main>
  )
}
