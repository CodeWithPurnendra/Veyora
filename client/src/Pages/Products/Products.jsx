import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { getProducts } from '../../api/products'
import ProductCard from '../../Components/ProductCard/ProductCard'

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'name', label: 'Name: A to Z' },
]

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retry, setRetry] = useState(0)

  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('featured')
  const [searchParams] = useSearchParams()
  const urlCategory = searchParams.get('category') || 'All'
  const [category, setCategory] = useState(urlCategory)

  // Keep the selected category in sync with the URL
  useEffect(() => {
    setCategory(urlCategory)
  }, [urlCategory])

  // Load products from the API
  useEffect(() => {
    let ignore = false
    setLoading(true)
    setError('')

    getProducts()
      .then((data) => {
        if (!ignore) setProducts(data)
      })
      .catch((err) => {
        if (!ignore) setError(err.message)
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [retry])

  const categories = ['All', ...new Set(products.map((p) => p.category))]

  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      const matchesCategory = category === 'All' || p.category === category
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
      return matchesCategory && matchesSearch
    })

    switch (sort) {
      case 'price-asc':
        result = [...result].sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result = [...result].sort((a, b) => b.price - a.price)
        break
      case 'rating':
        result = [...result].sort((a, b) => b.rating - a.rating)
        break
      case 'name':
        result = [...result].sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        break
    }

    return result
  }, [products, search, category, sort])

  const clearFilters = () => {
    setSearch('')
    setCategory('All')
    setSort('featured')
  }

  const hasFilters = search || category !== 'All' || sort !== 'featured'

  // Loading screen
  if (loading) {
    return <p className="py-20 text-center text-stone-500">Loading products...</p>
  }

  // Error screen
  if (error) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg font-semibold text-stone-900">Something went wrong</p>
        <p className="mt-1 text-sm text-stone-500">We couldn't load the products.</p>
        <button
          onClick={() => setRetry((r) => r + 1)}
          className="mt-6 rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600"
        >
          Try again
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
          The collection
        </p>
        <h1 className="mt-1 text-4xl font-bold tracking-tight text-stone-900">
          All products
        </h1>
        <p className="mt-2 text-stone-500">
          Showing {filtered.length} of {products.length} products
        </p>
      </div>

      {/* Toolbar */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          {/* Search */}
          <div className="flex flex-1 items-center gap-3 rounded-full border border-stone-200 bg-white px-5 py-3 focus-within:border-stone-400">
            <Search size={18} className="text-stone-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-stone-400"
            />
            {search && (
              <button onClick={() => setSearch('')} aria-label="Clear search">
                <X size={16} className="text-stone-400 hover:text-stone-700" />
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2 rounded-full border border-stone-200 bg-white px-5 py-3">
            <SlidersHorizontal size={16} className="text-stone-400" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="cursor-pointer bg-transparent text-sm outline-none"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category pills */}
        <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:px-0">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`shrink-0 rounded-full px-5 py-2 text-sm font-medium transition ${category === c
                  ? 'bg-stone-900 text-white'
                  : 'border border-stone-200 bg-white text-stone-600 hover:border-stone-400'
                }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-stone-300 bg-white py-20 text-center">
          <p className="text-lg font-semibold text-stone-900">No products found</p>
          <p className="mt-1 text-sm text-stone-500">
            Try a different search or category.
          </p>
          <button
            onClick={clearFilters}
            className="mt-6 rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Clear filters link under results */}
      {hasFilters && filtered.length > 0 && (
        <div className="mt-10 text-center">
          <button
            onClick={clearFilters}
            className="text-sm font-medium text-stone-500 underline underline-offset-4 transition hover:text-stone-900"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  )
}