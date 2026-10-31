const API_URL = import.meta.env.VITE_API_URL

export async function createOrder(token, orderData) {
  const response = await fetch(`${API_URL}/api/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  })

  const body = await response.json()

  if (!response.ok) {
    const error = new Error(body.message || 'Something went wrong')
    error.status = response.status
    throw error
  }

  return body.order
}

export async function getMyOrders(token) {
  const response = await fetch(`${API_URL}/api/orders`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  const body = await response.json()

  if (!response.ok) {
    const error = new Error(body.message || 'Something went wrong')
    error.status = response.status
    throw error
  }

  return body.orders
}