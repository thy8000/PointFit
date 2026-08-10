// Copia assets não-TS (schema.graphql) para o diretório de build
import { cpSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

mkdirSync(join(ROOT, 'dist', 'graphql'), { recursive: true })
cpSync(join(ROOT, 'src', 'graphql', 'schema.graphql'), join(ROOT, 'dist', 'graphql', 'schema.graphql'))
console.log('✅ schema.graphql copiado para dist/graphql')