import { describe, expect, it, vi, beforeEach } from 'vitest'
import { hashPassword } from '../../src/utils/bcrypt'

const prismaMock = vi.hoisted(() => ({
  user: {
    findUnique: vi.fn(),
    create: vi.fn(),
  },
}))

vi.mock('../../src/shared/database/prisma.client', () => ({
  prisma: prismaMock,
}))

import { AuthService } from '../../src/modules/auth/auth.service'
import { ConflictError, UnauthorizedError } from '../../src/shared/errors/app-error'

const service = new AuthService()

beforeEach(() => {
  vi.clearAllMocks()
})

describe('AuthService.register', () => {
  it('registra um novo usuário e retorna token', async () => {
    const passwordHash = await hashPassword('senhaSegura123')
    const user = {
      id: 'user-1',
      email: 'user@example.com',
      passwordHash,
      name: 'Fulano',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    prismaMock.user.findUnique.mockResolvedValue(null)
    prismaMock.user.create.mockResolvedValue(user)

    const result = await service.register({
      email: 'user@example.com',
      password: 'senhaSegura123',
      name: 'Fulano',
    })

    expect(prismaMock.user.create).toHaveBeenCalledTimes(1)
    expect(result.token).toBeTypeOf('string')
    expect(result.user.email).toBe('user@example.com')
    expect(result.user.passwordHash).toBeUndefined()
  })

  it('rejeita email já cadastrado', async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: 'user-1' })

    await expect(
      service.register({ email: 'user@example.com', password: 'senhaSegura123', name: 'Fulano' }),
    ).rejects.toBeInstanceOf(ConflictError)
    expect(prismaMock.user.create).not.toHaveBeenCalled()
  })

  it('rejeita senha curta', async () => {
    await expect(
      service.register({ email: 'user@example.com', password: '123', name: 'Fulano' }),
    ).rejects.toThrow('pelo menos 8 caracteres')
  })

  it('rejeita email inválido', async () => {
    await expect(
      service.register({ email: 'email-invalido', password: 'senhaSegura123', name: 'Fulano' }),
    ).rejects.toThrow()
  })
})

describe('AuthService.login', () => {
  it('faz login com credenciais válidas', async () => {
    const passwordHash = await hashPassword('senhaSegura123')
    prismaMock.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'user@example.com',
      passwordHash,
      name: 'Fulano',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const result = await service.login({ email: 'user@example.com', password: 'senhaSegura123' })
    expect(result.token).toBeTypeOf('string')
    expect(result.user.id).toBe('user-1')
  })

  it('rejeita usuário inexistente', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null)

    await expect(
      service.login({ email: 'nao-existe@example.com', password: 'senhaSegura123' }),
    ).rejects.toBeInstanceOf(UnauthorizedError)
  })

  it('rejeita senha incorreta', async () => {
    const passwordHash = await hashPassword('senhaCorreta')
    prismaMock.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'user@example.com',
      passwordHash,
      name: 'Fulano',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await expect(
      service.login({ email: 'user@example.com', password: 'senhaIncorreta' }),
    ).rejects.toBeInstanceOf(UnauthorizedError)
  })
})