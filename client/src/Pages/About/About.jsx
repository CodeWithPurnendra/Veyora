import { Link } from 'react-router-dom'
import { ArrowRight, Leaf, Heart, Sparkles, Truck } from 'lucide-react'

const introImages = [
  'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
]

const stats = [
  { value: '10k+', label: 'Happy customers' },
  { value: '500+', label: 'Products shipped daily' },
  { value: '4.8', label: 'Average rating' },
  { value: '30', label: 'Day easy returns' },
]

const values = [
  {
    icon: Sparkles,
    title: 'Quality first',
    text: 'Every product is picked for how well it is made, not how loud its marketing is.',
  },
  {
    icon: Heart,
    title: 'Honest prices',
    text: 'No inflated markups or fake discounts. What you see is what it is worth.',
  },
  {
    icon: Leaf,
    title: 'Made to last',
    text: 'We prefer fewer, better things that stay useful for years instead of weeks.',
  },
  {
    icon: Truck,
    title: 'Fast and friendly',
    text: 'Quick delivery, easy returns, and a real person if something goes wrong.',
  },
]

export default function About() {
  return (
    <div className="space-y-24">
      {/* Intro */}
      <section className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
            About Veyora
          </p>
          <h1 className="mt-3 text-4xl font-bold leading-tight tracking-tight text-stone-900 sm:text-6xl">
            We believe good things{' '}
            <span className="italic font-light text-stone-400">shouldn't be hard to find.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-stone-500">
            Veyora started with a simple idea: shopping online should feel calm, honest, and a little
            bit fun. So we built a store around products we would actually buy ourselves.
          </p>
          <Link
            to="/products"
            className="group mt-8 inline-flex items-center gap-2 rounded-full bg-stone-900 px-8 py-4 text-sm font-semibold text-white transition hover:bg-indigo-600"
          >
            Explore the collection
            <ArrowRight size={16} className="transition group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <img
            src={introImages[0]}
            alt=""
            className="aspect-[3/4] w-full rounded-[2rem] object-cover"
          />
          <img
            src={introImages[1]}
            alt=""
            className="mt-10 aspect-[3/4] w-full rounded-[2rem] object-cover"
          />
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-3xl border border-stone-200 bg-white p-6 text-center sm:p-8"
          >
            <p className="text-3xl font-bold text-stone-900 sm:text-4xl">{s.value}</p>
            <p className="mt-1 text-sm text-stone-500">{s.label}</p>
          </div>
        ))}
      </section>

      {/* Story */}
      <section className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
          Our story
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-stone-900">
          Built from frustration, finished with care
        </h2>
        <p className="mt-5 leading-relaxed text-stone-500">
          We were tired of endless pages, confusing sizes, and products that looked nothing like their
          photos. So we started small: a short list of things we trusted, a clean store, and a promise
          to answer every message.
        </p>
        <p className="mt-4 leading-relaxed text-stone-500">
          Today the list is bigger, but the promise is the same. If we would not use it ourselves, it
          does not make it onto the shelf.
        </p>
      </section>

      {/* Values */}
      <section>
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
            What we stand for
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-stone-900">Our values</h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-3xl border border-stone-200 bg-white p-7 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-stone-900/5"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                <Icon size={22} />
              </span>
              <h3 className="mt-5 font-semibold text-stone-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-500">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden rounded-[2rem] bg-stone-900 px-6 py-16 text-center sm:px-12">
        <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-indigo-600/40 blur-3xl" />
        <div className="absolute -bottom-20 -right-12 h-64 w-64 rounded-full bg-purple-600/40 blur-3xl" />

        <div className="relative">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to find something you love?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-stone-300">
            Browse the collection and see why customers keep coming back.
          </p>
          <Link
            to="/products"
            className="mt-8 inline-block rounded-full bg-white px-8 py-4 text-sm font-semibold text-stone-900 transition hover:bg-indigo-50"
          >
            Shop now
          </Link>
        </div>
      </section>
    </div>
  )
}