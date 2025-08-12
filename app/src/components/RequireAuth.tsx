import type { PropsWithChildren } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthenticationStatus } from '@nhost/react'

export function RequireAuth({ children }: PropsWithChildren) {
  const { isAuthenticated, isLoading } = useAuthenticationStatus()
  const location = useLocation()

  if (isLoading) {
    return <div style={{ padding: 16 }}>Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace state={{ from: location }} />
  }

  return children
}

export default RequireAuth