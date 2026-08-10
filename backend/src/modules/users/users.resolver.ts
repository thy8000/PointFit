import { UsersService } from './users.service'
import type { GraphQLContext } from '../../graphql/context'

const usersService = new UsersService()

export const usersResolvers = {
  Query: {
    me: (_: unknown, __: unknown, context: GraphQLContext) => {
      return usersService.getMe(context.userId)
    },
  },
  User: {
    createdAt: (user: { createdAt: Date }) => user.createdAt.toISOString(),
  },
}