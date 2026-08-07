import { describe, expect, it, vi, afterAll } from 'vitest'
import { hashPassword } from '../../src/utils/bcrypt'

const prismaMock = vi.hoisted(() => ({
  user: {
    findUnique: vi.fn(),
    create: vi.fn(),
  },
  exerciseLibrary: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    count: vi.fn(),
  },
}))

vi.mock('../../src/shared/database/prisma.client', () => ({
  prisma: prismaMock,
}))

import { buildApp } from '../../src/app'
import type { FastifyInstance } from 'fastify'

describe('GraphQL API (integração)', () => {
  let app: FastifyInstance

  afterAll(async () => {
    await app?.close()
  })

  it('responde no endpoint /health', async () => {
    app = await buildApp()
    const res = await app.inject({ method: 'GET', url: '/health' })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.status).toBe('ok')
  })

  it('registra e faz login via GraphQL', async () => {
    if (app) await app.close()
    app = await buildApp()

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

    const registerRes = await app.inject({
      method: 'POST',
      url: '/graphql',
      payload: {
        query: `
          mutation Register($email: String!, $password: String!, $name: String!) {
            register(email: $email, password: $password, name: $name) {
              token
              user { id email name }
            }
          }
        `,
        variables: { email: 'user@example.com', password: 'senhaSegura123', name: 'Fulano' },
      },
    })

    expect(registerRes.statusCode).toBe(200)
    const registerBody = registerRes.json()
    expect(registerBody.data.register.token).toBeTypeOf('string')
    expect(registerBody.data.register.user.email).toBe('user@example.com')

    prismaMock.user.findUnique.mockResolvedValue(user)

    const loginRes = await app.inject({
      method: 'POST',
      url: '/graphql',
      payload: {
        query: `
          mutation Login($email: String!, $password: String!) {
            login(email: $email, password: $password) { token user { email } }
          }
        `,
        variables: { email: 'user@example.com', password: 'senhaSegura123' },
      },
    })

    expect(loginRes.statusCode).toBe(200)
    const loginBody = loginRes.json()
    expect(loginBody.data.login.token).toBeTypeOf('string')
  })

  it('lista exercícios com filtros', async () => {
    const exercise = {
      id: 'ex-1',
      name: 'Bench Press',
      description: 'Press de supino',
      muscleGroup: 'Chest',
      equipment: 'Barbell',
      thumbnailUrl: 'https://img/bench-press-start.webp',
      imageStart: 'https://img/bench-press-start.webp',
      imagePeak: 'https://img/bench-press-peak.webp',
      imageMain: null,
      isCustom: false,
      category: 'strength',
      difficulty: 'beginner',
      primaryMuscles: ['pectoralis-major'],
      secondaryMuscles: ['triceps-brachii'],
      goals: ['hypertrophy', 'strength'],
      tags: [],
      met: 6,
      isUnilateral: false,
      isBodyweight: false,
      instructionsEn: ['Lie on bench', 'Press bar'],
      instructionsDe: [],
      instructionsEs: [],
      tipsEn: [],
      tipsDe: [],
      tipsEs: [],
    }

    prismaMock.exerciseLibrary.findMany.mockResolvedValue([exercise])

    const res = await app.inject({
      method: 'POST',
      url: '/graphql',
      payload: {
        query: `
          query Exercises($muscleGroup: MuscleGroup) {
            exercises(muscleGroup: $muscleGroup, limit: 10) {
              id name muscleGroup equipment thumbnailUrl
            }
          }
        `,
        variables: { muscleGroup: 'Chest' },
      },
    })

    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.data.exercises).toHaveLength(1)
    expect(body.data.exercises[0].name).toBe('Bench Press')
    expect(prismaMock.exerciseLibrary.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ muscleGroup: 'Chest' }) }),
    )
  })

  it('retorna erro de validação para registro inválido', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/graphql',
      payload: {
        query: `
          mutation Register($email: String!, $password: String!, $name: String!) {
            register(email: $email, password: $password, name: $name) { token }
          }
        `,
        variables: { email: 'invalido', password: 'x', name: 'A' },
      },
    })

    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.errors).toBeDefined()
    expect(body.errors[0].extensions.code).toBe('VALIDATION_ERROR')
  })
})