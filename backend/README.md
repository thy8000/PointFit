# PointFit — Backend

API GraphQL (Fastify + Apollo Server) + PostgreSQL (Prisma) para o PointFit.

## Requisitos

- Node.js >= 20
- PostgreSQL 14+ (ou `docker compose up -d postgres`)

## Setup

```bash
cp .env.example .env   # ajuste DATABASE_URL, JWT_SECRET, etc.
npm install
npx prisma migrate dev # cria o schema
npm run seed           # popula o catálogo de 400 exercícios
npm run dev            # sobe em http://localhost:4000/graphql
```

## Scripts

| Script            | Descrição                                            |
| ----------------- | ---------------------------------------------------- |
| `npm run dev`     | servidor em modo watch (tsx)                         |
| `npm run build`   | compila TS para `dist/`                              |
| `npm start`       | roda o build (`dist/main.js`)                        |
| `npm test`        | Vitest (unit + integração)                           |
| `npm run lint`    | ESLint                                               |
| `npm run typecheck` | `tsc --noEmit`                                     |
| `npm run seed`    | upsert dos exercícios no banco                       |
| `npm run download-dataset` | baixa `exercises.json` da Exercise Dataset  |

## Dataset de exercícios

O catálogo vem da [Exercise Dataset](https://exercise-dataset.com/) (400 exercícios,
imagens WebP em alta resolução). Uso permitido mediante **atribuição** — o crédito
aparece no app (link para <https://repdb.co>) e os arquivos baixados mantêm a licença
original. Ver `src/modules/exercises/data/` e `prisma/seed.ts`.

## Estrutura

```
src/
  app.ts              # buildApp (Fastify + Apollo + plugins)
  main.ts             # bootstrap
  graphql/            # schema.graphql, typeDefs, context, resolvers
  modules/
    auth/             # registro/login JWT (zod)
    users/            # perfil do usuário
    exercises/        # catálogo de exercícios (dataset)
  middlewares/        # auth, error handling
  shared/             # db, logger, storage, errors
  utils/              # jwt, bcrypt, validators
prisma/
  schema.prisma       # modelo de dados (User, Workout*, Progress*)
  seed.ts             # seed do ExerciseLibrary
tests/                # unit + integração (Vitest)
```

## Docker / CI

- `Dockerfile` + `docker-compose.yml` (postgres + redis opcional) na raiz do repositório.
- `.github/workflows/ci.yml`: CI do backend (lint, typecheck, teste, build) com Postgres
  de serviço e execução de `prisma migrate deploy` + `seed` — + banco de dev no Supabase.

## Variáveis de ambiente

| Variável | Obrigatória | Padrão | Descrição |
| --- | --- | --- | --- |
| `DATABASE_URL` | sim | — | Postgres Prisma connection string |
| `JWT_SECRET` | sim | — | segredo para assinatura do token |
| `JWT_EXPIRES_IN` | não | `7d` | validade do token |
| `PORT` | não | `4000` | porta HTTP |
| `LOG_LEVEL` | não | `info` | nível de log (pino) |
| `CORS_ORIGIN` | não | `*` | origem permitida no CORS |
| `BASE_IMAGE_URL` | não | — | base das URLs de imagem do dataset (seed) |
