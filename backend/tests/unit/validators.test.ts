import { describe, expect, it } from 'vitest'
import { emailSchema, passwordSchema, nameSchema } from '../../src/utils/validators'

describe('validators', () => {
  it('aceita emails válidos', () => {
    expect(emailSchema.parse('user@example.com')).toBe('user@example.com')
    expect(emailSchema.parse('USER@Example.COM')).toBe('user@example.com')
  })

  it('rejeita emails inválidos', () => {
    expect(() => emailSchema.parse('invalido')).toThrow()
    expect(() => emailSchema.parse('sem-arroba.com')).toThrow()
  })

  it('aceita senhas com 8+ caracteres', () => {
    expect(passwordSchema.parse('12345678')).toBe('12345678')
  })

  it('rejeita senhas curtas', () => {
    expect(() => passwordSchema.parse('1234567')).toThrow()
  })

  it('aceita nomes válidos', () => {
    expect(nameSchema.parse('Ana')).toBe('Ana')
  })

  it('rejeita nomes vazios', () => {
    expect(() => nameSchema.parse('')).toThrow()
  })
})