const API_URL = import.meta.env.VITE_API_URL

export async function getProducts() {
  const response = await fetch(`${API_URL}/api/products`)

  if (!response.ok) {
    throw new Error('Request failed with status ' + response.status)
  }

  const json = await response.json()
  return json.data
}

export async function getProductById(id) {
  const response = await fetch(`${API_URL}/api/products/${id}`)

  if (!response.ok) {
    const error = new Error('Request failed with status ' + response.status)
    error.status = response.status
    throw error
  }

  const json = await response.json()
  return json.data
}