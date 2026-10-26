import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Home, ShoppingBag, Dices } from 'lucide-react'

const excuses = [
  {
    title: 'This page left without paying',
    text: "We checked every aisle. It's not here. Honestly, we're a little offended it didn't say goodbye.",
  },
  {
    title: 'You typed the URL yourself, didn’t you?',
    text: "It's okay, we all do it. The page doesn't exist, but your confidence is impressive.",
  },
  {
    title: 'Plot twist: there was never a page',
    text: "Our developer insists it worked on his machine. We've stopped asking questions.",
  },
  {
    title: 'Error 404: Page on a coffee break',
    text: "It said it'd be back in 5 minutes. That was three deployments ago.",
  },
  {
    title: 'Congratulations, you broke the internet',
    text: "Not really. But you did find a page that doesn't exist, and that takes some talent.",
  },
  {
    title: 'This page is in another cart',
    text: "Unlike your wishlist, which we're pretty sure keeps growing. Let's go find something real.",
  },
]

export default function NotFound() {
  const navigate = useNavigate()
  const [index, setIndex] = useState(() => Math.floor(Math.random() * excuses.length))
  const [rolls, setRolls] = useState(0)

  const rollAgain = () => {
    // Pick a different excuse than the current one
    let next = index
    while (next === index) {
      next = Math.floor(Math.random() * excuses.length)
    }
    setIndex(next)
    setRolls((r) => r + 1)
  }

  const excuse = excuses[index]

  return (
    <div className="relative overflow-hidden py-16 text-center sm:py-24">
      {/* Decorative glow */}
      <div className="absolute left-1/2 top-10 h-64 w-64 -translate-x-1/2 rounded-full bg-indigo-200/50 blur-3xl" />

      <div className="relative">
        {/* 4 [bag] 4 */}
        <div className="flex items-center justify-center gap-2 text-8xl font-extrabold tracking-tighter text-stone-900 sm:gap-4 sm:text-9xl">
          <span>4</span>
          <span className="flex h-20 w-20 animate-bounce items-center justify-center rounded-full bg-indigo-600 text-white sm:h-28 sm:w-28">
            <ShoppingBag className="h-10 w-10 sm:h-14 sm:w-14" />
          </span>
          <span>4</span>
        </div>

        <h1 className="mx-auto mt-8 max-w-xl text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
          {excuse.title}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-stone-500">{excuse.text}</p>

        {/* Reroll */}
        <button
          onClick={rollAgain}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-stone-100 px-5 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-200"
        >
          <Dices size={16} />
          Give me another excuse
        </button>

        {rolls >= 3 && (
          <p className="mt-3 text-xs text-stone-400">
            You know the page is still not coming back, right?
          </p>
        )}

        {/* Actions */}
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 rounded-full border border-stone-300 px-7 py-3.5 text-sm font-semibold text-stone-900 transition hover:bg-stone-100"
          >
            <ArrowLeft size={16} />
            Retreat quietly
          </button>
          <Link
            to="/"
            className="flex items-center gap-2 rounded-full bg-stone-900 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-indigo-600"
          >
            <Home size={16} />
            Take me home
          </Link>
        </div>
      </div>
    </div>
  )
}