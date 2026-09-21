import { useEffect, useMemo, useState } from 'react'
import { MapContainer, Polygon, TileLayer, Tooltip } from 'react-leaflet'
import { Info, Layers, MapPin } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { ChartCard } from '../components/ChartCard'
import { LoadingState, EmptyState, ErrorState } from '../components/states'
import { useFarm } from '../context/FarmContext'
import { usePrediction } from '../context/PredictionContext'
import { getRegionalInsights, type RegionalInsights } from '../lib/api'

type LayerKey = 'soc' | 'moisture' | 'temperature' | 'rainfall' | 'landuse'

const LAYERS: { key: LayerKey; label: string; unit: string }[] = [
  { key: 'soc', label: 'Soil Carbon', unit: 'g/kg' },
  { key: 'moisture', label: 'Soil Moisture', unit: '% vol' },
  { key: 'temperature', label: 'Temperature', unit: '°C' },
  { key: 'rainfall', label: 'Rainfall', unit: 'mm/yr' },
  { key: 'landuse', label: 'Land Use', unit: '' },
]

// SOC legend (g/kg) — matches the ranges in the brief.
const SOC_LEGEND = [
  { label: '25+', color: '#173D2E' },
  { label: '20–25', color: '#2E6A4C' },
  { label: '15–20', color: '#4E8C6C' },
  { label: '10–15', color: '#8FB996' },
  { label: '5–10', color: '#C7B38C' },
  { label: '<5', color: '#E1975B' },
]

function socColor(gkg: number) {
  if (gkg >= 25) return SOC_LEGEND[0].color
  if (gkg >= 20) return SOC_LEGEND[1].color
  if (gkg >= 15) return SOC_LEGEND[2].color
  if (gkg >= 10) return SOC_LEGEND[3].color
  if (gkg >= 5) return SOC_LEGEND[4].color
  return SOC_LEGEND[5].color
}

export function MapsInsights() {
  const { mapData, input, loading: farmLoading, error: farmError, reload } = useFarm()
  const { result } = usePrediction()
  const [layer, setLayer] = useState<LayerKey>('soc')
  // undefined = still loading, null = no data available, object = loaded.
  const [insights, setInsights] = useState<RegionalInsights | null | undefined>(undefined)

  useEffect(() => {
    getRegionalInsights(result ? result.socPercent : null).then(setInsights)
  }, [result])

  const farmValue = useMemo(() => {
    switch (layer) {
      case 'soc':
        return result ? `${result.socGramsPerKg.toFixed(1)} g/kg` : 'run a prediction'
      case 'moisture':
        return Number.isFinite(input.soilMoisture) ? `${input.soilMoisture}% vol` : '—'
      case 'temperature':
        return Number.isFinite(input.temperature) ? `${input.temperature}°C` : '—'
      case 'rainfall':
        return Number.isFinite(input.rainfall) ? `${input.rainfall} mm/yr` : '—'
      case 'landuse':
        return input.landUse || '—'
    }
  }, [layer, input, result])

  const polygonColor =
    layer === 'soc' && result ? socColor(result.socGramsPerKg) : '#2E6A4C'

  if (farmLoading) return <LoadingState label="Loading your farm data…" />
  if (farmError) return <ErrorState message={farmError} onRetry={reload} />

  return (
    <div className="space-y-6">
      <PageHeader
        title="Maps & Insights"
        subtitle="Explore your farm in its regional context."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartCard
            title="Farm & region"
            action={
              <div className="flex items-center gap-1.5 text-xs text-ink-faint">
                <Layers className="h-3.5 w-3.5" aria-hidden /> Layer
              </div>
            }
          >
            <div className="mb-3 flex flex-wrap gap-2">
              {LAYERS.map((l) => (
                <button
                  key={l.key}
                  onClick={() => setLayer(l.key)}
                  className={`chip transition-colors ${
                    layer === l.key
                      ? 'bg-forest-600 text-white'
                      : 'bg-forest-50 text-forest-700 hover:bg-forest-100'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>

            {mapData ? (
              <div className="overflow-hidden rounded-2xl border border-forest-50">
                <MapContainer center={mapData.center} zoom={14} scrollWheelZoom={false} style={{ height: 380 }}>
                  <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Polygon
                    positions={mapData.boundary}
                    pathOptions={{ color: polygonColor, weight: 2, fillColor: polygonColor, fillOpacity: 0.5 }}
                  >
                    <Tooltip sticky>
                      {LAYERS.find((l) => l.key === layer)?.label}: {farmValue}
                    </Tooltip>
                  </Polygon>
                </MapContainer>
              </div>
            ) : (
              <div className="flex h-[380px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-forest-100 bg-canvas/60 text-center">
                <MapPin className="h-6 w-6 text-forest-300" aria-hidden />
                <p className="text-sm font-medium text-ink">No farm location available yet</p>
                <p className="max-w-xs text-xs text-ink-soft">
                  The map will appear once your farm's location is connected.
                </p>
              </div>
            )}

            {layer === 'soc' && (
              <div className="mt-3">
                <p className="mb-1.5 text-xs font-medium text-ink-soft">Soil carbon (g/kg)</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-soft">
                  {SOC_LEGEND.map((s) => (
                    <span key={s.label} className="flex items-center gap-1.5">
                      <span className="h-3 w-3 rounded-sm" style={{ background: s.color }} />
                      {s.label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <p className="mt-3 flex items-start gap-2 rounded-lg bg-canvas p-3 text-xs text-ink-faint">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
              Geographic prediction layers for the wider region are not fabricated. When a spatial
              dataset is connected, this map will render real raster layers for each variable.
            </p>
          </ChartCard>
        </div>

        <ChartCard title="Regional Insights">
          {insights === undefined ? (
            <LoadingState label="Loading insights…" />
          ) : insights === null ? (
            <EmptyState
              title="No data available yet"
              message="Regional comparison data will appear once it is connected."
            />
          ) : (
            <>
              <dl className="space-y-3 text-sm">
                {[
                  ['Region', insights.regionName],
                  ['Average SOC', `${insights.averageSocPercent.toFixed(1)}% (${(insights.averageSocPercent * 10).toFixed(0)} g/kg)`],
                  ['Attainable SOC', `${insights.attainableSocPercent.toFixed(1)}%`],
                  [
                    'Your farm SOC',
                    insights.farmSocPercent != null
                      ? `${insights.farmSocPercent.toFixed(1)}% (${(insights.farmSocPercent * 10).toFixed(0)} g/kg)`
                      : 'Run a prediction',
                  ],
                  ['Dominant soil', insights.dominantSoil],
                  ['Dominant land use', insights.dominantLandUse],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 border-b border-forest-50 pb-2 last:border-0">
                    <dt className="text-ink-faint">{k}</dt>
                    <dd className="text-right font-medium text-ink">{v}</dd>
                  </div>
                ))}
              </dl>

              {insights.farmSocPercent != null && (
                <div className="mt-4 rounded-xl bg-canvas p-4 text-sm">
                  <p className="font-medium text-ink">Comparison</p>
                  <p className="mt-1 text-ink-soft">
                    Your farm is{' '}
                    <strong>
                      {insights.farmSocPercent >= insights.averageSocPercent ? 'above' : 'below'}
                    </strong>{' '}
                    the {insights.regionName} average by{' '}
                    {Math.abs(insights.farmSocPercent - insights.averageSocPercent).toFixed(1)} percentage
                    points of SOC.
                  </p>
                </div>
              )}
            </>
          )}
        </ChartCard>
      </div>
    </div>
  )
}
