import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ChevronRight,
  Star,
  Minus,
  Plus,
  Heart,
  ShoppingBag,
  Check,
  Truck,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react'
import { products } from '../../Data/products'
import ProductCard from '../../Components/ProductCard/ProductCard'
import { useCart } from '../../Context/CartContext'
const perks = [
  { icon: Truck, text: 'Free shipping on orders over $50' },
  { icon: RefreshCw, text: '30-day easy returns' },
  { icon: ShieldCheck, text: 'Secure checkout' },
]

export default function ProductDetail() {
  const { id } = useParams()
  const product = products.find((p) => p.id === Number(id))
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [liked, setLiked] = useState(false)
  const [added, setAdded] = useState(false)

  // Product not found
  if (!product) {
    return (
      <div className="py-24 text-center">
        <p className="text-2xl font-bold text-stone-900">Product not found</p>
        <p className="mt-2 text-stone-500">
          This product doesn't exist or may have been removed.
        </p>
        <Link
          to="/products"
          className="mt-6 inline-block rounded-full bg-stone-900 px-7 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600"
        >
          Back to products
        </Link>
      </div>
    )
  }

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  const inStock = product.stock > 0
  const lowStock = product.stock > 0 && product.stock <= 5

  const handleAddToCart = () => {
    addToCart(product, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="space-y-20">
      <div>
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-stone-500">
          <Link to="/" className="transition hover:text-stone-900">Home</Link>
          <ChevronRight size={14} />
          <Link to="/products" className="transition hover:text-stone-900">Products</Link>
          <ChevronRight size={14} />
          <span className="text-stone-900">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Image */}
          <div className="overflow-hidden rounded-[2rem] bg-stone-100">
            <img
              src={product.image}
              alt={product.name}
              className="aspect-square w-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
              {product.category}
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="mt-3 flex items-center gap-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < Math.round(product.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-stone-300'
                    }
                  />
                ))}
              </div>
              <span className="text-sm text-stone-500">{product.rating.toFixed(1)}</span>
            </div>

            <p className="mt-6 text-3xl font-bold text-stone-900">
              ${product.price.toFixed(2)}
            </p>

            <p className="mt-4 leading-relaxed text-stone-600">{product.description}</p>

            {/* Stock status */}
            <p
              className={`mt-5 flex items-center gap-2 text-sm font-medium ${!inStock ? 'text-red-600' : lowStock ? 'text-amber-600' : 'text-green-600'
                }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${!inStock ? 'bg-red-500' : lowStock ? 'bg-amber-500' : 'bg-green-500'
                  }`}
              />
              {!inStock
                ? 'Out of stock'
                : lowStock
                  ? `Only ${product.stock} left in stock`
                  : 'In stock'}
            </p>

            {/* Quantity + actions */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {/* Quantity selector */}
              <div className="flex items-center rounded-full border border-stone-300">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                  className="flex h-12 w-12 items-center justify-center rounded-full text-stone-700 transition hover:bg-stone-100 disabled:opacity-30"
                >
                  <Minus size={16} />
                </button>
                <span className="w-10 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock}
                  aria-label="Increase quantity"
                  className="flex h-12 w-12 items-center justify-center rounded-full text-stone-700 transition hover:bg-stone-100 disabled:opacity-30"
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Add to cart */}
              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className={`flex h-12 flex-1 items-center justify-center gap-2 rounded-full px-8 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-stone-300 ${added ? 'bg-green-500' : 'bg-stone-900 hover:bg-indigo-600'
                  }`}
              >
                {added ? <Check size={18} /> : <ShoppingBag size={18} />}
                {added ? 'Added to cart' : 'Add to cart'}
              </button>

              {/* Wishlist */}
              <button
                onClick={() => setLiked(!liked)}
                aria-label="Add to wishlist"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-stone-300 transition hover:bg-stone-100"
              >
                <Heart
                  size={18}
                  className={liked ? 'fill-red-500 text-red-500' : 'text-stone-700'}
                />
              </button>
            </div>

            {/* Total */}
            {inStock && quantity > 1 && (
              <p className="mt-3 text-sm text-stone-500">
                Total: ${(product.price * quantity).toFixed(2)}
              </p>
            )}

            {/* Perks */}
            <ul className="mt-10 space-y-3 border-t border-stone-200 pt-8">
              {perks.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-sm text-stone-600">
                  <Icon size={18} className="text-stone-400" />
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section>
          <h2 className="mb-8 text-2xl font-bold tracking-tight text-stone-900">
            You might also like
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}