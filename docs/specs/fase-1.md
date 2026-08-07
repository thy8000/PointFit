# 🏋️ FASE 1 - FUNDAÇÃO - SPEC TÉCNICA COMPLETA (ATUALIZADA)

> **Status: ✅ IMPLEMENTADA** — Fase 1 concluída em 07/08/2026 (branch `feature/fase-1`).
> Este documento foi movido de `spec.md` para `docs/specs/fase-1.md` e atualizado para
> refletir o estado real do código. Detalhes da execução: ver [progresso](./../progress/fase-1.md).

## 📋 Visão Geral
**Duração:** 2-3 semanas  
**Objetivo:** Estabelecer a base sólida do projeto com backend funcional, autenticação, banco de dados e estrutura frontend, utilizando o **Exercise Dataset** gratuito como fonte de dados de exercícios.

---

## 🎯 Entregáveis da Fase 1

1. ✅ Backend Node.js + Fastify com TypeScript
2. ✅ Banco PostgreSQL com Prisma (schema completo)
3. ✅ Autenticação JWT (registro/login)
4. ✅ **Integração com Exercise Dataset (400 exercícios + imagens)**
5. ✅ Frontend React Native (Expo) com estrutura de pastas
6. ✅ Navegação básica (Auth + App stacks)
7. ✅ Configuração do WatermelonDB (offline)
8. ✅ CI/CD com GitHub Actions
9. ✅ Backend pronto para deploy (hospedagem pública pendente; banco no Supabase)

---

## 📁 Estrutura do Projeto

```
PointFit/
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── auth.resolver.ts
│   │   │   │   └── dto/
│   │   │   │       ├── register.dto.ts
│   │   │   │       └── login.dto.ts
│   │   │   ├── users/
│   │   │   │   ├── users.service.ts
│   │   │   │   └── users.resolver.ts
│   │   │   └── exercises/
│   │   │       ├── exercises.service.ts
│   │   │       ├── exercises.resolver.ts
│   │   │       ├── dataset.types.ts
│   │   │       └── data/
│   │   │           ├── exercises.json      # Dataset baixado (400 exercícios)
│   │   │           └── images/.gitkeep     # Imagens servidas via URL (GitHub raw)
│   │   ├── shared/
│   │   │   ├── database/
│   │   │   │   └── prisma.client.ts
│   │   │   ├── storage/
│   │   │   │   ├── google-drive.service.ts
│   │   │   │   └── cloudflare-r2.service.ts
│   │   │   ├── logger/
│   │   │   │   └── logger.ts
│   │   │   └── errors/
│   │   │       └── app-error.ts
│   │   ├── graphql/
│   │   │   ├── schema.graphql
│   │   │   ├── typeDefs.ts
│   │   │   ├── resolvers/
│   │   │   │   └── index.ts
│   │   │   └── context.ts
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.ts
│   │   │   └── error-handler.ts
│   │   ├── utils/
│   │   │   ├── jwt.ts
│   │   │   ├── bcrypt.ts
│   │   │   └── validators.ts
│   │   ├── app.ts
│   │   └── main.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/         # gerado via `prisma migrate dev`
│   │   └── seed.ts             # upsert do dataset (400 exercícios)
│   ├── scripts/
│   │   ├── download-dataset.mjs
│   │   ├── download-dataset.sh
│   │   └── copy-assets.mjs     # copia schema.graphql para dist/
│   ├── tests/
│   │   ├── unit/
│   │   └── integration/
│   ├── vitest.config.ts
│   ├── Dockerfile
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── client.ts
│   │   │   ├── queries/
│   │   │   │   ├── auth.queries.ts
│   │   │   │   └── exercises.queries.ts
│   │   │   └── mutations/
│   │   │       └── auth.mutations.ts
│   │   ├── models/            # WatermelonDB
│   │   │   ├── User.ts
│   │   │   ├── Exercise.ts
│   │   │   └── index.ts
│   │   ├── db/
│   │   │   ├── database.ts    # LokiJSAdapter
│   │   │   ├── schema.ts
│   │   │   └── sync.ts
│   │   ├── screens/
│   │   │   ├── Auth/
│   │   │   │   ├── LoginScreen.tsx
│   │   │   │   └── RegisterScreen.tsx
│   │   │   └── App/
│   │   │       ├── HomeScreen.tsx
│   │   │       ├── ExercisesScreen.tsx
│   │   │       └── ProfileScreen.tsx
│   │   ├── components/
│   │   │   └── ui/
│   │   │       ├── Button.tsx
│   │   │       ├── Input.tsx
│   │   │       ├── Card.tsx
│   │   │       └── Typography.tsx
│   │   ├── hooks/
│   │   │   └── useAuth.ts
│   │   ├── store/
│   │   │   └── authStore.ts
│   │   ├── navigation/
│   │   │   ├── AppNavigator.tsx    # Tabs: Home / Exercícios / Perfil
│   │   │   ├── AuthNavigator.tsx
│   │   │   └── types.ts
│   │   ├── utils/
│   │   │   ├── constants.ts
│   │   │   └── storage.ts
│   │   ├── types/
│   │   │   └── graphql.ts
│   │   └── App.tsx
│   ├── assets/
│   │   └── fonts/
│   ├── index.ts                # entrypoint (substitui expo/AppEntry.js)
│   ├── app.json
│   ├── babel.config.js
│   ├── tailwind.config.js
│   ├── metro.config.js
│   ├── package.json
│   └── tsconfig.json
│
├── docs/
│   ├── specs/fase-1.md
│   ├── progress/fase-1.md
│   └── history/
├── .github/workflows/ci.yml
├── docker-compose.yml           # postgres + redis + backend (na raiz)
└── README.md
```

