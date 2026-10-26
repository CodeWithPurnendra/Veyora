import { Link } from 'react-router-dom'
import { FaXTwitter, FaLinkedinIn } from 'react-icons/fa6'

const shopLinks = [
  { to: '/products', label: 'All Products' },
  { to: '/collections', label: 'Collections' },
  { to: '/products', label: 'New Arrivals' },
]

const helpLinks = [
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
  { to: '/shipping', label: 'Shipping & Returns' },
]

export default function Footer() {
  return (
    <footer className="mt-20 bg-stone-900 text-stone-300">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div className="lg:col-span-1">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white">
              V
            </span>
            <span className="text-lg font-semibold tracking-tight text-white">Veyora</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-stone-400">
            Thoughtfully designed products, delivered to your door.
          </p>
        </div>

        {/* Shop */}
        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white">Shop</h4>
          <ul className="space-y-3 text-sm">
            {shopLinks.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="transition hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Help */}
        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white">Help</h4>
          <ul className="space-y-3 text-sm">
            {helpLinks.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="transition hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white">Stay in touch</h4>
          <p className="mb-3 text-sm text-stone-400">Get updates on new arrivals.</p>
          <div className="flex overflow-hidden rounded-full bg-stone-800 focus-within:ring-2 focus-within:ring-indigo-500">
            <input
              type="email"
              placeholder="Your email"
              className="w-full bg-transparent px-4 py-2.5 text-sm text-white outline-none placeholder:text-stone-500"
            />
            <button className="bg-indigo-600 px-4 text-sm font-medium text-white transition hover:bg-indigo-500">
              Join
            </button>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-stone-800">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-6 text-xs text-stone-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Veyora. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a
              href="https://x.com/yourusername"
              target="_blank"
              rel="noreferrer"
              aria-label="X (Twitter)"
              className="transition hover:text-white"
            >
              <FaXTwitter size={18} />
            </a>
            <a
              href="https://linkedin.com/in/yourusername"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="transition hover:text-white"
            >
              <FaLinkedinIn size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}