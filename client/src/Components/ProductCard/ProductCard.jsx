import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Plus, Check, Star } from 'lucide-react'
import { useCart } from '../../Context/CartContext'
export default function ProductCard({ product }) {
  const [liked, setLiked] = useState(false)
  const [added, setAdded] = useState(false)
  const { addToCart } = useCart()
  const rating = product.rating ?? 4.5 // fallback until products have ratings

  const handleAddToCart = () => {
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="group overflow-hidden rounded-3xl border border-stone-200 bg-white p-3 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-900/10">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-stone-100">
        <Link to={`/products/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Category chip */}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-stone-700 backdrop-blur">
          {product.category}
        </span>

        {/* Wishlist */}
        <button
          onClick={() => setLiked(!liked)}
          aria-label="Add to wishlist"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur transition hover:scale-110"
        >
          <Heart
            size={17}
            className={liked ? 'fill-red-500 text-red-500' : 'text-stone-700'}
          />
        </button>
      </div>

      {/* Info */}
      <div className="px-2 pb-1 pt-4">
        {/* Rating */}
        <div className="mb-2 flex items-center gap-1">
          <Star size={14} className="fill-amber-400 text-amber-400" />
          <span className="text-xs font-medium text-stone-600">{rating.toFixed(1)}</span>
        </div>

        <Link to={`/products/${product.id}`}>
          <h3 className="line-clamp-1 font-semibold text-stone-900 transition hover:text-indigo-600">
            {product.name}
          </h3>
        </Link>

        <p className="mt-1 line-clamp-1 text-sm text-stone-500">
          {product.description}
        </p>

        {/* Price + add button */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-lg font-bold text-stone-900">
            ${product.price.toFixed(2)}
          </p>

          <button
            onClick={handleAddToCart}
            aria-label="Add to cart"
            className={`flex h-10 w-10 items-center justify-center rounded-full text-white transition-all duration-300 ${added ? 'scale-110 bg-green-500' : 'bg-stone-900 hover:bg-indigo-600'
              }`}
          >
            {added ? <Check size={18} /> : <Plus size={18} />}
          </button>
        </div>
      </div>
    </div>
  )
}