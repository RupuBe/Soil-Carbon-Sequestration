import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { RecommendationCard } from '../components/RecommendationCard'
import { EmptyState, LoadingState } from '../components/states'
import { useFarm } from '../context/FarmContext'
import { usePrediction } from '../context/PredictionContext'
import { isCompleteFarmInput } from '../lib/types'
import type { Recommendation } from '../lib/types'

const CATEGORIES: { key: Recommendation['category']; blurb: string }[] = [
  { key: 'Soil', blurb: 'Organic matter, soil moisture and pH.' },
  { key: 'Crop Management', blurb: 'Residue, rotation and cover crops.' },
  { key: 'Farm Practices', blurb: 'Tillage, organic amendments and conservation.' },
]

export function RecommendationsPage() {
  const { input } = useFarm()
  const { result, recommendations, run, loading } = usePrediction()

  useEffect(() => {
    if (isCompleteFarmInput(input) && !result && !loading) run(input)
  }, [input, result, loading, run])

  if (loading && !result) return <LoadingState label="Matching recommendations to your soil…" />

  return (
    <div className="space-y-6">
      <PageHeader
        title="Recommendations for Your Farm"
        subtitle="Simple actions that may support healthier soil and carbon storage."
      />

      <div className="card flex items-start gap-3 bg-sage-light/50 p-4 text-sm text-forest-700">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-sage-dark" aria-hidden />
        <p>
          Every recommendation below comes from predefined agricultural rules matched to your farm’s
          inputs — not from the AI model. The model describes your soil’s condition; it never invents
          advice. Expected benefits are stated as a <em>direction</em>, not a guarantee.
        </p>
      </div>

      {recommendations.length === 0 ? (
        <EmptyState
          title={result ? 'No specific actions flagged' : 'No prediction yet'}
          message={
            result
              ? 'Your current inputs did not trigger any rule. Keep monitoring your soil and re-check after your next soil test.'
              : 'Enter your farm data to generate a prediction. Recommendations appear once it is ready.'
          }
          action={
            <Link to="/app/predict" className="btn-secondary">
              {result ? 'Update inputs' : 'Enter your farm data'}
            </Link>
          }
        />
      ) : (
        CATEGORIES.map(({ key, blurb }) => {
          const items = recommendations.filter((r) => r.category === key)
          if (!items.length) return null
          return (
            <section key={key}>
              <div className="mb-3">
                <h2 className="text-xl">{key}</h2>
                <p className="text-sm text-ink-soft">{blurb}</p>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                {items.map((rec) => (
                  <RecommendationCard key={rec.id} rec={rec} variant="full" />
                ))}
              </div>
            </section>
          )
        })
      )}
    </div>
  )
}
