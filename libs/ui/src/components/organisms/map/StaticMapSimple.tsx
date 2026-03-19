"use client"

import { Marker } from './MapMarker'
import { Map } from './Map'

export const StaticMapSimple = ({
  position,
  className = 'w-full shadow-xl aspect-square',
}: {
  position: { lng: number; lat: number }
  className?: string
}) => {
  if (!position) {
    return <div className="w-full bg-gray-100 shadow-xl aspect-square" />
  }

  return (
    <div className={`${className} overflow-hidden`}>
      <Map
        initialViewState={{
          latitude: position.lat,
          longitude: position.lng,
          zoom: 12,
        }}
        height="100%"
        dragPan={false}
        dragRotate={false}
        doubleClickZoom={false}
        touchZoomRotate={false}
        keyboard={false}
        interactive={false}
      >
        <Marker latitude={position.lat} longitude={position.lng} />
      </Map>
    </div>
  )
}
