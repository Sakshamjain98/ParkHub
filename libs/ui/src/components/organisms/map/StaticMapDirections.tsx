"use client"

import { LatLng } from '@ParkHub/util/types'
import { Layer, Source } from 'react-map-gl/maplibre'
import { Map } from './Map'
import { Marker } from './MapMarker'

export const StaticMapDirections = ({
  start,
  end,
  padding = 100,
  coordinates,
  className = 'w-full shadow-xl aspect-square',
}: {
  start: LatLng
  end: LatLng
  padding?: number
  coordinates: [number, number][]
  className?: string
}) => {
  if (!coordinates.length) {
    return <div className="w-full bg-gray-100 shadow-xl aspect-square" />
  }

  const routeData = {
    type: 'Feature' as const,
    properties: {},
    geometry: {
      type: 'LineString' as const,
      coordinates,
    },
  }

  const minLng = Math.min(start.lng, end.lng)
  const minLat = Math.min(start.lat, end.lat)
  const maxLng = Math.max(start.lng, end.lng)
  const maxLat = Math.max(start.lat, end.lat)

  return (
    <div className={`${className} overflow-hidden`}>
      <Map
        initialViewState={{
          latitude: (start.lat + end.lat) / 2,
          longitude: (start.lng + end.lng) / 2,
          zoom: 11,
        }}
        height="100%"
        dragPan={false}
        dragRotate={false}
        doubleClickZoom={false}
        touchZoomRotate={false}
        keyboard={false}
        interactive={false}
        onLoad={(e) => {
          e.target.fitBounds(
            [
              [minLng, minLat],
              [maxLng, maxLat],
            ],
            {
              padding: {
                top: padding,
                right: padding,
                bottom: padding,
                left: padding,
              },
              duration: 0,
            },
          )
        }}
      >
        <Source id="static-route" type="geojson" data={routeData}>
          <Layer
            id="static-route-line"
            type="line"
            paint={{
              'line-color': 'rgb(0,0,0)',
              'line-width': 2,
            }}
          />
        </Source>
        <Marker latitude={start.lat} longitude={start.lng} />
        <Marker latitude={end.lat} longitude={end.lng} />
      </Map>
    </div>
  )
}
