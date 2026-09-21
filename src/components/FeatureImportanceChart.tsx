import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import type { FeatureContribution } from '../lib/types'
import { signed } from '../lib/format'

interface Props {
  features: FeatureContribution[]
  /** Show the signed contribution value alongside the share. */
  showValues?: boolean
}

/**
 * Horizontal contribution bars. Green = pushed the prediction up,
 * soil-brown = pushed it down. Width encodes the share of the explanation.
 */
export function FeatureImportanceChart({ features, showValues = false }: Props) {
  const max = Math.max(...features.map((f) => f.share), 0.0001)

  return (
    <ul className="space-y-3">
      {features.map((f) => {
        const widthPct = (f.share / max) * 100
        const up = f.direction === 'increases'
        return (
          <li key={f.key}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5 font-medium text-ink">
                {up ? (
                  <ArrowUpRight className="h-3.5 w-3.5 text-sage-dark" aria-hidden />
                ) : (
                  <ArrowDownRight className="h-3.5 w-3.5 text-soil-dark" aria-hidden />
                )}
                {f.label}
              </span>
              <span className="tabular-nums text-ink-soft">
                {Math.round(f.share * 100)}%
                {showValues && (
                  <span className="ml-2 text-xs text-ink-faint">{signed(f.contribution)}</span>
                )}
              </span>
            </div>
            <div
              className="h-2.5 w-full overflow-hidden rounded-full bg-forest-50"
              role="img"
              aria-label={`${f.label} contributed ${Math.round(f.share * 100)} percent and ${
                up ? 'increased' : 'decreased'
              } the prediction`}
              title={`${f.label}: ${Math.round(f.share * 100)}% of the explanation — ${
                up ? 'increased' : 'decreased'
              } predicted soil carbon by ${signed(f.contribution)}%`}
            >
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  up ? 'bg-sage-dark' : 'bg-soil'
                }`}
                style={{ width: `${widthPct}%` }}
              />
            </div>
          </li>
        )
      })}
    </ul>
  )
}
