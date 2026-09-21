import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { PredictionResult } from '../components/PredictionResult'
import { EmptyState } from '../components/states'
import { usePrediction } from '../context/PredictionContext'
import { useAuth } from '../context/AuthContext'
import { relativeTime } from '../lib/format'

export function PredictionAnalysis() {
  const { result } = usePrediction()
  const { viewMode } = useAuth()

  if (!result) {
    return (
      <div className="space-y-6">
        <PageHeader title="Prediction Analysis" />
        <EmptyState
          title="No prediction yet"
          message="Run a prediction from your farm inputs to see the analysis here."
          action={
            <Link to="/app/predict" className="btn-primary">
              Predict Soil Carbon
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Prediction Analysis"
        subtitle={`Generated ${relativeTime(result.createdAt)}`}
        action={
          <Link to="/app/predict" className="btn-ghost text-xs">
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden /> New prediction
          </Link>
        }
      />
      <PredictionResult result={result} showValues={viewMode === 'research'} />
    </div>
  )
}
