import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, UserPlus } from 'lucide-react'
import { useAuth } from '../../Context/AuthContext'

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/

// Defined OUTSIDE Register so React keeps the same input between renders
function Field({ label, id, error, hint, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-stone-700">
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-stone-400">{hint}</p>}
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  )
}

const inputClass = (error) =>
  `w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none transition placeholder:text-stone-400 focus:border-stone-900 ${
    error ? 'border-red-400' : 'border-stone-200'
  }`

export default function Register() {
  const { register, isAuthenticated, loading } = useAuth()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Still checking a saved token, so don't flash the form
  if (loading) return null

  // Already logged in (or just registered), so leave this page
  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    if (errors[name]) setErrors((err) => ({ ...err, [name]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Please enter your name'
    if (!EMAIL_PATTERN.test(form.email.trim())) e.email = 'Please enter a valid email'
    if (form.password.length < 8) e.password = 'Password must be at least 8 characters'
    if (form.confirm !== form.password) e.confirm = 'Passwords do not match'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')

    const found = validate()
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setSubmitting(true)
    try {
      await register(form.name, form.email, form.password)
    } catch (err) {
      setServerError(
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
          Join Veyora
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          Create your account
        </h1>
        <p className="mt-2 text-stone-500">It only takes a minute.</p>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-8 space-y-5 rounded-3xl border border-stone-200 bg-white p-6 sm:p-8"
      >
        {serverError && (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {serverError}
          </div>
        )}

        <Field label="Full name" id="name" error={errors.name}>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Jane Doe"
            className={inputClass(errors.name)}
          />
        </Field>

        <Field label="Email" id="email" error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            placeholder="jane@example.com"
            className={inputClass(errors.email)}
          />
        </Field>

        <Field
          label="Password"
          id="password"
          error={errors.password}
          hint="At least 8 characters."
        >
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              placeholder="Create a password"
              className={`${inputClass(errors.password)} pr-12`}
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
        </Field>

        <Field label="Confirm password" id="confirm" error={errors.confirm}>
          <input
            id="confirm"
            name="confirm"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            value={form.confirm}
            onChange={handleChange}
            placeholder="Repeat your password"
            className={inputClass(errors.confirm)}
          />
        </Field>

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-stone-900 py-3.5 text-sm font-semibold text-white transition hover:bg-indigo-600 disabled:opacity-60"
        >
          <UserPlus size={16} />
          {submitting ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-stone-500">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-semibold text-stone-900 underline underline-offset-4 transition hover:text-indigo-600"
        >
          Log in
        </Link>
      </p>
    </div>
  )
}