import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { SoilIllustration } from '../components/SoilIllustration'
import { useAuth } from '../context/AuthContext'

export function Login({ mode }: { mode: 'login' | 'create' }) {
  const { login } = useAuth()
  const navigate = useNavigate()
  const isCreate = mode === 'create'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isCreate && name.trim().length < 2) return setError('Please enter your name.')
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Please enter a valid email address.')
    if (password.length < 4) return setError('Password must be at least 4 characters.')
    setError(null)
    login(email.trim(), isCreate ? name.trim() : undefined)
    navigate('/app')
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col justify-center px-6 py-10 sm:px-12 lg:px-16">
        <Link to="/" className="mb-8 inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-forest-700">
          <ArrowLeft className="h-4 w-4" aria-hidden /> Back
        </Link>

        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-forest-600 text-base">🌱</span>
          <span className="text-lg font-bold text-forest-700">Soil Carbon</span>
        </div>

        <h1 className="mt-8 text-2xl font-bold text-forest-700">
          {isCreate ? 'Create your account' : 'Welcome back'}
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          {isCreate
            ? 'Set up your farm profile to get started.'
            : 'Log in to see your farm and soil carbon.'}
        </p>

        <form onSubmit={submit} noValidate className="mt-6 max-w-sm space-y-4">
          {isCreate && (
            <div>
              <label className="label" htmlFor="name">
                Full name
              </label>
              <input
                id="name"
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>
          )}
          <div>
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={isCreate ? 'new-password' : 'current-password'}
            />
          </div>

          {error && (
            <p className="text-sm text-ember-dark" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="btn-primary w-full">
            {isCreate ? 'Create Account' : 'Login'} <ArrowRight className="h-4 w-4" aria-hidden />
          </button>

          <p className="text-center text-sm text-ink-soft">
            {isCreate ? (
              <>
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-forest-700 hover:underline">
                  Login
                </Link>
              </>
            ) : (
              <>
                New here?{' '}
                <Link to="/create-account" className="font-semibold text-forest-700 hover:underline">
                  Create Account
                </Link>
              </>
            )}
          </p>
        </form>
      </div>

      <div className="relative hidden overflow-hidden bg-forest-50 lg:block">
        <SoilIllustration className="absolute inset-0 h-full w-full" />
      </div>
    </div>
  )
}
