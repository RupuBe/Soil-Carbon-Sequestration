import { NavLink } from 'react-router-dom'
import {
  Home,
  Tractor,
  BarChart3,
  Lightbulb,
  Map,
  BookOpen,
  Settings,
  FlaskConical,
  X,
} from 'lucide-react'
import { useI18n } from '../lib/i18n'
import { useAuth } from '../context/AuthContext'

const NAV = [
  { to: '/app', end: true, icon: Home, key: 'nav.home', emoji: '🏠' },
  { to: '/app/my-farm', icon: Tractor, key: 'nav.myFarm', emoji: '🚜' },
  { to: '/app/predict', icon: BarChart3, key: 'nav.predict', emoji: '📊' },
  { to: '/app/recommendations', icon: Lightbulb, key: 'nav.recommendations', emoji: '💡' },
  { to: '/app/maps', icon: Map, key: 'nav.maps', emoji: '🗺️' },
  { to: '/app/learn', icon: BookOpen, key: 'nav.learn', emoji: '📚' },
  { to: '/app/settings', icon: Settings, key: 'nav.settings', emoji: '⚙️' },
]

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useI18n()
  const { viewMode } = useAuth()

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-forest-900/30 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-forest-50 bg-surface transition-transform duration-300 lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-forest-600 text-lg">
              🌱
            </span>
            <span className="text-lg font-bold text-forest-700">Soil Carbon</span>
          </div>
          <button className="btn-ghost p-1.5 lg:hidden" onClick={onClose} aria-label="Close menu">
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-forest-50 text-forest-700'
                    : 'text-ink-soft hover:bg-canvas hover:text-forest-700'
                }`
              }
            >
              <span aria-hidden className="text-base">
                {item.emoji}
              </span>
              {t(item.key)}
            </NavLink>
          ))}

          {viewMode === 'research' && (
            <NavLink
              to="/app/research"
              onClick={onClose}
              className={({ isActive }) =>
                `mt-2 flex items-center gap-3 rounded-xl border border-dashed border-forest-100 px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? 'bg-forest-50 text-forest-700' : 'text-ink-soft hover:bg-canvas'
                }`
              }
            >
              <FlaskConical className="h-4 w-4" aria-hidden />
              {t('nav.research')}
            </NavLink>
          )}
        </nav>

        <div className="px-6 py-6">
          <p className="text-sm font-semibold leading-tight text-forest-700">
            {t('brand.motto1')}
          </p>
          <p className="text-sm text-ink-faint">{t('brand.motto2')}</p>
        </div>
      </aside>
    </>
  )
}
