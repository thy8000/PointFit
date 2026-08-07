// Cross-platform (Node >= 18) downloader do Exercise Dataset.
// Usado por `npm run download-dataset` no Windows e Linux.
import { mkdir, writeFile, rm } from 'fs/promises'
import { existsSync } from 'fs'
import { execFileSync } from 'child_process'
import { tmpdir } from 'os'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

const DATASET_URL = process.env.DATASET_URL ?? 'https://exercise-dataset.com/exercises.json'
const REPO_ZIP = 'https://github.com/sergei-argutin/exercise-dataset/archive/refs/heads/main.zip'

const jsonTarget = join(ROOT, 'src', 'modules', 'exercises', 'data', 'exercises.json')
const imagesTarget = join(ROOT, 'src', 'modules', 'exercises', 'data', 'images')

const log = (msg) => console.log(msg)

async function main() {
  log('📥 Baixando exercise-dataset (JSON)...')
  const res = await fetch(DATASET_URL)
  if (!res.ok) throw new Error(`Falha ao baixar JSON: HTTP ${res.status}`)
  await mkdir(dirname(jsonTarget), { recursive: true })
  await writeFile(jsonTarget, Buffer.from(await res.arrayBuffer()))
  log(`✅ JSON salvo em src/modules/exercises/data/exercises.json`)

  log('📥 Baixando imagens do dataset (ZIP)...')
  const zipRes = await fetch(REPO_ZIP)
  if (!zipRes.ok) throw new Error(`Falha ao baixar ZIP: HTTP ${zipRes.status}`)
  const zipPath = join(tmpdir(), 'exercise-dataset.zip')
  const extractDir = join(tmpdir(), 'exercise-dataset-main')
  await writeFile(zipPath, Buffer.from(await zipRes.arrayBuffer()))

  log('🗜️ Extraindo apenas images/flat...')
  await rm(extractDir, { recursive: true, force: true })

  if (process.platform === 'win32') {
    execFileSync('powershell', [
      '-NoProfile',
      '-Command',
      `Expand-Archive -LiteralPath '${zipPath}' -DestinationPath '${tmpdir()}' -Force`,
    ])
  } else {
    execFileSync('unzip', ['-q', zipPath, '-d', tmpdir()])
  }

  await mkdir(imagesTarget, { recursive: true })
  const flatSource = join(extractDir, 'images', 'flat')
  if (!existsSync(flatSource)) {
    throw new Error('Pasta images/flat não encontrada no ZIP')
  }

  if (process.platform === 'win32') {
    execFileSync('powershell', [
      '-NoProfile',
      '-Command',
      `Copy-Item -Path '${join(flatSource, '*')}' -Destination '${imagesTarget}' -Recurse -Force`,
    ])
  } else {
    execFileSync('cp', ['-r', `${flatSource}/.`, `${imagesTarget}/`])
  }

  await rm(zipPath, { force: true })
  await rm(extractDir, { recursive: true, force: true })
  log('✅ Download concluído!')
}

main().catch((err) => {
  console.error('❌ Erro no download:', err.message)
  process.exit(1)
})
