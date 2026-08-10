import type { FastifyRequest } from 'fastify'
import { verifyToken } from '../utils/jwt'
import { AppError } from '../shared/errors/app-error'

export interface AuthUser {
  userId: string
}
type AuthContext = AuthUser

export const extractToken = (authorization?: string): string | null => {
  if (!authorization || authorization === '') return null
  const [scheme, token] = authorization.split(' ')
  if (scheme !== 'Bearer' || !token) return null
  return token
}

export const getUserIdFromRequest = async (request: FastifyRequest): Promise<AuthUser | null> => {
  const token = extractToken(request.headers.authorization)
  if (!token) return null
  try {
    const payload = verifyToken(token)
    return { userId: payload.userId }
  } catch {
    return null
  }
}

export const authMiddleware = async (request: FastifyRequest) => {
  const auth = await getUserIdFromRequest(request)
  if (!auth) {
    throw new AppError(401, 'UNAUTHORIZED', 'Token de autenticação inválido ou ausente')
  }
  request.auth = auth
}

declare module 'fastify' {
  interface FastifyRequest {
    auth?: AuthContext
  }
}