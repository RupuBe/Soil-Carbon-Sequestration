import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { useAuth } from '../context/AuthContext'
import { useFarm } from '../context/FarmContext'
import { usePrediction } from '../context/PredictionContext'
import { isCompleteFarmInput } from '../lib/types'

export function Layout() {
  const { isAuthed } = useAuth()
  const { input } = useFarm()
  const { result, loading: predLoading, run } = usePrediction()
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  // Make a prediction available app-wide as soon as farm inputs load, so any
  // page (dashboard, maps, profile…) can show carbon figures without each one
  // triggering its own request.
  useEffect(() => {
    if (isCompleteFarmInput(input) && !result && !predLoading) run(input)
  }, [input, result, predLoading, run])

  // Close the mobile drawer + scroll to top on navigation.
  useEffect(() => {
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [location.pathname])

  if (!isAuthed) return <Navigate to="/login" replace state={{ from: location.pathname }} />

  return (
    <div className="flex min-h-screen bg-canvas">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header onMenu={() => setMenuOpen(true)} />
        <main
          key={location.pathname}
          className="mx-auto w-full max-w-6xl flex-1 animate-fade-in px-4 py-6 sm:px-6 sm:py-8"
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}
