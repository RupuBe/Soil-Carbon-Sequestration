import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { ChartCard } from '../components/ChartCard'
import { FarmMap } from '../components/FarmMap'
import { PredictionForm } from '../components/PredictionForm'
import { LoadingState, ErrorState } from '../components/states'
import { useAuth } from '../context/AuthContext'
import { useFarm } from '../context/FarmContext'
import { usePrediction } from '../context/PredictionContext'
import type { FarmInput } from '../lib/types'

export function MyFarm() {
  const { farm, mapData, soilData, input, loading, error, reload, updateInput, resetInput } = useFarm()
  const { userName } = useAuth()
  const { run, loading: predLoading, error: predError } = usePrediction()
  const navigate = useNavigate()

  if (loading) return <LoadingState label="Loading your farm data…" />
  if (error) return <ErrorState message={error} onRetry={reload} />

  const handleSubmit = async (values: FarmInput) => {
    updateInput(values)
    const res = await run(values)
    if (res) navigate('/app/analysis')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Farm"
        subtitle="Keep your farm details up to date — they feed every prediction and recommendation."
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <ChartCard title="Location & boundary" className="lg:col-span-3">
          <FarmMap
            center={mapData?.center ?? null}
            boundary={mapData?.boundary ?? null}
            areaHectares={mapData?.areaHectares ?? null}
            label={farm?.name ?? 'Your farm'}
            height={300}
          />
        </ChartCard>

        <ChartCard title="Farm profile" className="lg:col-span-2">
          <dl className="space-y-3 text-sm">
            {[
              ['Farm name', farm?.name ?? '—'],
              ['Farmer', userName || '—'],
              ['Village', farm?.village ?? '—'],
              ['District', farm?.district ?? '—'],
              ['State', farm?.state ?? '—'],
              ['Farm area', mapData ? `${mapData.areaHectares.toFixed(2)} ha` : '—'],
              ['Soil type', soilData?.soilTexture ?? '—'],
              ['Primary crop', farm?.primaryCrop ?? '—'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 border-b border-forest-50 pb-2 last:border-0">
                <dt className="text-ink-faint">{k}</dt>
                <dd className="text-right font-medium text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </ChartCard>
      </div>

      <ChartCard
        title="Soil & climate inputs"
        subtitle="These are the values used to predict your soil carbon. Update them from your latest soil test or local weather data."
      >
        <PredictionForm
          initial={input}
          onSubmit={handleSubmit}
          onReset={resetInput}
          loading={predLoading}
          submitLabel="Save & Predict"
        />
        {predError && (
          <p className="mt-4 rounded-lg bg-ember-light p-3 text-sm text-ember-dark" role="alert">
            {predError}
          </p>
        )}
      </ChartCard>
    </div>
  )
}
