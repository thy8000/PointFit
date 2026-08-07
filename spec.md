# 🏋️ FASE 1 - FUNDAÇÃO - SPEC TÉCNICA COMPLETA (ATUALIZADA)

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
9. ✅ Deploy do backend (Railway ou Fly.io)

---

## 📁 Estrutura do Projeto

```
hevy-clone/
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
│   │   │       └── data/
│   │   │           ├── exercises.json  # Dataset baixado
│   │   │           └── images/         # Pasta com as imagens WebP
│   │   ├── shared/
│   │   │   ├── database/
│   │   │   │   └── prisma.client.ts
│   │   │   ├── storage/
│   │   │   │   ├── google-drive.service.ts
│   │   │   │   └── cloudflare-r2.service.ts
│   │   │   └── logger/
│   │   │       └── logger.ts
│   │   ├── graphql/
│   │   │   ├── schema.graphql
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
│   │   └── main.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts               # Script para importar o dataset
│   ├── scripts/
│   │   └── download-dataset.sh   # Script para baixar o dataset
│   ├── tests/
│   │   ├── unit/
│   │   └── integration/
│   ├── docker-compose.yml
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   ├── client.ts
    │   │   ├── queries/
    │   │   │   ├── auth.queries.ts
    │   │   │   └── exercises.queries.ts
    │   │   └── mutations/
    │   │       └── auth.mutations.ts
    │   ├── models/  # WatermelonDB
    │   │   ├── User.ts
    │   │   ├── Exercise.ts
    │   │   └── index.ts
    │   ├── db/
    │   │   ├── database.ts
    │   │   ├── schema.ts
    │   │   └── sync.ts
    │   ├── screens/
    │   │   ├── Auth/
    │   │   │   ├── LoginScreen.tsx
    │   │   │   └── RegisterScreen.tsx
    │   │   └── App/
    │   │       ├── HomeScreen.tsx
    │   │       └── ProfileScreen.tsx
    │   ├── components/
    │   │   └── ui/
    │   │       ├── Button.tsx
    │   │       ├── Input.tsx
    │   │       ├── Card.tsx
    │   │       └── Typography.tsx
    │   ├── hooks/
    │   │   └── useAuth.ts
    │   ├── store/
    │   │   └── authStore.ts
    │   ├── navigation/
    │   │   ├── AppNavigator.tsx
    │   │   ├── AuthNavigator.tsx
    │   │   └── types.ts
    │   ├── utils/
    │   │   ├── constants.ts
    │   │   └── storage.ts
    │   ├── types/
    │   │   └── graphql.ts
    │   └── App.tsx
    ├── assets/
    │   └── fonts/
    ├── app.json
    ├── tailwind.config.js
    ├── metro.config.js
    ├── package.json
    └── tsconfig.json
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

---

## 📥 Script para Baixar o Dataset

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

---

## 🎨 Frontend - Configuração Base

### Package.json (Frontend):
```json
{
  "name": "hevy-clone",
  "version": "0.0.1",
  "main": "node_modules/expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "build": "expo build",
    "lint": "eslint . --ext .ts,.tsx"
  },
  "dependencies": {
    "expo": "~50.0.0",
    "expo-status-bar": "~1.11.0",
    "react": "18.2.0",
    "react-native": "0.73.2",
    "react-native-safe-area-context": "4.8.2",
    "react-native-screens": "~3.29.0",
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/stack": "^6.3.20",
    "@react-navigation/bottom-tabs": "^6.5.11",
    "nativewind": "^2.0.11",
    "tailwindcss": "^3.3.2",
    "@apollo/client": "^3.8.8",
    "graphql": "^16.8.1",
    "zustand": "^4.4.7",
    "@nozbe/watermelondb": "^0.27.1",
    "react-native-gesture-handler": "~2.14.0",
    "react-native-reanimated": "~3.6.2",
    "expo-secure-store": "~12.0.0",
    "expo-image": "~1.10.0"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0",
    "@types/react": "~18.2.45",
    "typescript": "^5.3.3",
    "eslint": "^8.56.0",
    "@typescript-eslint/eslint-plugin": "^6.18.1",
    "@typescript-eslint/parser": "^6.18.1"
  }
}
```

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
        { name: 'primary_muscles', type: 'string' }, // JSON string
        { name: 'secondary_muscles', type: 'string' }, // JSON string
        { name: 'goals', type: 'string' }, // JSON string
        { name: 'tags', type: 'string' }, // JSON string
        { name: 'met', type: 'number', isOptional: true },
        { name: 'is_unilateral', type: 'boolean' },
        { name: 'is_bodyweight', type: 'boolean' },
        { name: 'instructions_en', type: 'string' }, // JSON string
        { name: 'instructions_de', type: 'string' }, // JSON string
        { name: 'instructions_es', type: 'string' }, // JSON string
        { name: 'tips_en', type: 'string' }, // JSON string
        { name: 'tips_de', type: 'string' }, // JSON string
        { name: 'tips_es', type: 'string' }, // JSON string
        { name: 'dataset_id', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        { name: '_status', type: 'string' },
      ]
    }),
    // ... MAIS TABELAS SERÃO ADICIONADAS NAS FASES SEGUINTES
  ]
})
```

