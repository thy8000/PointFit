import { z } from 'zod'
import type { User } from '@prisma/client'
import { prisma } from '../../shared/database/prisma.client'
import { hashPassword, verifyPassword } from '../../utils/bcrypt'
import { generateToken } from '../../utils/jwt'
import { validateWith, emailSchema, passwordSchema, nameSchema } from '../../utils/validators'
import { RegisterDto, LoginDto } from './dto'
import { ConflictError, UnauthorizedError } from '../../shared/errors/app-error'

export interface PublicUser {
  id: string
  email: string
  name: string
  createdAt: Date
}

export interface AuthResult {
  user: PublicUser
  token: string
}

export const sanitizeUser = (user: User): PublicUser => ({
  id: user.id,
  email: user.email,
  name: user.name,
  createdAt: user.createdAt,
})

const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
})

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Senha é obrigatória'),
})

export class AuthService {
  async register(data: RegisterDto): Promise<AuthResult> {
    const input = validateWith(registerSchema, data)

    const existingUser = await prisma.user.findUnique({ where: { email: input.email } })
    if (existingUser) {
      throw new ConflictError('Email já cadastrado')
    }

    const passwordHash = await hashPassword(input.password)

    const user = await prisma.user.create({
      data: { email: input.email, passwordHash, name: input.name },
    })

    const token = generateToken(user.id)
    return { user: sanitizeUser(user), token }
  }

  async login(data: LoginDto): Promise<AuthResult> {
    const input = validateWith(loginSchema, data)

    const user = await prisma.user.findUnique({ where: { email: input.email } })
    if (!user) {
      throw new UnauthorizedError('Email ou senha inválidos')
    }

    const validPassword = await verifyPassword(input.password, user.passwordHash)
    if (!validPassword) {
      throw new UnauthorizedError('Email ou senha inválidos')
    }

    const token = generateToken(user.id)
    return { user: sanitizeUser(user), token }
  }
}