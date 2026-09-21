import type { SocStatus } from './types'

export function pct(n: number, dp = 1) {
  return `${n.toFixed(dp)}%`
}

export function gPerKg(n: number, dp = 1) {
  return `${n.toFixed(dp)} g/kg`
}

export function signed(n: number, dp = 2) {
  return `${n >= 0 ? '+' : ''}${n.toFixed(dp)}`
}

export const STATUS_STYLES: Record<SocStatus, { text: string; bg: string; dot: string; label: string }> = {
  Low: { text: 'text-ember-dark', bg: 'bg-ember-light', dot: 'bg-ember-dark', label: 'Low' },
  Moderate: { text: 'text-soil-dark', bg: 'bg-soil-light', dot: 'bg-soil', label: 'Moderate' },
  Good: { text: 'text-sage-dark', bg: 'bg-sage-light', dot: 'bg-sage-dark', label: 'Good' },
  High: { text: 'text-forest-700', bg: 'bg-forest-100', dot: 'bg-forest-600', label: 'High' },
}

export function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.round(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs} h ago`
  const days = Math.round(hrs / 24)
  return `${days} d ago`
}
