import type { SocStatus } from '../lib/types'
import { STATUS_STYLES } from '../lib/format'

export function StatusBadge({ status, size = 'md' }: { status: SocStatus; size?: 'sm' | 'md' }) {
  const s = STATUS_STYLES[status]
  return (
    <span
      className={`chip ${s.bg} ${s.text} ${size === 'sm' ? 'text-[11px] px-2.5 py-0.5' : ''}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} aria-hidden />
      {s.label}
    </span>
  )
}
