import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ShoppingBag, Search, User, Menu, X } from 'lucide-react'
import { useCart } from '../../Context/CartContext';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/collections', label: 'Collections' },
  { to: '/products', label: 'Shop' },
  { to: '/about', label: 'About' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { cartCount } = useCart()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const linkClass = ({ isActive }) =>
    `rounded-full px-4 py-2 text-sm font-medium transition-all ${isActive
      ? 'bg-stone-900 text-white shadow-sm'
      : 'text-stone-600 hover:bg-stone-900/5 hover:text-stone-900'
    }`

  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4">
      <nav
        className={`mx-auto flex max-w-5xl items-center justify-between rounded-full border px-3 py-2 backdrop-blur-xl transition-all duration-300 ${scrolled
          ? 'border-stone-200 bg-white/90 shadow-lg shadow-stone-900/5'
          : 'border-white/50 bg-white/60 shadow-md shadow-stone-900/5'
          }`}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 pl-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white">
            V
          </span>
          <span className="text-lg font-semibold tracking-tight text-stone-900">
            Veyora
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            className="rounded-full p-2.5 text-stone-700 transition hover:bg-stone-900/5"
            aria-label="Search"
          >
            <Search size={18} />
          </button>

          <Link
            to="/login"
            className="hidden rounded-full p-2.5 text-stone-700 transition hover:bg-stone-900/5 sm:block"
            aria-label="Account"
          >
            <User size={18} />
          </Link>

          <Link
            to="/cart"
            className="flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-600"
          >
            <ShoppingBag size={16} />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[11px] font-bold text-stone-900">
                {cartCount}
              </span>
            )}
          </Link>

          <button
            onClick={() => setOpen(!open)}
            className="rounded-full p-2.5 text-stone-700 transition hover:bg-stone-900/5 md:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown card */}
      <div
        className={`mx-auto mt-2 max-w-5xl origin-top overflow-hidden rounded-3xl border border-stone-200 bg-white/95 shadow-xl backdrop-blur-xl transition-all duration-300 md:hidden ${open
          ? 'max-h-96 scale-100 opacity-100'
          : 'pointer-events-none max-h-0 scale-95 opacity-0'
          }`}
      >
        <div className="flex flex-col gap-1 p-3">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `rounded-2xl px-4 py-3 text-sm font-medium ${isActive ? 'bg-stone-900 text-white' : 'text-stone-700 hover:bg-stone-100'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <NavLink
            to="/login"
            onClick={() => setOpen(false)}
            className="rounded-2xl px-4 py-3 text-sm font-medium text-stone-700 hover:bg-stone-100"
          >
            Account
          </NavLink>
        </div>
      </div>
    </header>
  )
}