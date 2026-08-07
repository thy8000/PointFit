import * as SecureStore from 'expo-secure-store'
import { AUTH_TOKEN_KEY, USER_DATA_KEY } from './constants'

export const storage = {
  async getToken(): Promise<string | null> {
    return SecureStore.getItemAsync(AUTH_TOKEN_KEY)
  },

  async setToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token)
  },

  async deleteToken(): Promise<void> {
    await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY)
  },

  async getUser<T = unknown>(): Promise<T | null> {
    const raw = await SecureStore.getItemAsync(USER_DATA_KEY)
    if (!raw) return null
    try {
      return JSON.parse(raw) as T
    } catch {
      return null
    }
  },

  async setUser<T>(user: T): Promise<void> {
    await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(user))
  },

  async deleteUser(): Promise<void> {
    await SecureStore.deleteItemAsync(USER_DATA_KEY)
  },

  async clearAll(): Promise<void> {
    await this.deleteToken()
    await this.deleteUser()
  },
}