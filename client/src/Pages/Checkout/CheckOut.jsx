import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { ArrowLeft, CreditCard, Banknote, Lock } from 'lucide-react'
import { useCart } from '../../Context/CartContext'
import { useAuth } from '../../Context/AuthContext'

const FREE_SHIPPING_AT = 50
const SHIPPING_FEE = 5.99

const emptyForm = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
}

// Defined OUTSIDE Checkout so React keeps the same input between renders
function Field({ label, name, type = 'text', placeholder, className = '', value, onChange, error }) {
  return (
    <div className={className}>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-stone-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none transition placeholder:text-stone-400 focus:border-stone-900 ${
          error ? 'border-red-400' : 'border-stone-200'
        }`}
      />
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  )
}

export default function Checkout() {
  const { items, cartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  // Start with the logged-in person's name and email already filled in
  const [form, setForm] = useState(() => ({
    ...emptyForm,
    fullName: user?.name ?? '',
    email: user?.email ?? '',
  }))
  const [errors, setErrors] = useState({})
  const [payment, setPayment] = useState('card')
  const [submitting, setSubmitting] = useState(false)

  // Nothing to check out
  if (items.length === 0 && !submitting) {
    return <Navigate to="/cart" replace />
  }

  const shipping = cartTotal >= FREE_SHIPPING_AT ? 0 : SHIPPING_FEE
  const total = cartTotal + shipping

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    // Clear that field's error as soon as the user edits it
    if (errors[name]) setErrors((err) => ({ ...err, [name]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.fullName.trim()) e.fullName = 'Please enter your full name'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Please enter a valid email'
    if (form.phone.replace(/\D/g, '').length < 7) e.phone = 'Please enter a valid phone number'
    if (!form.address.trim()) e.address = 'Please enter your address'
    if (!form.city.trim()) e.city = 'Please enter your city'
    if (!form.postalCode.trim()) e.postalCode = 'Please enter your postal code'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const found = validate()
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setSubmitting(true)

    // Placeholder: later this will be sent to our backend
    const order = {
      id: 'VEY-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
      items,
      subtotal: cartTotal,
      shipping,
      total,
      payment,
      customer: form,
    }

    navigate('/order-success', { state: { order } })
    clearCart()
  }

  return (
    <div>
      <Link
        to="/cart"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-stone-500 transition hover:text-stone-900"
      >
        <ArrowLeft size={16} /> Back to cart
      </Link>

      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
          Almost there
        </p>
        <h1 className="mt-1 text-4xl font-bold tracking-tight text-stone-900">Checkout</h1>
      </div>

      <form onSubmit={handleSubmit} noValidate className="grid gap-8 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Shipping details */}
          <section className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8">
            <h2 className="text-lg font-bold text-stone-900">Shipping details</h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Field
                label="Full name"
                name="fullName"
                placeholder="Jane Doe"
                className="sm:col-span-2"
                value={form.fullName}
                onChange={handleChange}
                error={errors.fullName}
              />
              <Field
                label="Email"
                name="email"
                type="email"
                placeholder="jane@example.com"
                value={form.email}
                onChange={handleChange}
                error={errors.email}
              />
              <Field
                label="Phone"
                name="phone"
                type="tel"
                placeholder="+1 555 123 4567"
                value={form.phone}
                onChange={handleChange}
                error={errors.phone}
              />
              <Field
                label="Address"
                name="address"
                placeholder="123 Main Street"
                className="sm:col-span-2"
                value={form.address}
                onChange={handleChange}
                error={errors.address}
              />
              <Field
                label="City"
                name="city"
                placeholder="City"
                value={form.city}
                onChange={handleChange}
                error={errors.city}
              />
              <Field
                label="Postal code"
                name="postalCode"
                placeholder="12345"
                value={form.postalCode}
                onChange={handleChange}
                error={errors.postalCode}
              />
            </div>
          </section>

          {/* Payment method */}
          <section className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8">
            <h2 className="text-lg font-bold text-stone-900">Payment method</h2>

            <div className="mt-6 space-y-3">
              {[
                { value: 'card', icon: CreditCard, title: 'Credit / debit card', text: 'Secure card payment (coming soon)' },
                { value: 'cod', icon: Banknote, title: 'Cash on delivery', text: 'Pay when your order arrives' },
              ].map(({ value, icon: Icon, title, text }) => (
                <label
                  key={value}
                  className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition ${
                    payment === value
                      ? 'border-stone-900 bg-stone-50'
                      : 'border-stone-200 hover:border-stone-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={value}
                    checked={payment === value}
                    onChange={() => setPayment(value)}
                    className="h-4 w-4 accent-stone-900"
                  />
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 text-stone-700">
                    <Icon size={18} />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-stone-900">{title}</span>
                    <span className="block text-xs text-stone-500">{text}</span>
                  </span>
                </label>
              ))}
            </div>
          </section>
        </div>

        {/* Order summary */}
        <aside className="h-fit rounded-3xl border border-stone-200 bg-white p-6 lg:sticky lg:top-28">
          <h2 className="text-lg font-bold text-stone-900">Your order</h2>

          <ul className="mt-5 space-y-4">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-3">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-stone-100">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  <span className="absolute -right-0 -top-0 flex h-5 min-w-5 items-center justify-center rounded-bl-lg bg-stone-900 px-1 text-[11px] font-semibold text-white">
                    {item.quantity}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-stone-900">{item.name}</p>
                  <p className="text-xs text-stone-500">${item.price.toFixed(2)} each</p>
                </div>
                <p className="text-sm font-semibold text-stone-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </li>
            ))}
          </ul>

          <dl className="mt-6 space-y-3 border-t border-stone-200 pt-5 text-sm">
            <div className="flex justify-between">
              <dt className="text-stone-500">Subtotal</dt>
              <dd className="font-medium text-stone-900">${cartTotal.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-stone-500">Shipping</dt>
              <dd className="font-medium text-stone-900">
                {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
              </dd>
            </div>
            <div className="flex justify-between border-t border-stone-200 pt-4 text-base">
              <dt className="font-semibold text-stone-900">Total</dt>
              <dd className="font-bold text-stone-900">${total.toFixed(2)}</dd>
            </div>
          </dl>

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-stone-900 py-4 text-sm font-semibold text-white transition hover:bg-indigo-600 disabled:opacity-60"
          >
            <Lock size={16} />
            {submitting ? 'Placing order...' : 'Place order'}
          </button>

          <p className="mt-3 text-center text-xs text-stone-400">
            By placing your order you agree to our terms.
          </p>
        </aside>
      </form>
    </div>
  )
}