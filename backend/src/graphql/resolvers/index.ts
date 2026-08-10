import { authResolvers } from '../../modules/auth/auth.resolver'
import { usersResolvers } from '../../modules/users/users.resolver'
import { exercisesResolvers } from '../../modules/exercises/exercises.resolver'

export const resolvers = {
  Query: {
    ...usersResolvers.Query,
    ...exercisesResolvers.Query,
  },
  Mutation: {
    ...authResolvers.Mutation,
  },
  User: {
    ...usersResolvers.User,
  },
  Exercise: {},
}