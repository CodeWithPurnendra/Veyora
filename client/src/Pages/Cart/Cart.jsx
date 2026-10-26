import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Truck } from 'lucide-react'
import { useCart } from '../../Context/CartContext'

const FREE_SHIPPING_AT = 50
const SHIPPING_FEE = 5.99

export default function Cart() {
  const { items, updateQuantity, removeFromCart, clearCart, cartCount, cartTotal } = useCart()

  // Empty state
  if (items.length === 0) {
    return (
      <div className="py-24 text-center">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-stone-100 text-stone-400">
          <ShoppingBag size={32} />
        </span>
        <h1 className="mt-6 text-2xl font-bold text-stone-900">Your cart is empty</h1>
        <p className="mt-2 text-stone-500">Looks like you haven't added anything yet.</p>
        <Link
          to="/products"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-stone-900 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-indigo-600"
        >
          Start shopping <ArrowRight size={16} />
        </Link>
      </div>
    )
  }

  const shipping = cartTotal >= FREE_SHIPPING_AT ? 0 : SHIPPING_FEE
  const total = cartTotal + shipping
  const remaining = FREE_SHIPPING_AT - cartTotal
  const progress = Math.min(100, (cartTotal / FREE_SHIPPING_AT) * 100)

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
            Shopping cart
          </p>
          <h1 className="mt-1 text-4xl font-bold tracking-tight text-stone-900">Your cart</h1>
          <p className="mt-2 text-stone-500">
            {cartCount} {cartCount === 1 ? 'item' : 'items'}
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-sm font-medium text-stone-500 underline underline-offset-4 transition hover:text-red-600"
        >
          Clear cart
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Items */}
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 rounded-3xl border border-stone-200 bg-white p-4 sm:gap-6"
            >
              <Link
                to={`/products/${item.id}`}
                className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-stone-100 sm:h-32 sm:w-32"
              >
                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
              </Link>

              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-stone-400">
                      {item.category}
                    </p>
                    <Link to={`/products/${item.id}`}>
                      <h3 className="mt-0.5 font-semibold text-stone-900 transition hover:text-indigo-600">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="mt-1 text-sm text-stone-500">${item.price.toFixed(2)} each</p>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    aria-label={`Remove ${item.name}`}
                    className="rounded-full p-2 text-stone-400 transition hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  {/* Quantity */}
                  <div className="flex items-center rounded-full border border-stone-300">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      aria-label="Decrease quantity"
                      className="flex h-9 w-9 items-center justify-center rounded-full text-stone-700 transition hover:bg-stone-100 disabled:opacity-30"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      aria-label="Increase quantity"
                      className="flex h-9 w-9 items-center justify-center rounded-full text-stone-700 transition hover:bg-stone-100 disabled:opacity-30"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Line total */}
                  <p className="text-lg font-bold text-stone-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}

          <Link
            to="/products"
            className="inline-flex items-center gap-2 pt-2 text-sm font-medium text-stone-600 transition hover:text-indigo-600"
          >
            ← Continue shopping
          </Link>
        </div>

        {/* Order summary */}
        <aside className="h-fit rounded-3xl border border-stone-200 bg-white p-6 lg:sticky lg:top-28">
          <h2 className="text-lg font-bold text-stone-900">Order summary</h2>

          {/* Free shipping progress */}
          <div className="mt-5 rounded-2xl bg-stone-50 p-4">
            <p className="flex items-center gap-2 text-sm text-stone-600">
              <Truck size={16} className="text-indigo-600" />
              {remaining > 0
                ? `Add $${remaining.toFixed(2)} more for free shipping`
                : 'You got free shipping!'}
            </p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-stone-200">
              <div
                className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <dl className="mt-6 space-y-3 text-sm">
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

          <Link
            to="/checkout"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-stone-900 py-4 text-sm font-semibold text-white transition hover:bg-indigo-600"
          >
            Proceed to checkout <ArrowRight size={16} />
          </Link>
        </aside>
      </div>
    </div>
  )
}