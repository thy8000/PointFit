import { z } from 'zod'

export const emailSchema = z.string().trim().toLowerCase().email('Email inválido')

export const passwordSchema = z
  .string()
  .min(8, 'A senha deve ter pelo menos 8 caracteres')
  .max(72, 'A senha deve ter no máximo 72 caracteres')

export const nameSchema = z
  .string()
  .trim()
  .min(2, 'O nome deve ter pelo menos 2 caracteres')
  .max(100, 'O nome deve ter no máximo 100 caracteres')

export const validateWith = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  return schema.parse(data)
}