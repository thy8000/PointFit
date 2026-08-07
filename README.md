# PointFit

Aplicativo de treino (workout tracker) inspirado no Hevy. Monorepo com:

- **`backend/`** — API GraphQL em Node.js (Fastify + Apollo Server), PostgreSQL com Prisma, autenticação JWT. [Leia mais](backend/README.md)
- **`frontend/`** — app móvel em React Native (Expo) com sincronização offline via WatermelonDB.

## Arquitetura

```
PointFit (mobile, React Native/Expo)
   │  Apollo Client ──────────┐
   │  WatermelonDB (offline)  │
   ▼                          ▼
API GraphQL (Fastify+Apollo) ───▶ PostgreSQL (Prisma)
        │                                │
        └── usado pelo seed: 400 exercícios (Exercise Dataset, imagens WebP)
```

## Como rodar

### Backend

```bash
cd backend
cp .env.example .env
npm install
npx prisma migrate dev && npm run seed
npm run dev            # http://localhost:4000/graphql
```

### Frontend

```bash
cd frontend
cp .env.example .env   # EXPO_PUBLIC_API_URL etc.
npm install
npx expo start         # Expo Go / emulador
```

O frontend funciona offline: exercícios sincronizados ficam no WatermelonDB e as
telas de Home/Exercícios leem do banco local. Requer um backend acessível para
login/registro e primeira sincronização.

## Stack

- Backend: Node.js, Fastify, Apollo Server, GraphQL, Prisma, PostgreSQL, JWT, Vitest, Docker.
- Frontend: Expo, React Native, TypeScript, NativeWind (Tailwind), Apollo Client,
  WatermelonDB (LokiJS adapter), Zustand, React Navigation.

## Atribuição do dataset

Os exercícios e imagens vêm da [Exercise Dataset](https://exercise-dataset.com/).
O uso é permitido com atribuição; o crédito aparece dentro do app (link para
[RepDB](https://repdb.co)). Não redistribua o dataset sem manter essa atribuição.

## CI/CD

O GitHub Actions em `.github/workflows/ci.yml` roda lint, testes, build, `prisma migrate
deploy` e seed de exercícios no backend (com Postgres provisionado como serviço), a cada
push/PR. O banco de desenvolvimento/uso é o **Supabase** (Postgres free).