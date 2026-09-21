import type { ReactNode } from 'react'

interface Props {
  title: string
  subtitle?: string
  action?: ReactNode
  badge?: ReactNode
  children: ReactNode
  className?: string
}

export function ChartCard({ title, subtitle, action, badge, children, className = '' }: Props) {
  return (
    <section className={`card p-5 sm:p-6 animate-fade-in ${className}`}>
      <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg">{title}</h3>
            {badge}
          </div>
          {subtitle && <p className="mt-1 text-sm text-ink-soft">{subtitle}</p>}
        </div>
        {action}
      </header>
      {children}
    </section>
  )
}
