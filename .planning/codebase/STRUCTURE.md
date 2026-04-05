# Codebase Structure

**Analysis Date:** 2026-03-30

## Directory Layout

```text
gestao_predial/
├── frontend/             # SPA Vue/Quasar (UI, rotas, componentes, estado)
├── backend/              # API Hono, autenticação, assets, módulos dinâmicos
├── packages/             # Camada compartilhada (config, db, schema, validation, infra)
├── scripts/              # Automações operacionais (db, seeds, geração)
├── public/               # Assets públicos consumidos pelo frontend/Vite
├── dist/frontend/        # Build do frontend servido pelo backend/assets
├── docker/               # Artefatos de containerização
└── .planning/codebase/   # Documentação de mapeamento para GSD
```

## Directory Purposes

**`frontend/`:**
- Purpose: UI da aplicação e experiência de navegação.
- Contains: `pages/`, `components/`, `router/`, `stores/`, `lib/`, `layouts/`.
- Key files: `frontend/main.ts`, `frontend/router/index.ts`, `frontend/App.vue`.

**`backend/`:**
- Purpose: Servir API, autenticação, conteúdo dinâmico e assets estáticos.
- Contains: `api/`, `auth/`, `middleware/`, `lib/`, `dynamic/`, `assets/`, `queues/`.
- Key files: `backend/index.ts`, `backend/api/index.ts`, `backend/context.ts`.

**`packages/`:**
- Purpose: Reuso de contratos e infraestrutura entre módulos.
- Contains: `config/`, `db/`, `schema/`, `validation/`, `auth/`, `redis/`, `workers/` e integrações.
- Key files: `packages/config/index.ts`, `packages/db/index.ts`, `packages/schema/index.ts`.

**`backend/lib/predial/`:**
- Purpose: Domínio predial em camadas internas.
- Contains: `repositories/`, `services/`, `middleware/`.
- Key files: `backend/lib/predial/repositories/ticketRepository.ts`, `backend/lib/predial/services/notificationService.ts`, `backend/lib/predial/middleware/predialGuard.ts`.

## Key File Locations

**Entry Points:**
- `backend/index.ts`: entrada HTTP principal do backend.
- `frontend/main.ts`: bootstrap da SPA.
- `frontend/router/index.ts`: composição global de rotas e guardas.

**Configuration:**
- `package.json`: scripts de dev/build/test/lint e dependências.
- `tsconfig.json`: aliases de fronteira (`@frontend`, `@backend`, `@packages`).
- `vite.config.ts`: build frontend e proxy para backend em desenvolvimento.
- `drizzle.config.ts`: configuração de migrações Drizzle.

**Core Logic:**
- `backend/api/app/index.ts`: namespace de rotas autenticadas do app.
- `backend/api/admin/index.ts`: namespace admin com `requireAdmin`.
- `backend/api/app/predial/tickets/index.ts`: fluxo principal de chamados/OS no domínio predial.
- `backend/lib/predial/`: regras de negócio e acesso a dados.
- `packages/schema/` + `packages/validation/`: contratos e validações.

**Testing:**
- Not detected: não há pasta `tests`/`__tests__` evidente no escopo principal `frontend/`, `backend/` e `packages/` durante esta análise.

## Naming Conventions

**Files:**
- `index.ts` como agregador/entrypoint de módulo (ex.: `backend/api/*/index.ts`, `packages/*/index.ts`).
- Arquivos de rota por domínio/subdomínio em kebab-case (ex.: `backend/api/app/predial/service-types/index.ts`).
- Páginas Vue em `frontend/pages/...` com nomes em minúsculo para módulos prediais (ex.: `technician.vue`, `supervisor.vue`).

**Directories:**
- Separação por contexto funcional: `app`, `admin`, `core`, `predial`, `platform`.
- Camadas explícitas no domínio: `repositories`, `services`, `middleware`.

## Where to Add New Code

**New Feature (app autenticado):**
- Primary code: criar rota em `backend/api/app/<dominio>/` e compor no `backend/api/app/index.ts`.
- Domain logic: implementar em `backend/lib/<dominio>/services` e `backend/lib/<dominio>/repositories`.
- Contracts: adicionar tipos/tabelas em `packages/schema/...` e validações em `packages/validation/...`.
- Frontend UI: página em `frontend/pages/app/...`, rota em `frontend/router/app/...`, componentes em `frontend/components/app/...`.

**New Admin Feature:**
- API: `backend/api/admin/<dominio>/` e registrar em `backend/api/admin/index.ts`.
- Frontend admin route: `frontend/router/admin/...`.
- Tela: `frontend/pages/admin/...`.

**New Shared Module:**
- Implementation: `packages/<novo-modulo>/index.ts`.
- Consumption: importar via alias `@packages/<novo-modulo>`.

**Utilities:**
- Shared helpers frontend: `frontend/lib/core/utils/`.
- Shared backend helpers de domínio: `backend/lib/<dominio>/services/` (evitar lógica em handlers).
- Infra transversal: `packages/` (config/db/redis/workers).

## Special Directories

**`frontend/*/core/` (boilerplate):**
- Purpose: código base compartilhado do boilerplate.
- Generated: No.
- Committed: Yes.

**`dist/frontend/`:**
- Purpose: build estático do frontend servido por `backend/assets/index.ts`.
- Generated: Yes.
- Committed: geralmente não versionado como fonte de verdade (confirmar política do time).

**`.planning/codebase/`:**
- Purpose: documentação operacional para planejamento/execução GSD.
- Generated: Yes (por agentes de mapeamento).
- Committed: depende do fluxo GSD do projeto.

---

*Structure analysis: 2026-03-30*
