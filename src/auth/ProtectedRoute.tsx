import type { ReactElement } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { useAuth } from './AuthProvider'

export default function ProtectedRoute({ children }: { children: ReactElement }) {
  const { session, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-300">
        Validando sesion...
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}
