import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import type { GraphQLFormattedError } from 'graphql'
import type { ZodError } from 'zod'
import { AppError } from '../shared/errors/app-error'
import { logger } from '../shared/logger/logger'

interface ErrorResponse {
  message: string
  code: string
  statusCode: number
  details?: unknown
}

const toErrorResponse = (error: unknown): ErrorResponse => {
  if (isAppError(error)) {
    return { message: error.message, code: error.code, statusCode: error.statusCode }
  }
  if (isZodError(error)) {
    return {
      message: 'Dados inválidos',
      code: 'VALIDATION_ERROR',
      statusCode: 422,
      details: error.issues,
    }
  }
  logger.error(error)
  return { message: 'Erro interno do servidor', code: 'INTERNAL_ERROR', statusCode: 500 }
}

export const errorHandler = (
  error: FastifyError,
  _request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { message, code, statusCode, details } = toErrorResponse(error)
  reply.status(statusCode).send({ message, code, statusCode, details })
}

// Duck-typing em vez de instanceof: em ambientes com módulos duplicados
// (CJS/ESM), instanceof de GraphQLError/ZodError pode falhar.
const unwrapOriginalError = (error: unknown): unknown => {
  let current = error
  let guard = 0
  while (current && typeof current === 'object' && guard < 10) {
    const originalError = (current as { originalError?: unknown }).originalError
    if (!originalError) break
    current = originalError
    guard++
  }
  return current
}

const isAppError = (error: unknown): error is AppError => {
  const candidate = error as Partial<AppError>
  return (
    typeof candidate?.statusCode === 'number' &&
    typeof candidate?.code === 'string' &&
    typeof candidate?.message === 'string'
  )
}

const isZodError = (error: unknown): error is ZodError => {
  const candidate = error as Partial<ZodError>
  return (
    candidate?.name === 'ZodError' &&
    Array.isArray((candidate as { issues?: unknown }).issues) &&
    typeof candidate?.message === 'string'
  )
}

export const formatGraphQLError = (
  formattedError: GraphQLFormattedError,
  error: unknown,
): GraphQLFormattedError => {
  const original = unwrapOriginalError(error)

  if (isAppError(original)) {
    return {
      message: original.message,
      extensions: { code: original.code, statusCode: original.statusCode },
    }
  }

  if (isZodError(original)) {
    return {
      message: 'Dados inválidos',
      extensions: {
        code: 'VALIDATION_ERROR',
        statusCode: 422,
        details: (original as ZodError).issues,
      },
    }
  }

  return formattedError
}