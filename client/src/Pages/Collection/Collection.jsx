import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { useProducts } from '../../hooks/useProducts'
import ProductCard from '../../Components/ProductCard/ProductCard'

// Optional taglines. Any category not listed here gets the default one.
const taglines = {
  Bags: 'Carry everything in style',
  Electronics: 'Smart tech for everyday life',
  Accessories: 'The finishing touches',
  Footwear: 'Comfort for every step',
  Home: 'Little things that make a home',
}

const slugify = (name) => name.toLowerCase().replace(/\s+/g, '-')

export default function Collections() {
  const { products, loading, error } = useProducts()

  // Build one collection per category straight from the product data
  const collections = [...new Set(products.map((p) => p.category))].map((name) => {
    const items = products.filter((p) => p.category === name)
    return {
      name,
      slug: slugify(name),
      tagline: taglines[name] ?? 'Handpicked for you',
      image: items[0].image,
      items,
    }
  })

  return (
    <div className="space-y-20">
      {/* Header */}
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
          Browse
        </p>
        <h1 className="mt-1 text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
          Our collections
        </h1>
        <p className="mt-3 max-w-xl text-stone-500">
          Explore Veyora by category. Every collection is curated, so you can skip the scrolling and
          go straight to what you need.
        </p>
      </section>

      {loading ? (
        // Grey placeholder tiles while loading
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`h-72 animate-pulse rounded-[2rem] bg-stone-100 ${
                i === 0 ? 'lg:col-span-2' : ''
              }`}
            />
          ))}
        </section>
      ) : error ? (
        <p className="rounded-3xl border border-dashed border-stone-300 bg-white py-12 text-center text-stone-500">
          We couldn't load collections right now. Please try again in a moment.
        </p>
      ) : (
        <>
          {/* Collection tiles */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((c, i) => (
              <Link
                key={c.slug}
                to={`/products?category=${encodeURIComponent(c.name)}`}
                className={`group relative h-72 overflow-hidden rounded-[2rem] ${
                  i === 0 ? 'lg:col-span-2' : ''
                }`}
              >
                <img
                  src={c.image}
                  alt={c.name}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                <div className="absolute inset-x-6 bottom-6 flex items-end justify-between text-white">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/70">
                      {c.items.length} {c.items.length === 1 ? 'item' : 'items'}
                    </p>
                    <h2 className="mt-1 text-2xl font-bold">{c.name}</h2>
                    <p className="mt-1 text-sm text-white/80">{c.tagline}</p>
                  </div>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur transition group-hover:bg-white group-hover:text-stone-900">
                    <ArrowUpRight size={18} />
                  </span>
                </div>
              </Link>
            ))}
          </section>

          {/* One section per collection */}
          {collections.map((c) => (
            <section key={c.slug} id={c.slug} className="scroll-mt-32">
              <div className="mb-8 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
                    {c.tagline}
                  </p>
                  <h2 className="mt-1 text-3xl font-bold tracking-tight text-stone-900">
                    {c.name}
                  </h2>
                </div>
                <Link
                  to={`/products?category=${encodeURIComponent(c.name)}`}
                  className="flex shrink-0 items-center gap-1 text-sm font-medium text-stone-600 transition hover:text-indigo-600"
                >
                  View all <ArrowRight size={16} />
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {c.items.slice(0, 4).map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          ))}
        </>
      )}
    </div>
  )
}