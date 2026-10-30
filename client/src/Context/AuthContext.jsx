import { createContext, useContext, useState, useEffect } from 'react'
import { loginUser, registerUser, getProfile } from '../api/auth'

const TOKEN_KEY = 'veyora-token'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(null)
  // Only "loading" if there is a saved token we still need to check
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem(TOKEN_KEY)))

  // On startup: check that the saved token is still valid and load the user
  useEffect(() => {
    if (!token) return

    let ignore = false

    getProfile(token)
      .then((body) => {
        if (!ignore) setUser(body.user)
      })
      .catch(() => {
        // Expired, forged, or the account no longer exists
        if (!ignore) {
          localStorage.removeItem(TOKEN_KEY)
          setToken(null)
          setUser(null)
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
    // Runs once on startup only. Later logins set the user directly.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const login = async (email, password) => {
    const body = await loginUser(email, password)
    localStorage.setItem(TOKEN_KEY, body.token)
    setToken(body.token)
    setUser(body.user)
  }

  const register = async (name, email, password) => {
    const body = await registerUser(name, email, password)
    localStorage.setItem(TOKEN_KEY, body.token)
    setToken(body.token)
    setUser(body.user)
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}