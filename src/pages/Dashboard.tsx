import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CloudRain, Sprout, Thermometer, TrendingUp } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { MetricCard } from '../components/MetricCard'
import { ChartCard } from '../components/ChartCard'
import { FarmMap } from '../components/FarmMap'
import { SocChart } from '../components/SocChart'
import { FeatureImportanceChart } from '../components/FeatureImportanceChart'
import { RecommendationCard } from '../components/RecommendationCard'
import { LoadingState, ErrorState, EmptyState } from '../components/states'
import { useI18n } from '../lib/i18n'
import { useFarm } from '../context/FarmContext'
import { usePrediction } from '../context/PredictionContext'
import { getSocSeries } from '../lib/api'
import { isCompleteFarmInput } from '../lib/types'
import type { SocSeriesPoint } from '../lib/types'

export function Dashboard() {
  const { t } = useI18n()
  const { farm, mapData, soilData, weather, input, loading: farmLoading, error: farmError, reload } = useFarm()
  const { result, recommendations, run, loading: predLoading } = usePrediction()

  const [series, setSeries] = useState<{ hasHistory: boolean; points: SocSeriesPoint[] } | null>(null)

  // Auto-run a prediction once the farm's inputs are complete (real backend data only).
  useEffect(() => {
    if (isCompleteFarmInput(input) && !result && !predLoading) run(input)
  }, [input, result, predLoading, run])

  useEffect(() => {
    getSocSeries(result).then(setSeries)
  }, [result])

  if (farmLoading) return <LoadingState label="Loading your farm data…" />
  if (farmError) return <ErrorState message={farmError} onRetry={reload} />
  if (!farm) {
    return (
      <EmptyState
        title="No farm data available yet."
        message="Your farm details will appear here once your farm is connected."
      />
    )
  }

  const seq = result?.sequestration

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${t('greeting.hello')} 🌱`}
        subtitle={t('greeting.sub')}
      />

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={Sprout}
          accent="forest"
          label={t('metric.predictedSoc')}
          value={result ? `${result.socPercent.toFixed(1)}%` : '—'}
          sub={result ? `≈ ${result.socGramsPerKg.toFixed(0)} g/kg` : 'Enter your farm data to generate a prediction.'}
          status={result?.status}
        />
        {seq ? (
          <MetricCard
            icon={TrendingUp}
            accent="sage"
            label={t('metric.potential')}
            value={`+${seq.rateTPerHaYear.toFixed(1)}`}
            sub="t C / ha / year"
            status={seq.status}
            footnote={`over ~${seq.horizonYears} yrs`}
          />
        ) : (
          <MetricCard
            icon={TrendingUp}
            accent="sage"
            label={t('metric.potential')}
            value="—"
            sub="Run a prediction to estimate"
          />
        )}
        <MetricCard
          icon={Thermometer}
          accent="ember"
          label={t('metric.temperature')}
          value={weather ? `${weather.meanTemperatureC.toFixed(1)}°C` : '—'}
          sub="Mean annual"
        />
        <MetricCard
          icon={CloudRain}
          accent="water"
          label={t('metric.rainfall')}
          value={weather ? `${weather.rainfallMm.toFixed(0)} mm` : '—'}
          sub={weather?.rainfallPeriodLabel ?? ''}
        />
      </div>

      {/* Farm map + Soil carbon chart */}
      <div className="grid gap-6 lg:grid-cols-5">
        <ChartCard
          title="Your Farm"
          subtitle={`${farm.village}, ${farm.district}, ${farm.state}`}
          className="lg:col-span-3"
          action={
            <Link to="/app/my-farm" className="btn-ghost text-xs">
              Edit farm <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          }
        >
          <FarmMap
            center={mapData?.center ?? null}
            boundary={mapData?.boundary ?? null}
            areaHectares={mapData?.areaHectares ?? null}
            label={farm.name}
            height={320}
          />
          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm sm:grid-cols-3">
            {[
              ['Village', farm.village],
              ['District', farm.district],
              ['Farm Area', mapData ? `${mapData.areaHectares.toFixed(1)} ha` : '—'],
              ['Soil Type', soilData?.soilTexture ?? '—'],
              ['Primary Crop', farm.primaryCrop],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs uppercase tracking-wide text-ink-faint">{k}</dt>
                <dd className="font-medium text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </ChartCard>

        <ChartCard
          title="Soil Carbon"
          subtitle="Your prediction vs. regional reference"
          className="lg:col-span-2"
        >
          {series ? (
            <SocChart points={series.points} hasHistory={series.hasHistory} />
          ) : (
            <LoadingState label="Loading chart…" />
          )}
        </ChartCard>
      </div>

      {/* Model insights */}
      <ChartCard
        title="Why did the model make this prediction?"
        subtitle="The inputs that shaped your soil carbon estimate, most influential first."
        action={
          <Link to="/app/analysis" className="btn-ghost text-xs">
            Full analysis <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        }
      >
        {result ? (
          <>
            <FeatureImportanceChart features={result.explanation.features.slice(0, 7)} />
            <p className="mt-4 rounded-lg bg-canvas p-3 text-xs text-ink-soft">
              {result.explanation.note}
            </p>
          </>
        ) : (
          <EmptyState
            title="No prediction yet"
            message="Model insights will appear after a prediction is generated."
            action={
              <Link to="/app/predict" className="btn-primary">
                Enter your farm data
              </Link>
            }
          />
        )}
      </ChartCard>

      {/* Recommendations */}
      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-xl">Recommendations for Your Farm</h2>
            <p className="mt-1 text-sm text-ink-soft">
              Evidence-based actions matched to your soil’s current condition.
            </p>
          </div>
          <Link to="/app/recommendations" className="btn-ghost text-xs">
            View all <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
        {recommendations.length ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {recommendations.slice(0, 4).map((rec) => (
              <RecommendationCard key={rec.id} rec={rec} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No specific actions flagged"
            message={
              result
                ? 'Your inputs did not trigger any rule-based recommendations. Keep monitoring your soil.'
                : 'Enter your farm data to generate a prediction — recommendations appear once it is ready.'
            }
          />
        )}
      </section>
    </div>
  )
}
