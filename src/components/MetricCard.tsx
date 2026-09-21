import type { ReactNode } from 'react'
import type { LucideProps } from 'lucide-react'
import type { SocStatus } from '../lib/types'
import { StatusBadge } from './StatusBadge'

type Accent = 'forest' | 'sage' | 'soil' | 'water' | 'ember'

const ACCENT: Record<Accent, string> = {
  forest: 'bg-forest-50 text-forest-600',
  sage: 'bg-sage-light text-sage-dark',
  soil: 'bg-soil-light text-soil-dark',
  water: 'bg-water-light text-water-dark',
  ember: 'bg-ember-light text-ember-dark',
}

interface Props {
  label: string
  value: ReactNode
  sub?: ReactNode
  status?: SocStatus
  accent?: Accent
  icon: React.ComponentType<LucideProps>
  badge?: ReactNode
  footnote?: ReactNode
}

export function MetricCard({
  label,
  value,
  sub,
  status,
  accent = 'forest',
  icon: IconCmp,
  badge,
  footnote,
}: Props) {
  return (
    <div className="card card-hover p-5 animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <div className={`rounded-xl p-2.5 ${ACCENT[accent]}`}>
          <IconCmp className="h-5 w-5" aria-hidden />
        </div>
        {badge}
      </div>
      <p className="mt-4 text-sm font-medium text-ink-soft">{label}</p>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-3xl font-bold text-forest-700">{value}</span>
      </div>
      {sub && <p className="mt-0.5 text-sm text-ink-faint">{sub}</p>}
      <div className="mt-3 flex items-center justify-between">
        {status ? <StatusBadge status={status} /> : <span />}
        {footnote && <span className="text-xs text-ink-faint">{footnote}</span>}
      </div>
    </div>
  )
}
