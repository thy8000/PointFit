import { describe, expect, it } from 'vitest'
import { hashPassword, verifyPassword } from '../../src/utils/bcrypt'

describe('bcrypt utils', () => {
  it('gera hash da senha', async () => {
    const hash = await hashPassword('minhaSenha123')
    expect(hash).toBeTypeOf('string')
    expect(hash).not.toBe('minhaSenha123')
  })

  it('verifica senha correta', async () => {
    const hash = await hashPassword('minhaSenha123')
    const valid = await verifyPassword('minhaSenha123', hash)
    expect(valid).toBe(true)
  })

  it('rejeita senha incorreta', async () => {
    const hash = await hashPassword('minhaSenha123')
    const valid = await verifyPassword('senhaErrada', hash)
    expect(valid).toBe(false)
  })
})