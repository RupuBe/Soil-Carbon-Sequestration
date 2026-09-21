import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="text-5xl">🌱</span>
      <h1 className="text-2xl font-bold text-forest-700">Page not found</h1>
      <p className="max-w-sm text-sm text-ink-soft">
        The page you’re looking for doesn’t exist or has moved.
      </p>
      <Link to="/app" className="btn-primary">
        Go to Dashboard
      </Link>
    </div>
  )
}
