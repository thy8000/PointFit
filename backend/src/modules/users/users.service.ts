import { prisma } from '../../shared/database/prisma.client'
import { sanitizeUser, PublicUser } from '../auth/auth.service'
import { NotFoundError, UnauthorizedError } from '../../shared/errors/app-error'

export class UsersService {
  async getById(userId: string): Promise<PublicUser> {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      throw new NotFoundError('Usuário não encontrado')
    }
    return sanitizeUser(user)
  }

  async getMe(currentUserId: string | undefined): Promise<PublicUser> {
    if (!currentUserId) {
      throw new UnauthorizedError('Autenticação necessária')
    }
    return this.getById(currentUserId)
  }
}