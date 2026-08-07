import type { FastifyRequest } from 'fastify'
import { extractToken } from '../middlewares/auth.middleware'
import { verifyToken } from '../utils/jwt'

export interface GraphQLContext {
  userId?: string
}

export const buildContext = async (request: FastifyRequest): Promise<GraphQLContext> => {
  const token = extractToken(request.headers.authorization)
  if (!token) return {}

  try {
    const { userId } = verifyToken(token)
    return { userId }
  } catch {
    return {}
  }
}