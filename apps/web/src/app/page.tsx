'use client'
import { CarScene } from '@ParkHub/3d/src/scenes/CarScene'

export default function Home() {
  return (
    <main className="fixed inset-x-0 bottom-0 top-16 z-0 overflow-hidden">
      <div className="absolute inset-0">
        <CarScene />
      </div>
    </main>
  )
}