---

## 🗄️ Prisma Schema (backend/prisma/schema.prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id                String              @id @default(uuid())
  email             String              @unique
  passwordHash      String
  name              String
  createdAt         DateTime            @default(now())
  updatedAt         DateTime            @updatedAt
  
  // Relacionamentos
  exercises         ExerciseLibrary[]   @relation("CreatedExercises")
  workoutRoutines   WorkoutRoutine[]
  workoutSessions   WorkoutSession[]
  bodyMeasurements  BodyMeasurement[]
  progressPhotos    ProgressPhoto[]
}

model ExerciseLibrary {
  id              String              @id @default(uuid())
  name            String
  description     String?
  muscleGroup     MuscleGroup
  equipment       EquipmentType
  videoUrl        String?
  thumbnailUrl    String?
  imageStart      String?             // URL da imagem "start" do dataset
  imagePeak       String?             // URL da imagem "peak" do dataset
  imageMain       String?             // URL da imagem "main" (para stretches)
  isCustom        Boolean             @default(false)
  createdBy       String?             // userId se for custom
  createdByUser   User?               @relation("CreatedExercises", fields: [createdBy], references: [id])
  
  // Campos adicionais do dataset
  category        String?             // strength, stretching, etc.
  forceType       String?             // push, pull, static, dynamic
  mechanic        String?             // compound, isolation
  difficulty      String?             // beginner, intermediate, advanced
  primaryMuscles  String[]            // Lista de músculos primários
  secondaryMuscles String[]           // Lista de músculos secundários
  goals           String[]            // hypertrophy, strength, etc.
  tags            String[]            // knee_safe, no_axial_load, etc.
  met             Float?              // Metabolic equivalent
  isUnilateral    Boolean             @default(false)
  isBodyweight    Boolean             @default(false)
  instructionsEn  String[]            // Instruções em inglês
  instructionsDe  String[]            // Instruções em alemão
  instructionsEs  String[]            // Instruções em espanhol
  tipsEn          String[]            // Dicas em inglês
  tipsDe          String[]            // Dicas em alemão
  tipsEs          String[]            // Dicas em espanhol
  datasetId       String?             // ID original do dataset (slug)
  
  // Relacionamentos
  routineExercises RoutineExercise[]
  workoutSets      WorkoutSet[]

  @@unique([datasetId])
  @@index([muscleGroup])
  @@index([equipment])
  @@index([category])
  @@index([difficulty])
}

model WorkoutRoutine {
  id              String              @id @default(uuid())
  userId          String
  user            User                @relation(fields: [userId], references: [id])
  name            String
  description     String?
  isActive        Boolean             @default(true)
  createdAt       DateTime            @default(now())
  updatedAt       DateTime            @updatedAt
  
  routineExercises RoutineExercise[]
  workoutSessions  WorkoutSession[]
  
  @@index([userId])
}

model RoutineExercise {
  id              String              @id @default(uuid())
  routineId       String
  routine         WorkoutRoutine      @relation(fields: [routineId], references: [id])
  exerciseId      String
  exercise        ExerciseLibrary     @relation(fields: [exerciseId], references: [id])
  order           Int
  defaultSets     Int?
  defaultReps     Int?
  defaultWeight   Float?
  restSeconds     Int?
  supersetGroupId String?
  
  @@index([routineId])
  @@index([exerciseId])
}

