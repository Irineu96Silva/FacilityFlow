# Coding Conventions

**Analysis Date:** 2026-03-30

## Naming Patterns

**Status atual:** Parcialmente consistente entre camadas (`backend`, `frontend`, `packages`), com excecoes em arquivos legados e scripts.

**Files:**
- Backend/Packages em `camelCase.ts` para modulos e repositorios (ex.: `backend/lib/predial/repositories/ticketRepository.ts`, `packages/validation/app/predial/units.ts`).
- Frontend com mistura de formatos: componentes em `PascalCase.vue` (ex.: `frontend/components/landing/HeroDisruptive.vue`) e paginas em `kebab/lowercase.vue` (ex.: `frontend/pages/admin/predial/reports.vue`).

**Functions:**
- `camelCase` para funcoes e handlers (ex.: `getInitialDarkMode` em `frontend/main.ts`, `syncDefaultRoles` usado em `backend/index.ts`).

**Variables:**
- `camelCase` para variaveis locais e estados reativos (ex.: `isOnline`, `queueSize` em `frontend/stores/predial/offline.ts`).
- Constantes de dominio e status em `UPPER_SNAKE_CASE` como valores de enum/string (ex.: `ASSIGNED`, `IN_PROGRESS` em `backend/api/app/predial/tickets/index.ts`).

**Types:**
- Tipos e aliases em `PascalCase` (ex.: `AppType` em `backend/index.ts`, `CreateUnitFormData` em `packages/validation/app/predial/units.ts`).

## Code Style

**Formatting:**
- Ferramenta: Prettier via script `format` em `package.json` (`prettier --write .`).
- Config dedicada (`.prettierrc` / `prettier.config.*`) nao detectada na raiz; comportamento depende do padrao do Prettier e convencoes do codigo atual.

**Linting:**
- Ferramenta: ESLint Flat Config em `eslint.config.js`.
- Escopo TS, JS e Vue com regras de `@eslint/js`, `typescript-eslint` e `eslint-plugin-vue`.
- Regra forte para nao usados (`@typescript-eslint/no-unused-vars: error`) com excecao por prefixo `_`.
- Regras afrouxadas: `no-explicit-any`, `explicit-function-return-type`, `no-non-null-assertion` desabilitadas.

**Typecheck:**
- Script `typecheck` em `package.json`: `vue-tsc -b --noEmit`.
- `strict: true` ativo em `tsconfig.frontend.json` e `tsconfig.backend.json`.
- Backend permite `allowJs: true` em `tsconfig.backend.json`.

## Import Organization

**Order:**
1. Dependencias externas (ex.: `hono`, `zod`, `vue`, `pinia`).
2. Dependencias internas por alias (`@backend/*`, `@frontend/*`, `@packages/*`).
3. Imports de estilo/assets em frontend (ex.: CSS no `frontend/main.ts`).

**Path Aliases:**
- `@frontend/*`, `@backend/*`, `@packages/*` definidos em `tsconfig.json`, `tsconfig.frontend.json` e `tsconfig.backend.json`.

## Error Handling

**Patterns:**
- API usa `HTTPException` e retornos JSON com status semantico (ex.: `backend/api/app/predial/tickets/index.ts`).
- Handlers encapsulam integracoes nao criticas com `try/catch` e `console.error` para nao interromper fluxo principal.
- Handler global de erro no backend em `backend/index.ts` para respostas consistentes e log de falhas 5xx.

## Logging

**Framework:** `console` (sem framework de observabilidade dedicado detectado no codigo analisado).

**Patterns:**
- Logs de inicializacao e jobs em `backend/index.ts`.
- Logs de erro localizados em pontos de integracao/side-effects (ex.: notificacoes e IA em `backend/api/app/predial/tickets/index.ts`).

## Comments

**When to Comment:**
- Comentarios orientados a contexto de negocio e regras de fluxo aparecem em modulos criticos (ex.: regras de foto/geofence em `backend/api/app/predial/tickets/index.ts`).
- Tarefas pendentes marcadas com `TODO` (ex.: `frontend/stores/predial/offline.ts`).

**JSDoc/TSDoc:**
- Uso moderado em exports e stores (ex.: `frontend/stores/predial/offline.ts`, `backend/index.ts`, `packages/validation/app/predial/units.ts`).

## Function Design

**Size:** Existe variacao alta; ha handlers longos com muitas responsabilidades (ex.: `backend/api/app/predial/tickets/index.ts`).

**Parameters:** Padrao forte de validacao de entrada com `zValidator` + schemas Zod em `@packages/validation/*`.

**Return Values:** APIs retornam `c.json(...)` com status apropriado; stores/composables retornam estado + acoes.

## Module Design

**Exports:**
- Padrao misto entre `default export` de app/router e `named exports` para schemas, tipos e utilitarios.

**Barrel Files:**
- Uso presente em alguns modulos por indice e agregacao (ex.: referencias por alias em `@packages/*`), mas nao universal.

## Qualidade Geral, Riscos e Melhorias

**Status atual:**
- Base com toolchain moderna e consistente para TS/ESLint/Vue.
- Convencoes de nome/import e validacao sao boas na maior parte do codigo.
- Fluxo de pre-commit ativo (`.husky/pre-commit` com `lint-staged`) e convencao de commit reforcada em `.husky/commit-msg`.

**Riscos:**
- Ausencia de configuracao explicita de Prettier na raiz pode gerar drift de formato entre ambientes.
- Arquivos de rota muito extensos (ex.: `backend/api/app/predial/tickets/index.ts`) aumentam risco de regressao.
- Regras ESLint permissivas para `any` e non-null assertion reduzem protecao de tipo.
- `allowJs: true` no backend (`tsconfig.backend.json`) pode enfraquecer consistencia de tipagem ao longo do tempo.

**Melhorias sugeridas:**
- Adicionar `prettier.config.*` na raiz com padrao oficial do projeto.
- Refatorar handlers extensos em casos de uso/servicos menores por responsabilidade.
- Reavaliar regras `no-explicit-any` e `no-non-null-assertion` para habilitacao gradual em modulos novos.
- Definir guideline unico para nome de paginas frontend (`PascalCase` ou `kebab-case`) e aplicar incrementalmente.
- Introduzir logging estruturado (nivel/contexto/correlation id) mantendo compatibilidade com `Hono`.

---

*Convention analysis: 2026-03-30*
