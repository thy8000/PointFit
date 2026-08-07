import { describe, expect, it } from 'vitest'
import { generateToken, verifyToken } from '../../src/utils/jwt'

describe('jwt utils', () => {
  it('gera um token JWT válido com o userId', () => {
    const token = generateToken('user-123')
    expect(token).toBeTypeOf('string')
    const payload = verifyToken(token)
    expect(payload.userId).toBe('user-123')
  })

  it('lança erro para um token inválido', () => {
    expect(() => verifyToken('token-invalido')).toThrow()
  })

  it('lança erro para tokens gerados por outro secret', () => {
    const token = generateToken('user-456')
    // Modificação simples para invalidar a assinatura
    const tampered = token.slice(0, -2) + (token.endsWith('aa') ? 'bb' : 'aa')
    expect(() => verifyToken(tampered)).toThrow()
  })
})