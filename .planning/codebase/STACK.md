# Technology Stack

**Analysis Date:** 2026-03-30

## Languages

**Primary:**
- TypeScript (~5.9.3) - Base de `backend/`, `frontend/`, `packages/` via `package.json` e `tsconfig*.json`

**Secondary:**
- JavaScript (ESM) - Arquivos de configuração e scripts de tooling (`eslint.config.js`, scripts de build)
- Shell (Bash/PowerShell) - Automações operacionais em `scripts/` e utilitários no root

## Runtime

**Environment:**
- Bun - Runtime principal para API, workers e scripts (`package.json` scripts `dev:backend`, `work`, `db:*`)
- Node.js compatibility via Bun - Dependências do ecossistema Node usadas no runtime Bun (`hono`, `openai`, `ioredis`, AWS SDK)

**Package Manager:**
- Bun - Lockfile `bun.lock` presente no root
- pnpm - Lockfile `pnpm-lock.yaml` presente (inclui workspace paralelo em `projeto_predial/`)

## Frameworks

**Core:**
- Hono (`^4.11.5`) - API HTTP backend em `backend/index.ts` e rotas `backend/api/**`
- Vue 3 (`^3.5.27`) - SPA frontend em `frontend/**`
- Quasar (`^2.18.6`) - Camada de UI Vue, com plugin em `vite.config.ts`
- Drizzle ORM (`^0.44.7`) - ORM SQL tipado em `packages/db/index.ts` e schemas em `packages/schema/**`
- Better Auth (`^1.4.17`) - Autenticação em `packages/auth/index.ts`

**Testing:**
- Playwright (`^1.58.0`) - Dependência para testes E2E/automação (presente em `package.json`)

**Build/Dev:**
- Vite (`^7.3.1`) - Build/dev do frontend em `vite.config.ts`
- vue-tsc (`^3.2.3`) - Typecheck (`package.json` script `typecheck`)
- ESLint (`^9.39.2`) - Lint (`package.json` scripts `lint`, `lint:fix`)
- Prettier (`^3.8.1`) - Formatação (`package.json` script `format`)
- Drizzle Kit (`^0.31.8`) - Geração/migração de schema (`drizzle.config.ts`)

## Key Dependencies

**Critical:**
- `hono` - Framework HTTP do backend (`backend/index.ts`)
- `vue`, `quasar`, `pinia`, `vue-router` - Stack frontend SPA (`frontend/**`, `vite.config.ts`)
- `drizzle-orm`, `postgres` - Persistência PostgreSQL (`packages/db/index.ts`)
- `better-auth` - Sessões, login social, OTP (`packages/auth/index.ts`)
- `ioredis`, `bullmq` - Cache/session store e filas (`packages/redis/index.ts`, `packages/queues/index.ts`)
- `zod` e `@hono/zod-validator` - Validação de payloads (`packages/validation/**`, `backend/api/**`)

**Infrastructure:**
- `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner` - Storage S3 (`packages/files/s3Storage.ts`)
- `@aws-sdk/client-ses`, `nodemailer` - Email (SES/SMTP) (`packages/email/sesEmailSender.ts`, `packages/email/smtpEmailSender.ts`)
- `openai` - Cliente oficial de IA (`packages/openai/index.ts`)
- `stripe`, `mercadopago`, `@stripe/stripe-js` - Pagamentos backend/frontend (`packages/config/schema/core/payment.ts`, `backend/api/app/core/billing/index.ts`)
- `liquidjs` - Templates de mensagem (`packages/liquid/index.ts`)

## Configuration

**Environment:**
- Configuração centralizada via `@packages/config` (`packages/config/schema/index.ts`)
- Schemas de ambiente por domínio em:
  - `packages/config/schema/core/database.ts`
  - `packages/config/schema/core/redis.ts`
  - `packages/config/schema/core/auth.ts`
  - `packages/config/schema/core/payment.ts`
  - `packages/config/schema/core/email.ts`
  - `packages/config/schema/core/sms.ts`
  - `packages/config/schema/core/openai.ts`
  - `packages/config/schema/core/public.ts`
- Arquivos de ambiente detectados: `.env` e `.env.example` no root

**Build:**
- Frontend build/dev: `vite.config.ts`
- TS project refs: `tsconfig.json`, `tsconfig.backend.json`, `tsconfig.frontend.json`, `tsconfig.packages.json`
- Lint config: `eslint.config.js`
- DB generation: `drizzle.config.ts`

## Platform Requirements

**Development:**
- Bun (ferramenta principal de execução e scripts)
- PostgreSQL + Redis (dependências de runtime; configuradas via `database.*` e `redis.*`)
- Docker Compose presente para serviços locais (`docker-compose.yml`, `docker-compose.template.yml`)

**Production:**
- Backend Bun executando `backend/index.ts`
- Banco PostgreSQL e Redis externos
- Serviços externos habilitados conforme config (pagamento, e-mail, SMS, IA, storage)

---

*Stack analysis: 2026-03-30*
