import { Link, Navigate } from 'react-router-dom'
import { ArrowRight, Sprout } from 'lucide-react'
import { SoilIllustration } from '../components/SoilIllustration'
import { useAuth } from '../context/AuthContext'

export function Landing() {
  const { isAuthed } = useAuth()
  if (isAuthed) return <Navigate to="/app" replace />

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left */}
      <div className="flex flex-col justify-between px-6 py-10 sm:px-12 lg:px-16">
        <div className="flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-forest-600 text-lg">🌱</span>
          <span className="text-xl font-bold text-forest-700">Soil Carbon</span>
        </div>

        <div className="max-w-md py-12">
          <span className="chip bg-sage-light text-sage-dark">
            <Sprout className="h-3.5 w-3.5" aria-hidden /> Soil decision support
          </span>
          <h1 className="mt-5 text-4xl font-bold leading-tight text-forest-700 sm:text-5xl">
            Healthy Soil.
            <br />
            Greener Tomorrow.
          </h1>
          <p className="mt-5 text-base leading-relaxed text-ink-soft">
            An intelligent platform to understand your soil carbon, discover what influences it, and
            make better soil-management decisions.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/login" className="btn-primary">
              Login <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link to="/create-account" className="btn-secondary">
              Create Account
            </Link>
          </div>
        </div>

        <p className="text-xs text-ink-faint">
          Final-year engineering research project · soil carbon decision support for farmers.
        </p>
      </div>

      {/* Right */}
      <div className="relative hidden overflow-hidden bg-forest-50 lg:block">
        <SoilIllustration className="absolute inset-0 h-full w-full" />
        <div className="absolute bottom-8 left-8 right-8 rounded-2xl bg-surface/90 p-5 shadow-card backdrop-blur">
          <p className="text-sm font-semibold text-forest-700">Soil Today, A Better Tomorrow</p>
          <p className="mt-1 text-sm text-ink-soft">
            Farm data → carbon prediction → clear explanation → practical next steps.
          </p>
        </div>
      </div>
    </div>
  )
}
