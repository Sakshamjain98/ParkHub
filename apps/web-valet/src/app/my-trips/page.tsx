'use client'
import { IsLoggedIn } from '@ParkHub/ui/src/components/organisms/IsLoggedIn'
import { IsValet } from '@ParkHub/ui/src/components/organisms/IsValet'
import { ValetTrips } from '@ParkHub/ui/src/components/templates/ValetTrips'

export default function Page() {
  return (
    <main>
      <IsLoggedIn>
        {(uid) => (
          <IsValet uid={uid}>
            <ValetTrips uid={uid} />
          </IsValet>
        )}
      </IsLoggedIn>
    </main>
  )
}
