import { useState, useEffect } from 'react'
import { getProducts } from '../api/products'

export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)

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
  }, [attempt])

  const retry = () => setAttempt((a) => a + 1)

  return { products, loading, error, retry }
}