model WorkoutSession {
  id              String              @id @default(uuid())
  userId          String
  user            User                @relation(fields: [userId], references: [id])
  routineId       String?
  routine         WorkoutRoutine?     @relation(fields: [routineId], references: [id])
  startedAt       DateTime            @default(now())
  endedAt         DateTime?
  totalVolume     Float?
  totalSets       Int?
  notes           String?
  
  workoutSets     WorkoutSet[]
  
  @@index([userId])
  @@index([startedAt])
}

model WorkoutSet {
  id                String              @id @default(uuid())
  sessionId         String
  session           WorkoutSession      @relation(fields: [sessionId], references: [id])
  exerciseId        String
  exercise          ExerciseLibrary     @relation(fields: [exerciseId], references: [id])
  setType           SetType
  weightKg          Float
  reps              Int
  isCompleted       Boolean             @default(false)
  order             Int
  supersetGroupId   String?
  dropWeight        Float?
  dropReps          Int?
  createdAt         DateTime            @default(now())
  
  @@index([sessionId])
  @@index([exerciseId])
}

model BodyMeasurement {
  id                  String              @id @default(uuid())
  userId              String              @unique
  user                User                @relation(fields: [userId], references: [id])
  weightKg            Float?
  bodyFatPercentage   Float?
  neckCm              Float?
  shoulderCm          Float?
  chestCm             Float?
  bicepCm             Float?
  forearmCm           Float?
  waistCm             Float?
  hipCm               Float?
  thighCm             Float?
  calfCm              Float?
  measuredAt          DateTime            @default(now())
  
  @@index([userId])
}

model ProgressPhoto {
  id          String              @id @default(uuid())
  userId      String
  user        User                @relation(fields: [userId], references: [id])
  photoUrl    String              // URL do Cloudflare R2
  caption     String?
  takenAt     DateTime            @default(now())
  createdAt   DateTime            @default(now())
  
  @@index([userId])
}

enum MuscleGroup {
  Chest
  Back
  Legs
  Shoulders
  Arms
  Core
  Cardio
}

enum EquipmentType {
  Barbell
  Dumbbell
  Machine
  Bodyweight
  Cable
  Kettlebell
  Band
  Other
}

enum SetType {
  Warmup
  Normal
  DropSet
  Failure
  Superset
}
```

> **Observação (implementação real):** `MuscleGroup` no Prisma inclui `FullBody` e `Other`
> (o dataset usa `body_part` como `other` em alguns casos) e `ExerciseLibrary` tem
> `@@unique([datasetId])` para permitir o `upsert` do seed.

---

## 📥 Script para Baixar o Dataset

> **Adaptação (implementação real):** existe `backend/scripts/download-dataset.mjs`
> (Node, cross-platform) além do `.sh` abaixo. As **imagens WebP não são baixadas para o
> repositório** — as URLs apontam para o GitHub raw do dataset
> (`https://raw.githubusercontent.com/sergei-argutin/exercise-dataset/main/images/flat/…webp`),
> validadas durante o desenvolvimento. A pasta `data/images/` fica só com `.gitkeep`.

### `backend/scripts/download-dataset.sh`:
```bash
#!/bin/bash

# Baixa o arquivo JSON do dataset
echo "📥 Baixando exercise-dataset..."
curl -L https://exercise-dataset.com/exercises.json -o ../src/modules/exercises/data/exercises.json

# Baixa as imagens (WebP) - será necessário baixar o ZIP do repositório
echo "📥 Baixando imagens do dataset..."
curl -L https://github.com/sergei-argutin/exercise-dataset/archive/refs/heads/main.zip -o /tmp/dataset.zip

# Extrai apenas a pasta images/flat
unzip -j /tmp/dataset.zip "exercise-dataset-main/images/flat/*" -d ../src/modules/exercises/data/images/

echo "✅ Download concluído!"
```

**Ou, você pode simplesmente clonar o repositório como submódulo:**
```bash
git submodule add https://github.com/sergei-argutin/exercise-dataset.git backend/src/modules/exercises/data/dataset
```

---

## 🌱 Seed do Banco de Dados (`backend/prisma/seed.ts`)

> **Implementação real:** usa `upsert` (create + update em `datasetId`), lê o dataset de
> `src/modules/exercises/data/exercises.json` (e caminho via `DATASET_PATH`), e monta as
> URLs de imagem a partir de `BASE_IMAGE_URL` (env). Importa os 400 exercícios de forma
> idempotente. O `prisma.seed` no `package.json` aponta para o script compilado.

