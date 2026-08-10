# 📈 Fase 1 — Progresso de Implementação

**Spec:** [docs/specs/fase-1.md](../specs/fase-1.md)
**Status:** ✅ Implementada · **Duração real:** iniciada em 07/2026, concluída em 07/08/2026
**Branch:** `feature/fase-1` (commit `e7c2873` — "feat: implement phase 1 - backend and mobile app")

---

## Resumo

A Fase 1 (fundação) foi entregue: backend GraphQL completo, catálogo de exercícios do
Exercise Dataset integrado, frontend Expo com navegação e camada offline (WatermelonDB),
CI/CD e Docker. Todo o código foi verificado localmente (testes, typecheck, lint, build e
bundling), com exceção de operações que exigem PostgreSQL/Docker reais (migrate/seed).

---

## ✅ Concluído

### Backend (`backend/`)
- Fastify + Apollo Server + TypeScript; entrada `src/app.ts` + `src/main.ts`.
- Prisma schema completo: `User`, `ExerciseLibrary`, `WorkoutRoutine`, `RoutineExercise`,
  `WorkoutSession`, `WorkoutSet`, `BodyMeasurement`, `ProgressPhoto` + enums
  (`MuscleGroup` com `FullBody`/`Other`, `EquipmentType`, `SetType`).
- Autenticação JWT (register/login) com validação Zod e bcrypt.
- **Exercise Dataset**: `exercises.json` baixado (400 exercícios, 1,3 MB); URLs de imagem
  WebP verificadas (HTTP 200); seed **idempotente** por `upsert` (`datasetId`).
- GraphQL: queries `me`, `exercises` (filtros), `exercise`, `exerciseByDatasetId`;
  mutations `register`/`login`; tratamento de erros via duck-typing no `formatError`.
- Dockerfile, eslint, vitest (23 testes / 5 arquivos), `.env.example`.

### Frontend (`frontend/`)
- Expo SDK 50 + TypeScript, NativeWind (Tailwind), React Navigation (Auth + Tabs),
  Apollo Client, Zustand + SecureStore.
- WatermelonDB (LokiJS adapter) com schema v1 (`users`, `exercises`) e sync via GraphQL.
- Telas: Login, Register, Home, Exercícios (filtro por músculo + imagens), Perfil
  (avatar, link RepDB, logout).
- `typecheck` limpo; `expo export --platform android` gerou bundle Hermes 4,23 MB sem erros.

### Infra / Docs
- `.github/workflows/ci.yml` (lint, testes, build, migrate deploy + seed com Postgres
  do runner).
- Banco de uso no **Supabase** (Postgres free) — `DATABASE_URL` no `.env` local.
- `docker-compose.yml` (postgres + redis + backend, com healthcheck).
- READMEs (raiz + backend), atribuição obrigatória RepDB no app.
- Estrutura de docs: `docs/specs/`, `docs/progress/`, `docs/history/`.

---

## Verificação (comandos executados)

| Comando | Resultado |
| --- | --- |
| `npx prisma validate` / `npx prisma generate` | ✅ OK |
| `npm run typecheck` (backend e frontend) | ✅ limpo |
| `npm run build` (backend) | ✅ OK (schema.graphql copiado para dist) |
| `npm run lint` (backend) | ✅ limpo |
| `npm test` (backend) | ✅ 23/23 passing |
| `npm run download-dataset` | ✅ 400 exercícios |
| Boot do servidor (`/health`, `/graphql`) | ✅ 200 OK |
| `npx expo export --platform android` | ✅ bundle Hermes |
| URLs de imagem WebP (3 amostras) | ✅ 200 `image/webp` |

---

## 🔧 Problemas encontrados e soluções

1. **NativeWind × Tailwind async** — NativeWind 2 usa postcss **síncrono**; tailwind ≥3.3
   virou plugin async → "Use process(css).then(cb)". Fix: `tailwindcss` fixado em `3.2.7`
   e `postcss` em `8.4.31` (via `overrides`).
2. **Apollo `formatError`** — `instanceof` quebrou por duplicatas do módulo (CJS/ESM);
   trocado por duck-typing (`isAppError`/`isZodError` + `unwrapOriginalError`).
3. **WatermelonDB no Expo Go** — SQLiteAdapter exige módulo nativo; usamos LokiJSAdapter
   (100% JS). `_status` é gerenciado pela lib (não vai no schema).
4. **`contentContainerClassName`** não é suportado no NativeWind 2 → `contentContainerStyle`.
5. **Vitest hoisting** — mocks precisam de `vi.hoisted(() => ({}))`.

---

## ⏳ Pendências

- [x] `prisma migrate deploy` + seed em **banco real**: executado na CI (Postgres de
      serviço — 400 exercícios importados) e agora no **Supabase** localmente.
- [x] Teste de login/registro ponta a ponta com backend + Postgres no ar.
- [x] Teste em dispositivo real (Expo Go / emulador).
- [ ] Deploy do backend em hospedagem pública (Render) — config pronto (`render.yaml` + workflow), aguardando criação do serviço no painel.
- [ ] Frontend: `npm audit` (dependências com avisos — não tratado nesta fase).
- [ ] `expo-doctor` / provisão de native modules se migrar p/ dev build.
- [ ] Decisão sobre versionar `docs/history/` (histórico de IA).

---

## 📌 Notas gerais

- Em toda modificação, `README.md` e `spec` devem ser mantidos em sincronia.
- Mantida a atribuição RepDB (licença do Exercise Dataset) no app e nos READMEs.
- Seed exige `BASE_IMAGE_URL` — o `exercises.json` não contém binário de imagem.

---

## 🔜 Próxima fase

**Fase 2 — Core do Treino:** rotinas (CRUD), sessões de treino, registro de séries,
timer e cálculo de 1RM (API GraphQL + telas + continuidade do offline-first).