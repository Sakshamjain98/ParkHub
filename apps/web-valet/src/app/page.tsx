'use client'
import { IsLoggedIn } from '@ParkHub/ui/src/components/organisms/IsLoggedIn'
import { IsValet } from '@ParkHub/ui/src/components/organisms/IsValet'
import { ValetHome } from '@ParkHub/ui/src/components/templates/ValetHome'

export default function Home() {
  return (
    <main>
      <IsLoggedIn>
        {(uid) => (
          <IsValet uid={uid}>
            <ValetHome uid={uid} />
          </IsValet>
        )}
      </IsLoggedIn>
    </main>
  )
}