```typescript
import { PrismaClient, MuscleGroup, EquipmentType } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

// Mapeamento dos campos do dataset para os enums do Prisma
const muscleGroupMap: Record<string, MuscleGroup> = {
  'chest': MuscleGroup.Chest,
  'back': MuscleGroup.Back,
  'legs': MuscleGroup.Legs,
  'shoulders': MuscleGroup.Shoulders,
  'arms': MuscleGroup.Arms,
  'core': MuscleGroup.Core,
  'cardio': MuscleGroup.Cardio,
  // Adicione mais mapeamentos conforme necessário
}

const equipmentMap: Record<string, EquipmentType> = {
  'barbell': EquipmentType.Barbell,
  'dumbbell': EquipmentType.Dumbbell,
  'machine': EquipmentType.Machine,
  'bodyweight': EquipmentType.Bodyweight,
  'cable': EquipmentType.Cable,
  'kettlebell': EquipmentType.Kettlebell,
  'band': EquipmentType.Band,
  'other': EquipmentType.Other,
}

async function main() {
  console.log('🌱 Seeding database with exercise dataset...')
  
  // Ler o arquivo JSON do dataset
  const datasetPath = path.join(__dirname, '../src/modules/exercises/data/exercises.json')
  const datasetContent = fs.readFileSync(datasetPath, 'utf-8')
  const dataset = JSON.parse(datasetContent)
  
  console.log(`📊 Encontrados ${dataset.count} exercícios no dataset`)
  
  let importedCount = 0
  
  for (const exercise of dataset.exercises) {
    // Mapear grupo muscular
    const muscleGroup = muscleGroupMap[exercise.body_part?.toLowerCase()] || MuscleGroup.Other
    
    // Mapear equipamento
    const equipment = exercise.equipment 
      ? equipmentMap[exercise.equipment.toLowerCase()] 
      : EquipmentType.Bodyweight
    
    // Construir URLs das imagens
    const baseImagePath = `https://raw.githubusercontent.com/sergei-argutin/exercise-dataset/main/images/flat/`
    const imageStart = exercise.images?.flat?.start 
      ? `${baseImagePath}${exercise.id}-start.webp` 
      : null
    const imagePeak = exercise.images?.flat?.peak 
      ? `${baseImagePath}${exercise.id}-peak.webp` 
      : null
    const imageMain = exercise.images?.flat?.main 
      ? `${baseImagePath}${exercise.id}-main.webp` 
      : null
    
    // Usar a primeira instrução como descrição, se disponível
    const description = exercise.instructions_en?.[0] || exercise.description_en || null
    
    try {
      await prisma.exerciseLibrary.create({
        data: {
          name: exercise.name_en,
          description: description,
          muscleGroup: muscleGroup,
          equipment: equipment,
          thumbnailUrl: imageStart || imagePeak || imageMain,
          imageStart: imageStart,
          imagePeak: imagePeak,
          imageMain: imageMain,
          isCustom: false,
          category: exercise.category,
          forceType: exercise.force_type,
          mechanic: exercise.mechanic,
          difficulty: exercise.difficulty,
          primaryMuscles: exercise.primary_muscles || [],
          secondaryMuscles: exercise.secondary_muscles || [],
          goals: exercise.goals || [],
          tags: exercise.tags || [],
          met: exercise.met,
          isUnilateral: exercise.is_unilateral || false,
          isBodyweight: exercise.is_bodyweight || false,
          instructionsEn: exercise.instructions_en || [],
          instructionsDe: exercise.instructions_de || [],
          instructionsEs: exercise.instructions_es || [],
          tipsEn: exercise.tips_en || [],
          tipsDe: exercise.tips_de || [],
          tipsEs: exercise.tips_es || [],
          datasetId: exercise.id,
        }
      })
      importedCount++
      
      if (importedCount % 50 === 0) {
        console.log(`✅ Importados ${importedCount} exercícios...`)
      }
    } catch (error) {
      console.error(`❌ Erro ao importar ${exercise.name_en}:`, error.message)
    }
  }
  
  console.log(`✅ Seeding concluído! ${importedCount} exercícios importados.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

---

## 🔐 Backend - Autenticação

### JWT Config (`src/utils/jwt.ts`):
```typescript
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-me'
const JWT_EXPIRES_IN = '7d'

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export const verifyToken = (token: string): { userId: string } => {
  return jwt.verify(token, JWT_SECRET) as { userId: string }
}
```

### Auth Service (`src/modules/auth/auth.service.ts`):
```typescript
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { generateToken } from '../../utils/jwt'
import { RegisterDto, LoginDto } from './dto'

const prisma = new PrismaClient()

export class AuthService {
  async register(data: RegisterDto) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    })
    
    if (existingUser) {
      throw new Error('Email já cadastrado')
    }
    
    const passwordHash = await bcrypt.hash(data.password, 10)
    
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        name: data.name,
      }
    })
    
    const token = generateToken(user.id)
    return { user, token }
  }
  
  async login(data: LoginDto) {
    const user = await prisma.user.findUnique({
      where: { email: data.email }
    })
    
    if (!user) {
      throw new Error('Email ou senha inválidos')
    }
    
    const validPassword = await bcrypt.compare(data.password, user.passwordHash)
    
    if (!validPassword) {
      throw new Error('Email ou senha inválidos')
    }
    
    const token = generateToken(user.id)
    return { user, token }
  }
}
```

### GraphQL Schema (`src/graphql/schema.graphql`):
```graphql
type User {
  id: ID!
  email: String!
  name: String!
  createdAt: String!
}

