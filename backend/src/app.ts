import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import { ApolloServer } from '@apollo/server'
import fastifyApollo, { fastifyApolloDrainPlugin } from '@as-integrations/fastify'
import { typeDefs } from './graphql/typeDefs'
import { resolvers } from './graphql/resolvers'
import { buildContext } from './graphql/context'
import { errorHandler, formatGraphQLError } from './middlewares/error-handler'
import { logger } from './shared/logger/logger'

export const buildApp = async () => {
  const app = Fastify({ logger })

  await app.register(cors, {
    origin: true,
    credentials: true,
  })

  const apollo = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: (formattedError, error) => formatGraphQLError(formattedError, error),
    plugins: [fastifyApolloDrainPlugin(app)],
  })

  await apollo.start()

  await app.register(fastifyApollo(apollo), {
    path: '/graphql',
    context: buildContext,
  })

  app.get('/health', async () => ({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  }))

  app.setErrorHandler(errorHandler)

  return app
}