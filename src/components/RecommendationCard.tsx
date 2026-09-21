import { Link } from 'react-router-dom'
import { ArrowRight, Info } from 'lucide-react'
import type { Recommendation } from '../lib/types'
import { Icon } from './Icon'
import { useI18n } from '../lib/i18n'

interface Props {
  rec: Recommendation
  variant?: 'compact' | 'full'
}

export function RecommendationCard({ rec, variant = 'compact' }: Props) {
  const { t } = useI18n()
  const full = variant === 'full'

  return (
    <article className="card card-hover flex flex-col p-5">
      <div className="flex items-center gap-3">
        <span className="rounded-xl bg-sage-light p-2.5 text-sage-dark">
          <Icon name={rec.icon} className="h-5 w-5" aria-hidden />
        </span>
        <h4 className="text-base font-semibold text-forest-700">{rec.title}</h4>
      </div>

      <p className="mt-3 text-sm text-ink-soft">{rec.whyItMatters}</p>

      {full && (
        <dl className="mt-4 space-y-3 text-sm">
          <div>
            <dt className="font-semibold text-ink">What you can do</dt>
            <dd className="mt-0.5 text-ink-soft">{rec.whatToDo}</dd>
          </div>
          <div>
            <dt className="font-semibold text-ink">Expected direction of benefit</dt>
            <dd className="mt-0.5 text-ink-soft">{rec.expectedDirection}</dd>
          </div>
          <div className="rounded-lg bg-canvas p-3 text-xs text-ink-faint">
            <span className="flex items-start gap-1.5">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
              <span>
                <strong className="font-semibold text-ink-soft">Why this appeared: </strong>
                {rec.triggeredBy} <br />
                <strong className="font-semibold text-ink-soft">Evidence: </strong>
                {rec.evidenceNote}
              </span>
            </span>
          </div>
        </dl>
      )}

      <div className="mt-4 flex-1" />
      <Link
        to={`/app/learn/${rec.learnMoreSlug}`}
        className="btn-secondary mt-2 self-start text-xs"
      >
        {t('common.learnMore')}
        <ArrowRight className="h-3.5 w-3.5" aria-hidden />
      </Link>
    </article>
  )
}
