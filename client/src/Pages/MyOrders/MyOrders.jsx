import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Package, ArrowRight } from 'lucide-react'
import { useAuth } from '../../Context/AuthContext'
import { getMyOrders } from '../../api/orders'

const statusStyles = {
  placed: 'bg-indigo-50 text-indigo-700',
  shipped: 'bg-amber-50 text-amber-700',
  delivered: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-700',
}

function formatDate(value) {
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function MyOrders() {
  const { token, logout } = useAuth()

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let ignore = false
    setLoading(true)
    setError('')

    getMyOrders(token)
      .then((data) => {
        if (!ignore) setOrders(data)
      })
      .catch((err) => {
        if (ignore) return
        // Login expired: log out, and ProtectedRoute sends them to /login
        if (err.status === 401) {
          logout()
          return
        }
        setError(
          err.status ? err.message : "We couldn't reach the server. Please try again in a moment."
        )
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
    // logout is stable enough here, and we only want to reload on a new token or retry
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, attempt])

  // Loading skeleton
  if (loading) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <div className="mb-8 h-10 w-48 animate-pulse rounded bg-stone-100" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-44 animate-pulse rounded-3xl bg-stone-100" />
        ))}
      </div>
    )
  }

  // Error screen
  if (error) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg font-semibold text-stone-900">Something went wrong</p>
        <p className="mt-1 text-sm text-stone-500">{error}</p>
        <button
          onClick={() => setAttempt((a) => a + 1)}
          className="mt-6 rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600"
        >
          Try again
        </button>
      </div>
    )
  }

  // No orders yet
  if (orders.length === 0) {
    return (
      <div className="py-24 text-center">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-stone-100 text-stone-400">
          <Package size={32} />
        </span>
        <h1 className="mt-6 text-2xl font-bold text-stone-900">No orders yet</h1>
        <p className="mt-2 text-stone-500">When you place an order, it will show up here.</p>
        <Link
          to="/products"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-stone-900 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-indigo-600"
        >
          Start shopping <ArrowRight size={16} />
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
          Your account
        </p>
        <h1 className="mt-1 text-4xl font-bold tracking-tight text-stone-900">My orders</h1>
        <p className="mt-2 text-stone-500">
          {orders.length} {orders.length === 1 ? 'order' : 'orders'}
        </p>
      </div>

      <ul className="space-y-5">
        {orders.map((order) => (
          <li
            key={order.orderNumber}
            className="rounded-3xl border border-stone-200 bg-white p-5 sm:p-6"
          >
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold tracking-wider text-stone-900">
                  {order.orderNumber}
                </p>
                <p className="mt-0.5 text-xs text-stone-500">
                  Placed on {formatDate(order.createdAt)}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                  statusStyles[order.status] ?? 'bg-stone-100 text-stone-700'
                }`}
              >
                {order.status}
              </span>
            </div>

            {/* Items */}
            <ul className="mt-5 space-y-3 border-t border-stone-100 pt-5">
              {order.items.map((item, index) => (
                <li key={`${item.productId}-${index}`} className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-14 w-14 shrink-0 rounded-xl bg-stone-100 object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-stone-900">{item.name}</p>
                    <p className="text-xs text-stone-500">
                      Qty {item.quantity} · ${item.price.toFixed(2)} each
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-stone-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </li>
              ))}
            </ul>

            {/* Footer */}
            <div className="mt-5 flex flex-wrap items-end justify-between gap-3 border-t border-stone-100 pt-5 text-sm">
              <div className="text-stone-500">
                <p>
                  {order.paymentMethod === 'cod' ? 'Cash on delivery' : 'Card'}
                  {' · '}
                  <span className="capitalize">{order.paymentStatus}</span>
                </p>
                <p className="mt-0.5">
                  Shipping to {order.shippingDetails.city}, {order.shippingDetails.postalCode}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-stone-500">Total</p>
                <p className="text-lg font-bold text-stone-900">${order.total.toFixed(2)}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}