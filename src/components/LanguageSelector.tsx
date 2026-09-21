import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, Languages } from 'lucide-react'
import { LANGUAGES, useI18n, type Lang } from '../lib/i18n'

export function LanguageSelector({ compact = false }: { compact?: boolean }) {
  const { lang, setLang } = useI18n()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0]

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        className="btn-ghost px-2.5 py-2"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Change language"
        onClick={() => setOpen((v) => !v)}
      >
        <Languages className="h-4 w-4" aria-hidden />
        {!compact && <span className="hidden sm:inline">{current.native}</span>}
        <ChevronDown className="h-3.5 w-3.5" aria-hidden />
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-30 mt-2 w-44 overflow-hidden rounded-xl border border-forest-50 bg-surface py-1 shadow-card-hover animate-scale-in"
        >
          {LANGUAGES.map((l) => (
            <li key={l.code}>
              <button
                role="option"
                aria-selected={l.code === lang}
                className="flex w-full items-center justify-between px-3 py-2 text-sm hover:bg-forest-50"
                onClick={() => {
                  setLang(l.code as Lang)
                  setOpen(false)
                }}
              >
                <span>
                  {l.native}
                  <span className="ml-1.5 text-xs text-ink-faint">{l.label}</span>
                </span>
                {l.code === lang && <Check className="h-4 w-4 text-forest-600" aria-hidden />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
