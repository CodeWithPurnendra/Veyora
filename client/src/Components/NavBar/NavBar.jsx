import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ShoppingBag, Search, User, Menu, X, LogOut, Package } from 'lucide-react'
import { useCart } from '../../Context/CartContext'
import { useAuth } from '../../Context/AuthContext'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/products', label: 'Shop' },
  { to: '/collections', label: 'Collections' },
  { to: '/about', label: 'About' },
]

export default function NavBar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  const { cartCount } = useCart()
  const { user, isAuthenticated, loading, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the account dropdown when clicking outside it or pressing Escape
  useEffect(() => {
    if (!menuOpen) return

    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }

    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
    setOpen(false)
    navigate('/')
  }

  const linkClass = ({ isActive }) =>
    `rounded-full px-4 py-2 text-sm font-medium transition-all ${
      isActive
        ? 'bg-stone-900 text-white shadow-sm'
        : 'text-stone-600 hover:bg-stone-900/5 hover:text-stone-900'
    }`

  const initial = user?.name?.trim()?.[0]?.toUpperCase() ?? '?'

  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4">
      <nav
        className={`mx-auto flex max-w-5xl items-center justify-between rounded-full border px-3 py-2 backdrop-blur-xl transition-all duration-300 ${
          scrolled
            ? 'border-stone-200 bg-white/90 shadow-lg shadow-stone-900/5'
            : 'border-white/50 bg-white/60 shadow-md shadow-stone-900/5'
        }`}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 pl-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white">
            V
          </span>
          <span className="text-lg font-semibold tracking-tight text-stone-900">Veyora</span>
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

          {/* Account */}
          {loading ? (
            // Placeholder while a saved login is being checked, so the icon doesn't flicker
            <span className="hidden h-9 w-9 animate-pulse rounded-full bg-stone-200 sm:block" />
          ) : isAuthenticated ? (
            <div className="relative hidden sm:block" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((m) => !m)}
                aria-label="Account menu"
                aria-expanded={menuOpen}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-900 text-sm font-semibold text-white transition hover:bg-indigo-600"
              >
                {initial}
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-12 w-64 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xl">
                  <div className="border-b border-stone-100 px-4 py-3">
                    <p className="truncate text-sm font-semibold text-stone-900">{user.name}</p>
                    <p className="truncate text-xs text-stone-500">{user.email}</p>
                  </div>
                  <Link
                    to="/orders"
                    onClick={() => setMenuOpen(false)}
                    className="flex w-full items-center gap-2 px-4 py-3 text-sm text-stone-700 transition hover:bg-stone-50"
                  >
                    <Package size={16} />
                    My orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-3 text-sm text-stone-700 transition hover:bg-stone-50"
                  >
                    <LogOut size={16} />
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden rounded-full p-2.5 text-stone-700 transition hover:bg-stone-900/5 sm:block"
              aria-label="Log in"
            >
              <User size={18} />
            </Link>
          )}

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
        className={`mx-auto mt-2 max-w-5xl origin-top overflow-hidden rounded-3xl border border-stone-200 bg-white/95 shadow-xl backdrop-blur-xl transition-all duration-300 md:hidden ${
          open
            ? 'max-h-[32rem] scale-100 opacity-100'
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
                `rounded-2xl px-4 py-3 text-sm font-medium ${
                  isActive ? 'bg-stone-900 text-white' : 'text-stone-700 hover:bg-stone-100'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}

          <div className="my-1 border-t border-stone-200" />

          {isAuthenticated ? (
            <>
              <div className="px-4 py-2">
                <p className="truncate text-sm font-semibold text-stone-900">{user.name}</p>
                <p className="truncate text-xs text-stone-500">{user.email}</p>
              </div>
              <NavLink
                to="/orders"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium text-stone-700 hover:bg-stone-100"
              >
                <Package size={16} />
                My orders
              </NavLink>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-2xl px-4 py-3 text-left text-sm font-medium text-stone-700 hover:bg-stone-100"
              >
                <LogOut size={16} />
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm font-medium text-stone-700 hover:bg-stone-100"
              >
                Log in
              </NavLink>
              <NavLink
                to="/register"
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm font-medium text-stone-700 hover:bg-stone-100"
              >
                Create account
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  )
}