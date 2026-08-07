import { create } from 'zustand'
import type { PublicUser } from '../types/graphql'
import { storage } from '../utils/storage'

interface AuthState {
  user: PublicUser | null
  token: string | null
  isLoading: boolean
  setAuth: (user: PublicUser, token: string) => Promise<void>
  setUser: (user: PublicUser) => void
  logout: () => Promise<void>
  hydrate: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,

  setAuth: async (user, token) => {
    await storage.setToken(token)
    await storage.setUser(user)
    set({ user, token, isLoading: false })
  },

  setUser: (user) => {
    set({ user })
  },

  logout: async () => {
    await storage.clearAll()
    set({ user: null, token: null, isLoading: false })
  },

  hydrate: async () => {
    try {
      const token = await storage.getToken()
      const user = await storage.getUser<PublicUser>()

      if (token && user) {
        set({ user, token, isLoading: false })
      } else {
        set({ isLoading: false })
      }
    } catch (error) {
      console.error('Falha ao hidratar sessão:', error)
      set({ user: null, token: null, isLoading: false })
    }
  },
}))