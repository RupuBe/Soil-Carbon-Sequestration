import { Link } from 'react-router-dom'
import { MapPin, User } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { ChartCard } from '../components/ChartCard'
import { StatusBadge } from '../components/StatusBadge'
import { LoadingState, ErrorState } from '../components/states'
import { useAuth } from '../context/AuthContext'
import { useFarm } from '../context/FarmContext'
import { usePrediction } from '../context/PredictionContext'
import { relativeTime } from '../lib/format'

export function Profile() {
  const { userName, userEmail } = useAuth()
  const { farm, mapData, soilData, loading, error, reload } = useFarm()
  const { result } = usePrediction()

  if (loading) return <LoadingState label="Loading your farm data…" />
  if (error) return <ErrorState message={error} onRetry={reload} />

  return (
    <div className="space-y-6">
      <PageHeader title="Profile" />

      <div className="card overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-forest-600 to-forest-500" />
        <div className="px-6 pb-6">
          <div className="-mt-10 flex items-end gap-4">
            <span className="grid h-20 w-20 place-items-center rounded-2xl border-4 border-surface bg-sage-light text-sage-dark">
              <User className="h-9 w-9" aria-hidden />
            </span>
            <div className="pb-1">
              <h2 className="text-xl font-bold text-forest-700">{userName || '—'}</h2>
              <p className="text-sm text-ink-soft">{userEmail || '—'}</p>
            </div>
          </div>
          <p className="mt-4 flex items-center gap-1.5 text-sm text-ink-soft">
            <MapPin className="h-4 w-4" aria-hidden />
            {farm ? `${farm.village}, ${farm.district}, ${farm.state}` : 'No farm data available yet.'}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Farm summary">
          <dl className="space-y-3 text-sm">
            {[
              ['Location', farm ? `${farm.village}, ${farm.district}` : '—'],
              ['Farm Area', mapData ? `${mapData.areaHectares.toFixed(2)} ha` : '—'],
              ['Primary Crop', farm?.primaryCrop ?? '—'],
              ['Soil Type', soilData?.soilTexture ?? '—'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 border-b border-forest-50 pb-2 last:border-0">
                <dt className="text-ink-faint">{k}</dt>
                <dd className="font-medium text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </ChartCard>

        <ChartCard title="Farm Carbon Overview">
          {result ? (
            <dl className="space-y-3 text-sm">
              <Row k="Current SOC" v={`${result.socPercent.toFixed(2)}% (${result.socGramsPerKg.toFixed(1)} g/kg)`} extra={<StatusBadge status={result.status} size="sm" />} />
              <Row
                k="Potential"
                v={result.sequestration ? `+${result.sequestration.rateTPerHaYear.toFixed(2)} t C/ha/yr` : '—'}
              />
              <Row k="Recent prediction" v={result.status} />
              <Row k="Last updated" v={relativeTime(result.createdAt)} />
            </dl>
          ) : (
            <div className="text-sm text-ink-soft">
              No prediction yet.{' '}
              <Link to="/app/predict" className="font-semibold text-forest-700 hover:underline">
                Predict soil carbon
              </Link>
              .
            </div>
          )}
        </ChartCard>
      </div>
    </div>
  )
}

function Row({ k, v, extra }: { k: string; v: string; extra?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-forest-50 pb-2 last:border-0">
      <dt className="text-ink-faint">{k}</dt>
      <dd className="flex items-center gap-2 text-right font-medium text-ink">
        {v} {extra}
      </dd>
    </div>
  )
}
