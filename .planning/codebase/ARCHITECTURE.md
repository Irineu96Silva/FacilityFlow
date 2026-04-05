# Architecture

**Analysis Date:** 2026-03-30

## Pattern Overview

**Overall:** Monorepo modular em camadas com frontend SPA (`Vue + Quasar`), backend HTTP modular (`Hono`) e domínio compartilhado em `packages/`.

**Key Characteristics:**
- Use aliases de camada (`@frontend/*`, `@backend/*`, `@packages/*`) para manter fronteiras explícitas em `tsconfig.json`.
- Composição por roteadores pequenos (`Hono.route(...)`) tanto no backend raiz quanto nos subdomínios em `backend/api/...`.
- Domínio de negócio encapsulado em `backend/lib/...` e contratos compartilhados em `packages/schema` + `packages/validation`.

## Layers

**Frontend SPA:**
- Purpose: Renderizar UI, controlar navegação, estado local e chamar API HTTP.
- Location: `frontend/`
- Contains: `pages`, `components`, `router`, `stores`, `lib`.
- Depends on: `@frontend/*`, `@packages/*`, endpoints em `/api/*`.
- Used by: Usuário final via navegador/app.

**Backend API Gateway:**
- Purpose: Orquestrar middleware global, montar subaplicações e expor endpoints.
- Location: `backend/index.ts`, `backend/api/`, `backend/auth/`, `backend/dynamic/`, `backend/assets/`.
- Contains: Roteamento HTTP, middlewares de autenticação/autorização e health checks.
- Depends on: `@backend/lib/*`, `@packages/*`.
- Used by: Frontend (`/api`, `/dynamic`) e clientes HTTP internos.

**Domain/Application Services (Predial e Core):**
- Purpose: Implementar regras de negócio e casos de uso sem acoplar ao roteador principal.
- Location: `backend/lib/predial/` e módulos similares.
- Contains: `repositories`, `services`, `middleware`.
- Depends on: `@packages/db`, `@packages/schema`, `@packages/validation`.
- Used by: Handlers de rota em `backend/api/...`.

**Shared Packages:**
- Purpose: Centralizar infraestrutura e contratos reutilizáveis por backend (e partes do frontend).
- Location: `packages/`
- Contains: `config`, `db`, `schema`, `validation`, `auth`, `redis`, `queues`, `workers`, integrações.
- Depends on: dependências externas (Drizzle, Better Auth, Redis, etc.).
- Used by: Backend e utilitários/scripts do workspace.

## Data Flow

**Fluxo de requisição autenticada (app):**

1. Usuário navega em rota do app no frontend (`frontend/router/app/index.ts` + `frontend/router/app/predial.ts`).
2. Página/componente chama API (`fetch("/api/...")` em `frontend/pages/app/predial/technician.vue` ou client tipado em `frontend/lib/core/client/index.ts`).
3. `vite` faz proxy em dev para backend (`vite.config.ts`); em runtime, backend atende `/api`.
4. `backend/index.ts` aplica `authMiddleware` global (`backend/middleware/core/auth.ts`) e roteia para `backend/api/index.ts`.
5. Subrotas (`/app`, `/admin`, `/billing`, etc.) aplicam guardas locais (ex.: `requireAuth`, `requireAdmin`, `requireRole`).
6. Handler chama serviços/repositories (`backend/lib/predial/...`) e persiste via `@packages/db` + `@packages/schema`.
7. Resposta JSON volta ao frontend e atualiza estado local/UI.

**Fluxo de inicialização da aplicação:**

1. Backend sobe por `backend/index.ts`.
2. Executa `runMigrations()` de `packages/db/index.ts` conforme configuração.
3. Sincroniza papéis default (`@packages/pbac`) e agenda jobs periódicos (`backend/queues`).
4. Registra rotas por prioridade: `/api/auth` -> `/api` -> `/public` -> `/dynamic` -> `/files` -> `assets`.

**State Management:**
- Estado de UI/usuário no frontend com Pinia (`frontend/main.ts`, `frontend/stores/predial/*.ts`).
- Estado de domínio persistente no PostgreSQL via Drizzle (`packages/db/index.ts`, `packages/schema/...`).
- Estado assíncrono de jobs em filas Redis/BullMQ (`packages/workers/index.ts` e módulos de queue).

## Key Abstractions

**HTTP Composition por subapps Hono:**
- Purpose: Separar contextos funcionais por prefixo de rota.
- Examples: `backend/index.ts`, `backend/api/index.ts`, `backend/api/app/index.ts`, `backend/api/admin/index.ts`.
- Pattern: `new Hono().route("/prefix", childApp)`.

**Guards de autenticação/autorização:**
- Purpose: Garantir sessão e permissões antes da regra de negócio.
- Examples: `backend/middleware/core/auth.ts`, `backend/middleware/core/requireAuth.ts`, `backend/lib/predial/middleware/predialGuard.ts`.
- Pattern: Middleware global + guards explícitos por endpoint.

**Repositories de domínio:**
- Purpose: Isolar acesso ao banco e consultas complexas.
- Examples: `backend/lib/predial/repositories/ticketRepository.ts`, `backend/lib/predial/repositories/workOrderRepository.ts`.
- Pattern: Handlers chamam repositórios/serviços, evitando SQL no roteador sempre que possível.

**Contratos compartilhados:**
- Purpose: Unificar tipos e validação entre módulos.
- Examples: `packages/schema/index.ts`, `packages/validation/app/predial/index.ts`.
- Pattern: Schemas e validações reexportados por domínio.

## Entry Points

**Backend HTTP Entry Point:**
- Location: `backend/index.ts`
- Triggers: `bun run dev:backend`, `bun run start`
- Responsibilities: Middleware global, roteamento raiz, migração, schedulers.

**Frontend SPA Entry Point:**
- Location: `frontend/main.ts`
- Triggers: `bun run dev:frontend`, build Vite.
- Responsibilities: Bootstrap Vue, Pinia, Router, Quasar, tema.

**Frontend Routing Entry Point:**
- Location: `frontend/router/index.ts`
- Triggers: Navegação de rota no cliente.
- Responsibilities: Compor rotas públicas/autenticadas/admin e aplicar guard global.

**API Aggregation Entry Point:**
- Location: `backend/api/index.ts`
- Triggers: Requisições sob `/api`.
- Responsibilities: Compor namespaces da API e endpoints de health/version.

## Error Handling

**Strategy:** Tratamento central de exceções no backend com fallback JSON.

**Patterns:**
- Handler global em `backend/index.ts` retorna `status` apropriado e loga erros 5xx.
- Endpoints usam `HTTPException` para erros de domínio/permissão (`backend/api/app/predial/tickets/index.ts`).
- Fluxos não críticos (ex.: notificações) são protegidos com `try/catch` e não interrompem operação principal.

## Cross-Cutting Concerns

**Logging:** `console.*` em handlers e serviços (`backend/index.ts`, `backend/lib/predial/services/*`).
**Validation:** `zValidator` + schemas do `@packages/validation` nos endpoints Hono.
**Authentication:** Sessão Better Auth no middleware global e reforço de guardas por rota.

---

*Architecture analysis: 2026-03-30*