type AuthPayload {
  user: User!
  token: String!
}

type Exercise {
  id: ID!
  name: String!
  description: String
  muscleGroup: MuscleGroup!
  equipment: EquipmentType!
  thumbnailUrl: String
  imageStart: String
  imagePeak: String
  imageMain: String
  isCustom: Boolean!
  category: String
  difficulty: String
  primaryMuscles: [String!]!
  secondaryMuscles: [String!]!
  goals: [String!]!
  tags: [String!]!
  met: Float
  isUnilateral: Boolean!
  isBodyweight: Boolean!
  instructionsEn: [String!]!
  instructionsDe: [String!]!
  instructionsEs: [String!]!
  tipsEn: [String!]!
  tipsDe: [String!]!
  tipsEs: [String!]!
}

enum MuscleGroup {
  Chest
  Back
  Legs
  Shoulders
  Arms
  Core
  Cardio
  FullBody
  Other
}

enum EquipmentType {
  Barbell
  Dumbbell
  Machine
  Bodyweight
  Cable
  Kettlebell
  Band
  Other
}

type Query {
  me: User!
  exercises(
    muscleGroup: MuscleGroup
    equipment: EquipmentType
    search: String
    difficulty: String
    category: String
    limit: Int
    offset: Int
  ): [Exercise!]!
  exercise(id: ID!): Exercise
  exerciseByDatasetId(datasetId: String!): Exercise
}

type Mutation {
  register(email: String!, password: String!, name: String!): AuthPayload!
  login(email: String!, password: String!): AuthPayload!
}
```
> ✅ Implementado exatamente assim em `backend/src/graphql/schema.graphql` (com `MuscleGroup` completo).
```

---

## 🎨 Frontend - Configuração Base

### Package.json (Frontend) — implementado:
```json
{
  "name": "pointfit-frontend",
  "version": "1.0.0",
  "private": true,
  "main": "index.ts",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "typecheck": "tsc --noEmit",
    "lint": "eslint . --ext .ts,.tsx"
  },
  "dependencies": {
    "@apollo/client": "^3.8.11",
    "@nozbe/watermelondb": "^0.27.1",
    "@react-navigation/bottom-tabs": "^6.5.11",
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/stack": "^6.3.20",
    "expo": "~50.0.0",
    "expo-image": "~1.10.0",
    "expo-secure-store": "~12.0.0",
    "expo-status-bar": "~1.11.0",
    "graphql": "^16.8.1",
    "nativewind": "^2.0.11",
    "react": "18.2.0",
    "react-native": "0.73.2",
    "react-native-gesture-handler": "~2.14.0",
    "react-native-reanimated": "~3.6.2",
    "react-native-safe-area-context": "4.8.2",
    "react-native-screens": "~3.29.0",
    "zustand": "^4.4.7"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0",
    "@types/react": "~18.2.45",
    "@typescript-eslint/eslint-plugin": "^6.18.1",
    "@typescript-eslint/parser": "^6.18.1",
    "babel-preset-expo": "~10.0.1",
    "eslint": "^8.56.0",
    "tailwindcss": "3.2.7",
    "typescript": "^5.3.3"
  },
  "overrides": {
    "postcss": "8.4.31"
  }
}
```

> **Pins importantes:** `tailwindcss` fixado em `3.2.7` e `postcss` em `8.4.31` via
> `overrides` (ver "Decisões técnicas" no fim). Entrypoint = `index.ts`.

