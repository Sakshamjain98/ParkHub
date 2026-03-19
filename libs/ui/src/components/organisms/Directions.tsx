import { useDebounce } from '@ParkHub/util/hooks/async'
import { LatLng, LngLatTuple } from '@ParkHub/util/types'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Source, Layer } from 'react-map-gl/maplibre'

export const Directions = ({
  origin,
  destination,
  setDistance,
  sourceId,
}: {
  origin?: LatLng
  destination?: Partial<LatLng>
  setDistance?: (distance?: number) => void
  sourceId: string
}) => {
  const [coordinates, setCoordinates] = useState<LngLatTuple[]>([])
  const prevDistanceRef = useRef<number | undefined>(undefined)
  const prevOriginRef = useRef<LatLng | undefined>(undefined)
  const prevDestinationRef = useRef<Partial<LatLng> | undefined>(undefined)

  const [originDebounced] = useDebounce(origin, 400)
  const [destinationDebounced] = useDebounce(destination, 400)

  useEffect(() => {
    if (
      !originDebounced ||
      !destinationDebounced ||
      (prevOriginRef.current &&
        prevOriginRef.current.lat === originDebounced.lat &&
        prevOriginRef.current.lng === originDebounced.lng &&
        prevDestinationRef.current &&
        prevDestinationRef.current.lat === destinationDebounced.lat &&
        prevDestinationRef.current.lng === destinationDebounced.lng)
    ) {
      return
    }

    prevOriginRef.current = originDebounced
    prevDestinationRef.current = destinationDebounced
    ;(async () => {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${originDebounced.lng},${originDebounced.lat};${destinationDebounced.lng},${destinationDebounced.lat}?steps=true&overview=full&geometries=geojson`,
      )

      const data = await response.json()

      const coordinates = data?.routes?.[0]?.geometry?.coordinates || []

      const newDistance = data?.routes?.[0]?.distance || 0

      setCoordinates(coordinates)

      if (newDistance !== prevDistanceRef.current && setDistance) {
        setDistance(newDistance)
        prevDistanceRef.current = newDistance
      }
    })()
  }, [originDebounced, destinationDebounced, setDistance])

  const dataOne = useMemo(
    () => ({
      type: 'Feature' as const,
      properties: {},
      geometry: {
        type: 'LineString' as const,
        coordinates,
      },
    }),
    [coordinates],
  )

  return (
    <Source id={sourceId} type="geojson" data={dataOne}>
      <Layer
        id={sourceId}
        type="line"
        source={sourceId}
        paint={{
          'line-color': 'rgb(0,0,0)',
          'line-width': 2,
        }}
      />
    </Source>
  )
}
