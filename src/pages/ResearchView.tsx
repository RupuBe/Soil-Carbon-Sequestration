import { useEffect, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { ChartCard } from '../components/ChartCard'
import { FeatureImportanceChart } from '../components/FeatureImportanceChart'
import { LoadingState, EmptyState } from '../components/states'
import { getModelScorecards } from '../lib/api'
import { usePrediction } from '../context/PredictionContext'
import type { ModelScorecard } from '../lib/types'

const PIPELINE = [
  'Frontend', 'Backend / API', 'Data preprocessing', 'Trained ML model',
  'Prediction', 'Explainability (SHAP)', 'Recommendation engine', 'Frontend',
]

export function ResearchView() {
  // undefined = still loading, null = no data available, array = loaded.
  const [cards, setCards] = useState<ModelScorecard[] | null | undefined>(undefined)
  const { result, lastInput } = usePrediction()

  useEffect(() => {
    getModelScorecards().then(setCards)
  }, [])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Research View"
        subtitle="Technical detail for project evaluators — model comparison, error metrics and explainability. Not shown to farmers."
      />

      <ChartCard title="Model pipeline">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-2 text-sm">
          {PIPELINE.map((s, i) => (
            <span key={i} className="flex items-center gap-2">
              <span className="rounded-lg bg-forest-50 px-2.5 py-1 font-medium text-forest-700">{s}</span>
              {i < PIPELINE.length - 1 && <span className="text-forest-300">→</span>}
            </span>
          ))}
        </div>
        <p className="mt-3 text-xs text-ink-faint">
          Prediction logic is not embedded in the frontend. The browser only sends validated inputs
          and renders whatever the service returns.
        </p>
      </ChartCard>

      <ChartCard
        title="Model comparison"
        subtitle="Candidate regressors evaluated with cross-validation. Final model selected on validation performance — not assumed."
      >
        {cards === undefined ? (
          <LoadingState />
        ) : cards === null ? (
          <EmptyState
            title="No model comparison data available yet."
            message="Model evaluation metrics will appear here once a trained model is connected."
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-sm">
                <thead>
                  <tr className="border-b border-forest-100 text-left text-xs uppercase tracking-wide text-ink-faint">
                    <th className="py-2 pr-4 font-medium">Model</th>
                    <th className="py-2 pr-4 font-medium">R²</th>
                    <th className="py-2 pr-4 font-medium">RMSE</th>
                    <th className="py-2 pr-4 font-medium">MAE</th>
                    <th className="py-2 font-medium">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {cards.map((c) => (
                    <tr
                      key={c.name}
                      className={`border-b border-forest-50 last:border-0 ${c.selected ? 'bg-sage-light/40' : ''}`}
                    >
                      <td className="py-2.5 pr-4 font-medium text-ink">
                        <span className="flex items-center gap-1.5">
                          {c.selected && <CheckCircle2 className="h-4 w-4 text-sage-dark" aria-hidden />}
                          {c.name}
                        </span>
                      </td>
                      <td className="py-2.5 pr-4 tabular-nums">{c.r2.toFixed(2)}</td>
                      <td className="py-2.5 pr-4 tabular-nums">{c.rmse.toFixed(2)}</td>
                      <td className="py-2.5 pr-4 tabular-nums">{c.mae.toFixed(2)}</td>
                      <td className="py-2.5 text-ink-soft">{c.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-ink-faint">
              Metrics are in SOC % units. R² closer to 1 and lower RMSE / MAE are better.
            </p>
          </>
        )}
      </ChartCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Feature importance / SHAP" subtitle="Attribution for the current prediction">
          {result ? (
            <FeatureImportanceChart features={result.explanation.features} showValues />
          ) : (
            <p className="text-sm text-ink-soft">Model insights will appear after a prediction is generated.</p>
          )}
          <p className="mt-3 text-xs text-ink-faint">
            {result?.explanation.method ??
              'In production: SHAP values from the trained model, aggregated globally and per-prediction.'}
          </p>
        </ChartCard>

        <ChartCard title="Prediction & uncertainty">
          {result ? (
            <dl className="space-y-3 text-sm">
              <Row k="Point prediction" v={`${result.socPercent.toFixed(3)}% SOC`} />
              <Row k="Base value" v={`${result.explanation.baseValue.toFixed(3)}% SOC`} />
              <Row
                k="95% interval"
                v={result.interval ? `${result.interval.low.toFixed(2)} – ${result.interval.high.toFixed(2)}%` : '—'}
              />
              <Row
                k="Sequestration rate"
                v={result.sequestration ? `${result.sequestration.rateTPerHaYear.toFixed(3)} t C/ha/yr` : '—'}
              />
              <Row k="Inputs used" v={lastInput ? `${Object.keys(lastInput).length} features` : '—'} />
            </dl>
          ) : (
            <p className="text-sm text-ink-soft">Model insights will appear after a prediction is generated.</p>
          )}
          <p className="mt-3 text-xs text-ink-faint">
            Interval estimates come from the backend's uncertainty method (e.g. quantile regression or
            conformal prediction), when it reports one.
          </p>
        </ChartCard>
      </div>
    </div>
  )
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-forest-50 pb-2 last:border-0">
      <dt className="text-ink-faint">{k}</dt>
      <dd className="text-right font-medium tabular-nums text-ink">{v}</dd>
    </div>
  )
}
