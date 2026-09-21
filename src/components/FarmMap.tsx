import { useMemo } from 'react'
import { MapContainer, Marker, Polygon, TileLayer, Tooltip, useMap } from 'react-leaflet'
import L from 'leaflet'
import { MapPin } from 'lucide-react'

const pinIcon = L.divIcon({
  className: '',
  html: `<div style="transform:translate(-50%,-100%)">
    <svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 0C6.7 0 0 6.7 0 15c0 10.5 15 25 15 25s15-14.5 15-25C30 6.7 23.3 0 15 0z" fill="#1E4D3A"/>
      <circle cx="15" cy="15" r="6" fill="#DDEBDD"/>
    </svg>
  </div>`,
  iconSize: [30, 40],
  iconAnchor: [15, 40],
})

function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap()
  useMemo(() => {
    if (points.length) {
      map.fitBounds(L.latLngBounds(points).pad(0.35), { animate: false })
    }
  }, [map, points])
  return null
}

interface Props {
  /** Null when the farm's location hasn't been set / connected yet. */
  center: [number, number] | null
  boundary: [number, number][] | null
  areaHectares: number | null
  label?: string
  height?: number
  interactive?: boolean
}

export function FarmMap({
  center,
  boundary,
  areaHectares,
  label = 'Your farm',
  height = 360,
  interactive = true,
}: Props) {
  if (!center) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-forest-100 bg-canvas/60 text-center"
        style={{ height }}
      >
        <MapPin className="h-6 w-6 text-forest-300" aria-hidden />
        <p className="text-sm font-medium text-ink">No farm location available yet</p>
        <p className="max-w-xs text-xs text-ink-soft">
          The map will appear once your farm's location is connected.
        </p>
      </div>
    )
  }

  const ring = boundary ?? []

  return (
    <div className="relative overflow-hidden rounded-2xl border border-forest-50">
      <MapContainer
        center={center}
        zoom={15}
        scrollWheelZoom={false}
        dragging={interactive}
        doubleClickZoom={interactive}
        zoomControl={interactive}
        style={{ height, width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {ring.length > 0 && (
          <Polygon
            positions={ring}
            pathOptions={{ color: '#1E4D3A', weight: 2, fillColor: '#8FB996', fillOpacity: 0.28 }}
          />
        )}
        <Marker position={center} icon={pinIcon}>
          <Tooltip direction="top" offset={[0, -38]}>
            {label}
          </Tooltip>
        </Marker>
        <FitBounds points={ring.length ? ring : [center]} />
      </MapContainer>

      {areaHectares != null && (
        <div className="pointer-events-none absolute right-3 top-3 z-[400] flex flex-col items-end gap-2">
          <span className="chip whitespace-nowrap bg-surface/95 text-forest-700 shadow-soft">
            Farm area · {areaHectares.toFixed(1)} ha
          </span>
        </div>
      )}
    </div>
  )
}
