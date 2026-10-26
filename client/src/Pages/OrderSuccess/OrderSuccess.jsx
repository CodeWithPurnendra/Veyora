import { Link, Navigate, useLocation } from 'react-router-dom'
import { Check, Package, Mail, ArrowRight } from 'lucide-react'

export default function OrderSuccess() {
    const { state } = useLocation()
    const order = state?.order

    // Someone opened this URL directly, with no order to show
    if (!order) {
        return <Navigate to="/" replace />
    }

    const paymentLabel = order.payment === 'cod' ? 'Cash on delivery' : 'Card'

    return (
        <div className="mx-auto max-w-2xl py-8 text-center sm:py-12">
            {/* Check icon */}
            <div className="relative mx-auto h-24 w-24">
                <span className="absolute inset-0 animate-ping rounded-full bg-green-200 opacity-60" />
                <span className="relative flex h-24 w-24 items-center justify-center rounded-full bg-green-500 text-white">
                    <Check size={44} strokeWidth={3} />
                </span>
            </div>

            <h1 className="mt-8 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
                Thank you, {order.customer.fullName.split(' ')[0]}!
            </h1>
            <p className="mt-3 text-stone-500">
                Your order has been placed. We've sent the details to{' '}
                <span className="font-medium text-stone-900">{order.customer.email}</span>.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-stone-100 px-5 py-2 text-sm">
                <span className="text-stone-500">Order number</span>
                <span className="font-bold tracking-wider text-stone-900">{order.id}</span>
            </div>

            {/* Order details */}
            <div className="mt-10 rounded-3xl border border-stone-200 bg-white p-6 text-left sm:p-8">
                <h2 className="text-lg font-bold text-stone-900">Order summary</h2>

                <ul className="mt-5 space-y-4">
                    {order.items.map((item) => (
                        <li key={item.id} className="flex items-center gap-4">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="h-16 w-16 rounded-xl bg-stone-100 object-cover"
                            />
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-stone-900">{item.name}</p>
                                <p className="text-xs text-stone-500">Qty: {item.quantity}</p>
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
                        <dd className="font-medium text-stone-900">${order.subtotal.toFixed(2)}</dd>
                    </div>
                    <div className="flex justify-between">
                        <dt className="text-stone-500">Shipping</dt>
                        <dd className="font-medium text-stone-900">
                            {order.shipping === 0 ? 'Free' : `$${order.shipping.toFixed(2)}`}
                        </dd>
                    </div>
                    <div className="flex justify-between border-t border-stone-200 pt-4 text-base">
                        <dt className="font-semibold text-stone-900">Total</dt>
                        <dd className="font-bold text-stone-900">${order.total.toFixed(2)}</dd>
                    </div>
                </dl>

                <div className="mt-6 grid gap-4 border-t border-stone-200 pt-5 text-sm sm:grid-cols-2">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                            Shipping to
                        </p>
                        <p className="mt-2 text-stone-700">
                            {order.customer.fullName}
                            <br />
                            {order.customer.address}
                            <br />
                            {order.customer.city}, {order.customer.postalCode}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                            Payment
                        </p>
                        <p className="mt-2 text-stone-700">{paymentLabel}</p>
                    </div>
                </div>
            </div>

            {/* What happens next */}
            <div className="mt-6 grid gap-4 text-left sm:grid-cols-2">
                <div className="flex items-start gap-3 rounded-2xl bg-indigo-50 p-5">
                    <Mail size={20} className="mt-0.5 shrink-0 text-indigo-600" />
                    <div>
                        <p className="text-sm font-semibold text-stone-900">Confirmation email</p>
                        <p className="mt-0.5 text-xs text-stone-600">
                            You'll get a receipt as soon as your order is confirmed.
                        </p>
                    </div>
                </div>
                <div className="flex items-start gap-3 rounded-2xl bg-indigo-50 p-5">
                    <Package size={20} className="mt-0.5 shrink-0 text-indigo-600" />
                    <div>
                        <p className="text-sm font-semibold text-stone-900">On its way soon</p>
                        <p className="mt-0.5 text-xs text-stone-600">
                            We'll let you know when your order ships.
                        </p>
                    </div>
                </div>
            </div>

            <Link
                to="/products"
                className="mt-10 inline-flex items-center gap-2 rounded-full bg-stone-900 px-8 py-4 text-sm font-semibold text-white transition hover:bg-indigo-600"
            >
                Continue shopping <ArrowRight size={16} />
            </Link>
        </div>
    )
}