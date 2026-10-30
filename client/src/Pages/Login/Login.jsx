import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import { useAuth } from '../../Context/AuthContext'

export default function Login() {
  const { login, isAuthenticated, loading } = useAuth()
  const location = useLocation()

  // Where to go after logging in (set by pages that redirect here), or the home page
  const from = location.state?.from?.pathname || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Still checking a saved token, so don't flash the form
  if (loading) return null

  // Already logged in (or just logged in), so leave this page
  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password) {
      setError('Please enter your email and password')
      return
    }

    setSubmitting(true)
    try {
      await login(email, password)
    } catch (err) {
      // err.status exists when the server answered; otherwise the server is unreachable
      setError(
        err.status ? err.message : "We couldn't reach the server. Please try again in a moment."
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-md py-8 sm:py-12">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
          Welcome back
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          Log in to Veyora
        </h1>
        <p className="mt-2 text-stone-500">Enter your details to access your account.</p>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-8 space-y-5 rounded-3xl border border-stone-200 bg-white p-6 sm:p-8"
      >
        {/* Server / validation error */}
        {error && (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {/* Email */}
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-stone-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@example.com"
            className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-stone-400 focus:border-stone-900"
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-stone-700">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              className="w-full rounded-2xl border border-stone-200 bg-white py-3 pl-4 pr-12 text-sm outline-none transition placeholder:text-stone-400 focus:border-stone-900"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-stone-400 transition hover:text-stone-700"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-stone-900 py-3.5 text-sm font-semibold text-white transition hover:bg-indigo-600 disabled:opacity-60"
        >
          <LogIn size={16} />
          {submitting ? 'Logging in...' : 'Log in'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-stone-500">
        Don't have an account?{' '}
        <Link
          to="/register"
          className="font-semibold text-stone-900 underline underline-offset-4 transition hover:text-indigo-600"
        >
          Create one
        </Link>
      </p>
    </div>
  )
}