---

## 🔄 CI/CD - GitHub Actions (`.github/workflows/deploy.yml`):

```yaml
name: Deploy Backend

on:
  push:
    branches: [ main ]
    paths:
      - 'backend/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'
        
    - name: Install Dependencies
      run: |
        cd backend
        npm ci
        
    - name: Download Exercise Dataset
      run: |
        cd backend
        npm run download-dataset
        
    - name: Run Tests
      run: |
        cd backend
        npm test
        
    - name: Build
      run: |
        cd backend
        npm run build
        
    - name: Deploy to Railway
      uses: railwayup/action-railway@v1
      with:
        railway_token: ${{ secrets.RAILWAY_TOKEN }}
        service: ${{ secrets.RAILWAY_SERVICE }}
```

---

## 🐳 Docker Compose (Local Development):

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: hevy_clone
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  backend:
    build: ./backend
    ports:
      - "4000:4000"
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/hevy_clone
      REDIS_URL: redis://redis:6379
      JWT_SECRET: development-secret-key
    depends_on:
      - postgres
      - redis
    volumes:
      - ./backend:/app
      - /app/node_modules

volumes:
  postgres_data:
```

---

## 📝 Checklist de Implementação

### Semana 1 (Backend):
- [ ] Criar projeto Node.js com TypeScript
- [ ] Configurar Fastify + Apollo Server
- [ ] Configurar Prisma + PostgreSQL (Docker)
- [ ] Criar schema.prisma completo
- [ ] Implementar autenticação (register/login)
- [ ] **Baixar Exercise Dataset (400 exercícios)**
- [ ] **Criar seed para importar os exercícios**
- [ ] Configurar JWT + middleware
- [ ] Escrever testes unitários (Vitest)
- [ ] Configurar GitHub Actions

### Semana 2 (Frontend):
- [ ] Criar projeto Expo com TypeScript
- [ ] Configurar NativeWind (Tailwind)
- [ ] Configurar React Navigation
- [ ] Configurar Apollo Client
- [ ] Implementar autenticação (login/register)
- [ ] Configurar Zustand + SecureStore
- [ ] Configurar WatermelonDB (schema base)
- [ ] Criar componentes UI (Button, Input, Card)
- [ ] Criar telas básicas (Home, Profile)
- [ ] **Testar exibição de exercícios com imagens**

### Semana 3 (Integração):
- [ ] Integrar frontend com backend
- [ ] Testar fluxo de autenticação completo
- [ ] **Verificar importação dos 400 exercícios**
- [ ] **Testar exibição de imagens WebP**
- [ ] Deploy backend (Railway/Fly.io)
- [ ] Configurar variáveis de ambiente
- [ ] Testar em dispositivo real (iOS + Android)
- [ ] **Adicionar atribuição: "Exercise data by RepDB (repdb.co)"**
- [ ] Documentar API e setup

---

## 🔧 Variáveis de Ambiente

### Backend (`.env`):
```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/hevy_clone

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-key-at-least-32-characters

# Google Drive (para vídeos futuros)
GOOGLE_DRIVE_API_KEY=your-api-key

# Cloudflare R2 (para fotos de usuário)
R2_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
R2_BUCKET_NAME=your-bucket

# Environment
NODE_ENV=development
PORT=4000

# Dataset (URL do JSON)
DATASET_URL=https://exercise-dataset.com/exercises.json
```

### Frontend (`.env`):
```env
EXPO_PUBLIC_API_URL=http://localhost:4000/graphql
EXPO_PUBLIC_DATASET_BASE_URL=https://raw.githubusercontent.com/sergei-argutin/exercise-dataset/main/images/flat/
```

---

## 🚀 Comandos para Iniciar

```bash
# Backend
cd backend
npm install
# Baixar o dataset (JSON + imagens)
npm run download-dataset
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
npm run dev

# Frontend
cd frontend
npm install
npx expo start

# Docker (opcional)
docker-compose up -d
```

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
3. ✅ É possível registrar um novo usuário
4. ✅ É possível fazer login com credenciais válidas
5. ✅ Token JWT é gerado e validado
6. ✅ **Biblioteca tem 400+ exercícios do Exercise Dataset**
7. ✅ **Imagens WebP dos exercícios são exibidas corretamente**
8. ✅ App mobile inicia e mostra tela de login/registro
9. ✅ Após login, navega para tela Home
10. ✅ Dados do usuário persistem no SecureStore
11. ✅ Tests passam (unitários)
12. ✅ **Atribuição ao RepDB está visível no app**
13. ✅ Documentação básica do README

---

**Próximos passos após a Fase 1:**
- Fase 2: Core do Treino (registro de séries, timer, 1RM)
- Fase 3: Offline-first (WatermelonDB sync)

## Histórico de Conversa com a IA

O histórico de conversa com a IA se encontra em: C:\Users\user\Documents\Projetos Pessoais\Nova pasta\PointFit\histórico-de-conversa-ia-md