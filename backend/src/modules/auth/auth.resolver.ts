import { AuthService } from './auth.service'

const authService = new AuthService()

export const authResolvers = {
  Mutation: {
    register: (_: unknown, args: { email: string; password: string; name: string }) => {
      return authService.register({
        email: args.email,
        password: args.password,
        name: args.name,
      })
    },
    login: (_: unknown, args: { email: string; password: string }) => {
      return authService.login({ email: args.email, password: args.password })
    },
  },
}