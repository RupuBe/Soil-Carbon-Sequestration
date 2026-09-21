import { Link } from 'react-router-dom'
import { ArrowRight, Sprout, TrendingUp } from 'lucide-react'
import type { PredictionResult as Result, SocStatus } from '../lib/types'
import { StatusBadge } from './StatusBadge'
import { FeatureImportanceChart } from './FeatureImportanceChart'
import { ChartCard } from './ChartCard'
import { useI18n } from '../lib/i18n'

const MEANING: Record<SocStatus, string> = {
  Low: 'Your soil is holding less carbon than most healthy farm soils. This often means it also holds less water and fewer nutrients. The good news is that low soils usually respond fastest to better management.',
  Moderate: 'Your soil is in a middle range — not poor, but with clear room to improve. Small, steady changes in how you manage organic matter and residue can move it upward over a few seasons.',
  Good: 'Your soil is holding a healthy amount of carbon. The priority now is to protect what you have — avoid bare soil, heavy tillage and residue burning — while continuing to add organic matter.',
  High: 'Your soil is carbon-rich, which is excellent for water holding, crop nutrition and resilience. Focus on maintaining your current practices and monitoring for any decline.',
}

interface Props {
  result: Result
  showRecommendationsLink?: boolean
  showValues?: boolean
}

export function PredictionResult({ result, showRecommendationsLink = true, showValues = false }: Props) {
  const { t } = useI18n()

  return (
    <div className="space-y-6">
      {/* Headline result */}
      <div className="card overflow-hidden">
        <div className="bg-forest-600 px-6 py-5 text-white">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-forest-100">{t('metric.predictedSoc')}</p>
          </div>
          <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-5xl font-bold tracking-tight">{result.socPercent.toFixed(2)}%</span>
            <span className="text-lg text-forest-100">≈ {result.socGramsPerKg.toFixed(1)} g/kg</span>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <StatusBadge status={result.status} />
            {result.interval && (
              <span className="text-xs text-forest-100">
                Likely range {result.interval.low.toFixed(2)}%–{result.interval.high.toFixed(2)}%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Explanation */}
      <ChartCard
        title="What influenced this prediction?"
        subtitle="How strongly each input pushed the prediction up (green) or down (brown)."
      >
        <FeatureImportanceChart features={result.explanation.features} showValues={showValues} />
        <p className="mt-4 rounded-lg bg-canvas p-3 text-xs text-ink-soft">{result.explanation.note}</p>
      </ChartCard>

      {/* Plain-language meaning */}
      <section className="card p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-sage-light p-2 text-sage-dark">
            <Sprout className="h-4 w-4" aria-hidden />
          </span>
          <h3 className="text-lg">What does this mean?</h3>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">{MEANING[result.status]}</p>
      </section>

      {/* Carbon potential */}
      {result.sequestration && (
        <section className="card p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-water-light p-2 text-water-dark">
                <TrendingUp className="h-4 w-4" aria-hidden />
              </span>
              <h3 className="text-lg">Carbon potential</h3>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-bold text-forest-700">
              +{result.sequestration.rateTPerHaYear.toFixed(2)}
            </span>
            <span className="text-sm text-ink-soft">t C / ha / year</span>
            <StatusBadge status={result.sequestration.status} size="sm" />
          </div>
          <p className="mt-2 text-sm text-ink-soft">
            With improved management this soil could move towards an attainable level of about{' '}
            <strong>{result.sequestration.referenceSocPercent.toFixed(1)}%</strong> SOC over roughly{' '}
            {result.sequestration.horizonYears} years.
          </p>
          <p className="mt-3 rounded-lg bg-canvas p-3 text-xs text-ink-faint">
            <strong className="text-ink-soft">Method: </strong>
            {result.sequestration.methodology}
          </p>
        </section>
      )}

      {showRecommendationsLink && (
        <Link to="/app/recommendations" className="btn-primary">
          {t('common.viewRecommendations')} <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      )}
    </div>
  )
}
