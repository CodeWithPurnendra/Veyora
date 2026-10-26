import { Link } from 'react-router-dom'
import { ArrowRight, Truck, ShieldCheck, RefreshCw } from 'lucide-react'
import { products } from '../../Data/products';
import ProductCard from '../../Components/ProductCard/ProductCard';

const perks = [
    { icon: Truck, title: 'Free shipping', text: 'On all orders over $50' },
    { icon: RefreshCw, title: 'Easy returns', text: '30-day hassle-free returns' },
    { icon: ShieldCheck, title: 'Secure payments', text: 'Your details stay protected' },
]

export default function Home() {
    const featured = products.slice(0, 4)

    return (
        <div className="space-y-20">
            {/* Hero */}
            <section className="relative overflow-hidden rounded-[2rem] bg-stone-900 px-6 py-20 text-center sm:px-12 sm:py-28">
                {/* Decorative glows */}
                <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-indigo-600/40 blur-3xl" />
                <div className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-purple-600/40 blur-3xl" />

                <div className="relative mx-auto max-w-2xl">
                    <span className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-stone-200">
                        New season collection
                    </span>

                    <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-white sm:text-6xl">
                        Find things you'll{' '}
                        <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                            actually love
                        </span>
                    </h1>

                    <p className="mx-auto mt-5 max-w-lg text-base text-stone-300 sm:text-lg">
                        Thoughtfully designed products at honest prices, delivered straight to your door.
                    </p>

                    <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Link
                            to="/products"
                            className="group flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-stone-900 transition hover:bg-indigo-50"
                        >
                            Shop now
                            <ArrowRight size={16} className="transition group-hover:translate-x-1" />
                        </Link>
                        <Link
                            to="/collections"
                            className="rounded-full border border-white/30 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
                        >
                            Browse collections
                        </Link>
                    </div>
                </div>
            </section>

            {/* Perks */}
            <section className="grid gap-4 sm:grid-cols-3">
                {perks.map(({ icon: Icon, title, text }) => (
                    <div
                        key={title}
                        className="flex items-center gap-4 rounded-2xl border border-stone-200 bg-white p-5"
                    >
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                            <Icon size={22} />
                        </span>
                        <div>
                            <h3 className="font-semibold text-stone-900">{title}</h3>
                            <p className="text-sm text-stone-500">{text}</p>
                        </div>
                    </div>
                ))}
            </section>

            {/* Featured products */}
            <section>
                <div className="mb-8 flex items-end justify-between">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-[0.2em] text-indigo-600">
                            Handpicked for you
                        </p>
                        <h2 className="mt-1 text-3xl font-bold tracking-tight text-stone-900">
                            Featured products
                        </h2>
                    </div>
                    <Link
                        to="/products"
                        className="hidden items-center gap-1 text-sm font-medium text-stone-600 transition hover:text-indigo-600 sm:flex"
                    >
                        View all <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {featured.map((p) => (
                        <ProductCard key={p.id} product={p} />
                    ))}
                </div>
            </section>
        </div>
    )
}