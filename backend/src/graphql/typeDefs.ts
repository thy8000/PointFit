import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'

const loadTypeDefs = (): string => {
  const candidates = [
    resolve(process.cwd(), 'src', 'graphql', 'schema.graphql'),
    resolve(process.cwd(), 'dist', 'graphql', 'schema.graphql'),
    resolve(dirname(__filename), 'schema.graphql'),
  ]
  for (const file of candidates) {
    try {
      return readFileSync(file, 'utf-8')
    } catch {
      // tenta o próximo candidato
    }
  }
  throw new Error('Arquivo schema.graphql não encontrado')
}

export const typeDefs = loadTypeDefs()