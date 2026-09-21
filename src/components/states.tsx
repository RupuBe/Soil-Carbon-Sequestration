import { AlertTriangle, Loader2, Inbox } from 'lucide-react'
import type { ReactNode } from 'react'

export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 py-14 text-ink-faint"
      role="status"
      aria-live="polite"
    >
      <Loader2 className="h-7 w-7 animate-spin text-forest-400" aria-hidden />
      <p className="text-sm">{label}</p>
    </div>
  )
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
}: {
  title?: string
  message?: string
  onRetry?: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
      <div className="rounded-full bg-ember-light p-3">
        <AlertTriangle className="h-6 w-6 text-ember-dark" aria-hidden />
      </div>
      <div>
        <p className="font-semibold text-ink">{title}</p>
        {message && <p className="mt-1 max-w-sm text-sm text-ink-soft">{message}</p>}
      </div>
      {onRetry && (
        <button className="btn-secondary mt-1" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  )
}

export function EmptyState({
  title,
  message,
  action,
}: {
  title: string
  message?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-forest-100 bg-canvas/60 py-12 text-center">
      <div className="rounded-full bg-forest-50 p-3">
        <Inbox className="h-6 w-6 text-forest-400" aria-hidden />
      </div>
      <div>
        <p className="font-semibold text-ink">{title}</p>
        {message && <p className="mt-1 max-w-md text-sm text-ink-soft">{message}</p>}
      </div>
      {action}
    </div>
  )
}