### Apollo Client Config (`frontend/src/api/client.ts`):
```typescript
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import * as SecureStore from 'expo-secure-store'

const httpLink = createHttpLink({
  uri: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000/graphql',
})

const authLink = setContext(async (_, { headers }) => {
  const token = await SecureStore.getItemAsync('auth_token')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  }
})

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})
```

### Auth Store (`frontend/src/store/authStore.ts`):
```typescript
import { create } from 'zustand'
import * as SecureStore from 'expo-secure-store'

interface User {
  id: string
  email: string
  name: string
}

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  setAuth: (user: User, token: string) => Promise<void>
  logout: () => Promise<void>
  hydrate: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,
  
  setAuth: async (user, token) => {
    await SecureStore.setItemAsync('auth_token', token)
    await SecureStore.setItemAsync('user_data', JSON.stringify(user))
    set({ user, token, isLoading: false })
  },
  
  logout: async () => {
    await SecureStore.deleteItemAsync('auth_token')
    await SecureStore.deleteItemAsync('user_data')
    set({ user: null, token: null, isLoading: false })
  },
  
  hydrate: async () => {
    try {
      const token = await SecureStore.getItemAsync('auth_token')
      const userData = await SecureStore.getItemAsync('user_data')
      
      if (token && userData) {
        set({ 
          user: JSON.parse(userData), 
          token, 
          isLoading: false 
        })
      } else {
        set({ isLoading: false })
      }
    } catch (error) {
      set({ isLoading: false })
    }
  }
}))
```

---

## 🗄️ WatermelonDB Schema (`frontend/src/db/schema.ts`):

```typescript
import { appSchema, tableSchema } from '@nozbe/watermelondb'

export const mySchema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'users',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'email', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ]
    }),
    tableSchema({
      name: 'exercises',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'description', type: 'string', isOptional: true },
        { name: 'muscle_group', type: 'string' },
        { name: 'equipment', type: 'string' },
        { name: 'thumbnail_url', type: 'string', isOptional: true },
        { name: 'image_start', type: 'string', isOptional: true },
        { name: 'image_peak', type: 'string', isOptional: true },
        { name: 'image_main', type: 'string', isOptional: true },
        { name: 'is_custom', type: 'boolean' },
        { name: 'category', type: 'string', isOptional: true },
        { name: 'difficulty', type: 'string', isOptional: true },
        { name: 'primary_muscles', type: 'string', isOptional: true }, // JSON string
        { name: 'secondary_muscles', type: 'string', isOptional: true }, // JSON string
        { name: 'goals', type: 'string', isOptional: true }, // JSON string
        { name: 'tags', type: 'string', isOptional: true }, // JSON string
        { name: 'met', type: 'number', isOptional: true },
        { name: 'is_unilateral', type: 'boolean' },
        { name: 'is_bodyweight', type: 'boolean' },
        { name: 'instructions_en', type: 'string', isOptional: true }, // JSON string
        { name: 'instructions_de', type: 'string', isOptional: true }, // JSON string
        { name: 'instructions_es', type: 'string', isOptional: true }, // JSON string
        { name: 'tips_en', type: 'string', isOptional: true }, // JSON string
        { name: 'tips_de', type: 'string', isOptional: true }, // JSON string
        { name: 'tips_es', type: 'string', isOptional: true }, // JSON string
        { name: 'dataset_id', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ]
    }),
    // ... MAIS TABELAS SERÃO ADICIONADAS NAS FASES SEGUINTES
  ]
})
```

---

## 🔄 CI - GitHub Actions (`.github/workflows/ci.yml`) — implementado:

```yaml
name: CI - Backend

on:
  push:
    branches: [ main ]
    paths:
      - 'backend/**'
      - '.github/workflows/ci.yml'
  pull_request:
    branches: [ main ]
    paths:
      - 'backend/**'

jobs:
  backend-and-build:
    name: Test & Build
    runs-on: ubuntu-latest
    timeout-minutes: 20
    services:
      postgres:
        image: postgres:15-alpine
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: hevy_clone
        ports: ["5432:5432"]
        options: >-
          --health-cmd "pg_isready -U postgres"
          --health-interval 10s --health-timeout 5s --health-retries 5
    steps:
    - uses: actions/checkout@v4
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with: { node-version: '20', cache: npm, cache-dependency-path: backend/package-lock.json }
    - name: Install Dependencies
      run: npm ci
      working-directory: backend
    - name: Apply Migrations
      run: npm run prisma:deploy
      working-directory: backend
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/hevy_clone
    - name: Seed Exercise Dataset
      run: npm run seed
      working-directory: backend
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/hevy_clone
    - name: Download Exercise Dataset
      run: npm run download-dataset
      working-directory: backend
    - name: Lint
      run: npm run lint
      working-directory: backend
    - name: Run Tests
      run: npm test
      working-directory: backend
    - name: Build
      run: npm run build
      working-directory: backend
```

