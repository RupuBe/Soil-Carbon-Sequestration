import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MapPin, Menu, Search, User } from 'lucide-react'
import { LanguageSelector } from './LanguageSelector'
import { useFarm } from '../context/FarmContext'
import { useAuth } from '../context/AuthContext'

export function Header({ onMenu }: { onMenu: () => void }) {
  const { farm, loading } = useFarm()
  const { userName, viewMode, setViewMode } = useAuth()
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-forest-50 bg-canvas/80 px-4 py-3 backdrop-blur sm:px-6">
      <button className="btn-ghost p-2 lg:hidden" onClick={onMenu} aria-label="Open menu">
        <Menu className="h-5 w-5" aria-hidden />
      </button>

      <form
        className="relative hidden max-w-xs flex-1 sm:block"
        onSubmit={(e) => {
          e.preventDefault()
          if (query.trim()) navigate('/app/maps')
        }}
        role="search"
      >
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" aria-hidden />
        <input
          className="input pl-9"
          placeholder="Search farm or location…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search farm or location"
        />
      </form>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <span className="hidden items-center gap-1.5 rounded-full bg-forest-50 px-3 py-1.5 text-xs font-medium text-forest-700 md:flex">
          <MapPin className="h-3.5 w-3.5" aria-hidden />
          {loading ? 'Locating…' : farm ? `${farm.village}, ${farm.district}` : 'No farm data yet'}
        </span>

        <label className="hidden items-center gap-2 rounded-full border border-forest-100 px-2.5 py-1 text-xs text-ink-soft lg:flex">
          <span>View</span>
          <select
            className="bg-transparent font-medium text-forest-700 focus:outline-none"
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value as 'farmer' | 'research')}
            aria-label="Switch view mode"
          >
            <option value="farmer">Farmer</option>
            <option value="research">Research / Admin</option>
          </select>
        </label>

        <LanguageSelector />

        <Link
          to="/app/profile"
          className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3 text-sm font-medium text-forest-700 hover:bg-forest-50"
        >
          <span className="grid h-8 w-8 place-items-center rounded-full bg-sage-light text-sage-dark">
            <User className="h-4 w-4" aria-hidden />
          </span>
          <span className="hidden sm:inline">{userName}</span>
        </Link>
      </div>
    </header>
  )
}
