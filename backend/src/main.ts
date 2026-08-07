import { buildApp } from './app'
import { disconnectPrisma } from './shared/database/prisma.client'
import { logger } from './shared/logger/logger'

const PORT = Number(process.env.PORT ?? 4000)
const HOST = '0.0.0.0'

const start = async () => {
  const app = await buildApp()

  try {
    await app.listen({ port: PORT, host: HOST })
    logger.info(`API GraphQL rodando em http://localhost:${PORT}/graphql`)
    logger.info(`Health check em http://localhost:${PORT}/health`)
  } catch (err) {
    logger.error(err)
    process.exit(1)
  }

  const shutdown = async (signal: string) => {
    logger.info(`Recebido ${signal}, encerrando...`)
    try {
      await app.close()
      await disconnectPrisma()
      process.exit(0)
    } catch (err) {
      logger.error(err)
      process.exit(1)
    }
  }

  process.on('SIGINT', () => void shutdown('SIGINT'))
  process.on('SIGTERM', () => void shutdown('SIGTERM'))
}

void start()