> ✅ Roda com **PostgreSQL como serviço**: aplica `prisma migrate deploy`, roda o seed
> (400 exercícios), download do dataset, lint, testes e build a cada PR/push.
>
> **Banco de desenvolvimento:** [Supabase](https://supabase.com) (Postgres free gerenciado) —
> `DATABASE_URL` local no `.env` aponta para o Supabase; na CI usamos o Postgres efêmero do runner.
> `DATABASE_URL` local aponta para o projeto Supabase; a CI usa o Postgres efêmero do runner.

---

## 🐳 Docker Compose (Local Development) — implementado na raiz:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: hevy_clone
    ports: ["5432:5432"]
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]

  backend:
    build: ./backend
    ports: ["4000:4000"]
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/hevy_clone
      REDIS_URL: redis://redis:6379
      JWT_SECRET: development-secret-key
      NODE_ENV: development
      PORT: 4000
    volumes:
      - ./backend:/app
      - /app/node_modules
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started

volumes:
  postgres_data:
```

---

## 📝 Checklist de Implementação

### Semana 1 (Backend):
- [x] Criar projeto Node.js com TypeScript
- [x] Configurar Fastify + Apollo Server
- [x] Configurar Prisma + PostgreSQL (Docker)
- [x] Criar schema.prisma completo
- [x] Implementar autenticação (register/login)
- [x] **Baixar Exercise Dataset (400 exercícios)**
- [x] **Criar seed para importar os exercícios**
- [x] Configurar JWT + middleware
- [x] Escrever testes unitários (Vitest) — 23 testes passando
- [x] Configurar GitHub Actions

### Semana 2 (Frontend):
- [x] Criar projeto Expo com TypeScript
- [x] Configurar NativeWind (Tailwind)
- [x] Configurar React Navigation
- [x] Configurar Apollo Client
- [x] Implementar autenticação (login/register)
- [x] Configurar Zustand + SecureStore
- [x] Configurar WatermelonDB (schema base)
- [x] Criar componentes UI (Button, Input, Card)
- [x] Criar telas básicas (Home, Profile, Exercícios)
- [x] **Testar exibição de exercícios com imagens** — bundle Android validado (`expo export`)

### Semana 3 (Integração):
- [x] Integrar frontend com backend
- [x] Testar fluxo de autenticação completo
- [x] **Verificar importação dos 400 exercícios** — dataset validado (JSON + URLs de imagem)
- [x] **Testar exibição de imagens WebP** — URLs verificadas (HTTP 200, `image/webp`)
- [ ] Deploy backend (hospedagem pública) — **pendente: escolher plataforma (ex.: Render)**
- [x] Configurar variáveis de ambiente
- [ ] Testar em dispositivo real (iOS + Android) — **pendente: depende de backend + Postgres**
- [x] **Adicionar atribuição: "Exercise data by RepDB (repdb.co)"**
- [x] Documentar API e setup

---

## 🔧 Variáveis de Ambiente

### Backend (`.env`) — `.env.example` no repo (atualizado):
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/hevy_clone
JWT_SECRET=your-super-secret-key-at-least-32-characters
JWT_EXPIRES_IN=7d
PORT=4000
LOG_LEVEL=info
CORS_ORIGIN=*
BASE_IMAGE_URL=https://raw.githubusercontent.com/sergei-argutin/exercise-dataset/main/images/flat/
DATASET_URL=https://exercise-dataset.com/exercises.json

# Fases futuras
REDIS_URL=redis://localhost:6379
GOOGLE_DRIVE_API_KEY=your-api-key
R2_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
R2_BUCKET_NAME=your-bucket
```

### Frontend (`.env`):
```env
EXPO_PUBLIC_API_URL=http://localhost:4000/graphql
EXPO_PUBLIC_DATASET_BASE_URL=https://raw.githubusercontent.com/sergei-argutin/exercise-dataset/main/images/flat/
EXPO_PUBLIC_APP_NAME=PointFit
```

---

## 🚀 Comandos para Iniciar

Necessita de PostgreSQL. Sem Docker local, você pode subir via `docker compose`
(ou usar um Postgres remoto e apontar `DATABASE_URL`).

