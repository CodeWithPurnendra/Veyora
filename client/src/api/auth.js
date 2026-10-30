const API_URL = import.meta.env.VITE_API_URL

export async function registerUser(name, email, password) {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  })

  const body = await response.json()

  if (!response.ok) {
    const error = new Error(body.message || 'Something went wrong')
    error.status = response.status
    throw error
  }

  return body
}

export async function loginUser(email, password) {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  const body = await response.json()

  if (!response.ok) {
    const error = new Error(body.message || 'Something went wrong')
    error.status = response.status
    throw error
  }

  return body
}

export async function getProfile(token) {
  const response = await fetch(`${API_URL}/api/auth/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  const body = await response.json()

  if (!response.ok) {
    const error = new Error(body.message || 'Something went wrong')
    error.status = response.status
    throw error
  }

  return body
}