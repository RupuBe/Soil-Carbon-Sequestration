import { useNavigate } from 'react-router-dom'
import { Workflow } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { ChartCard } from '../components/ChartCard'
import { PredictionForm } from '../components/PredictionForm'
import { ErrorState, LoadingState } from '../components/states'
import { useFarm } from '../context/FarmContext'
import { usePrediction } from '../context/PredictionContext'
import type { FarmInput } from '../lib/types'

const STEPS = [
  'Validate inputs',
  'Send to prediction service',
  'Run the trained model',
  'Explain the result',
  'Match recommendations',
]

export function PredictCarbon() {
  const { input, loading, error, reload, updateInput, resetInput } = useFarm()
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
        title="Predict Soil Carbon"
        subtitle="Enter your farm information to estimate soil carbon."
      />

      <div className="card flex flex-wrap items-center gap-x-2 gap-y-1 bg-forest-50/60 p-4 text-xs text-forest-700">
        <Workflow className="h-4 w-4" aria-hidden />
        {STEPS.map((s, i) => (
          <span key={s} className="flex items-center gap-2">
            <span className="font-medium">{s}</span>
            {i < STEPS.length - 1 && <span className="text-forest-300">→</span>}
          </span>
        ))}
      </div>

      <ChartCard title="Farm information">
        <PredictionForm
          initial={input}
          onSubmit={handleSubmit}
          onReset={resetInput}
          loading={predLoading}
          submitLabel="Predict Carbon"
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
