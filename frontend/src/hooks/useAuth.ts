import { useEffect } from 'react'
import { useAuthStore } from '../store/authStore'

export function useAuth() {
  const user = useAuthStore((state) => state.user)
  const token = useAuthStore((state) => state.token)
  const isLoading = useAuthStore((state) => state.isLoading)
  const setAuth = useAuthStore((state) => state.setAuth)
  const logout = useAuthStore((state) => state.logout)
  const hydrate = useAuthStore((state) => state.hydrate)

  const isAuthenticated = Boolean(token && user)

  useEffect(() => {
    void hydrate()
  }, [hydrate])

  return { user, token, isLoading, isAuthenticated, setAuth, logout, hydrate }
}