"use client"

import maplibregl from 'maplibre-gl'
import MapGl from 'react-map-gl/maplibre'

type MapProps = React.ComponentProps<typeof MapGl> & { height?: string }

export const Map = ({ height = '100vh', ...props }: MapProps) => {
  const defaultStyleUrl =
    process.env.NEXT_PUBLIC_MAP_STYLE_URL ||
    'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json'

  return (
    <MapGl
      {...props}
      mapLib={maplibregl}
      mapStyle={defaultStyleUrl}
      style={{ width: '100%', height, backgroundColor: '#f3f4f6' }}
      scrollZoom={false}
    >
      {props.children}
    </MapGl>
  )
}