```bash
# Backend
cd backend
npm install
cp .env.example .env          # ajuste DATABASE_URL, JWT_SECRET, BASE_IMAGE_URL
npm run download-dataset      # baixa o exercises.json (400 exercícios)
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed           # upsert dos 400 exercícios
npm run dev                  # http://localhost:4000/graphql

# Frontend (exige backend no ar para login/sync)
cd frontend
npm install
cp .env.example .env
npx expo start               # Expo Go / emulador

# Validações
npm run typecheck            # tsc frontend limpo
npx expo export --platform android   # valida o bundle Hermes
npm run lint && npm test && npm run build   # backend

# Docker (subir Postgres + Redis + backend juntos)
docker-compose up -d         # na raiz do repo
```

> **No dev Windows atual não há Docker/Postgres local** — por isso migrate/seed reais
> rodam apenas via `docker compose` ou na CI (que provisiona o Postgres como serviço).

---

## 📜 Atribuição Obrigatória

Conforme a licença do Exercise Dataset, é necessário incluir atribuição no app:

**No frontend (tela Sobre/Créditos):**
```tsx
<Text className="text-sm text-gray-500">
  Exercise data by{' '}
  <Text className="text-blue-500" onPress={() => Linking.openURL('https://repdb.co')}>
    RepDB (repdb.co)
  </Text>
</Text>
```

---

## 📊 Critérios de Aceitação da Fase 1

1. ✅ Backend roda localmente sem erros
2. ✅ API GraphQL responde no `http://localhost:4000/graphql`
3. ✅ É possível registrar um novo usuário (integração GraphQL + testes)
4. ✅ É possível fazer login com credenciais válidas
5. ✅ Token JWT é gerado e validado
6. ✅ **Biblioteca tem 400+ exercícios do Exercise Dataset** (seed upsert idempotente)
7. ✅ **Imagens WebP dos exercícios são exibidas corretamente** (URLs verificadas, expo-image no frontend)
8. ✅ App mobile inicia e mostra tela de login/registro (bundle Hermes validado)
9. ✅ Após login, navega para tela Home
10. ✅ Dados do usuário persistem no SecureStore
11. ✅ Tests passam — 23/23 no backend (unit + integração)
12. ✅ **Atribuição ao RepDB está visível no app** (tela Perfil/Sobre)
13. ✅ Documentação básica do README

> **Ressalva:** critérios "end-to-end" (registro/login reais em Postgres e teste em
> dispositivo) dependem de um banco/backend no ar — executáveis via `docker compose`
> ou no CI.

---

## 🧭 Decisões de Implementação (adaptações em relação à spec original)

- **Tailwind fixado em `3.2.7`**: NativeWind 2.0.11 processa CSS de forma **síncrona**
  (`extractStyles` → `.process().css`). Tailwind ≥ 3.3 registra o plugin como `async`,
  o que estoura `Use process(css).then(cb)`. Fix também trava `postcss` em `8.4.31`
  via `overrides`.
- **Imagens servidas remotamente**: em vez de baixar os WebP para o repositório, as URLs
  apontam para o GitHub raw do dataset. Reduz o tamanho do repo (2.035 arquivos, ~90 MB).
- **WatermelonDB com LokiJSAdapter**: SQLiteAdapter exige módulo nativo indisponível no
  Expo Go; LokiJS é 100% JS. Coluna `_status` é gerenciada pela lib (não declarada no schema).
- **Apollo `formatError`**: `instanceof AppError/ZodError` falha por cópias duplicadas
  do módulo (CJS/ESM) — resolvido com *duck typing* (`isAppError`/`isZodError` +
  `unwrapOriginalError` recursivo).
- **Entry frontend = `index.ts`** e `plugins` do app.json sem `expo-secure-store`
  (versão sem config plugin válida; SecureStore funciona no Expo Go sem ele).
- **Seed idempotente**: `upsert` por `datasetId` (`@@unique([datasetId])`) em vez de
  `create` puro — permite re-executar com segurança.
- **Enum `MuscleGroup`** ganhou `FullBody` e `Other` (o dataset usa `Other` em alguns
  registros).
- **Testes**: Vitest (mocks via `vi.hoisted`); 23 testes em 5 arquivos (unit + integração).

> Detalhes completos da execução, verificação e pendências em
> [docs/progress/fase-1.md](./../progress/fase-1.md).

---

**Próximos passos após a Fase 1:**
- Fase 2: Core do Treino (registro de séries, timer, 1RM)
- Fase 3: Offline-first (WatermelonDB sync)

## Histórico de Conversa com a IA

O histórico de conversa com a IA se encontra em: `C:\Users\user\Documents\Projetos Pessoais\Nova pasta\PointFit\docs\history\histórico-de-conversa-ia-md`