import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../Context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  // Still verifying a saved login, so don't redirect yet
  if (loading) return null

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}