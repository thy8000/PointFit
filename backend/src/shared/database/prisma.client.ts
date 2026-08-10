import { PrismaClient } from '@prisma/client'
import { logger } from '../logger/logger'

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

export const prisma =
  global.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'production'
      ? ['error', 'warn']
      : ['query', 'info', 'warn', 'error'],
  })

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}

export async function disconnectPrisma(): Promise<void> {
  try {
    await prisma.$disconnect()
  } catch (error) {
    logger.error(`Erro ao desconectar Prisma: ${(error as Error).message}`)
  }
}