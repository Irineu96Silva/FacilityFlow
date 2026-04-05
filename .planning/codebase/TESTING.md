# Testing Patterns

**Analysis Date:** 2026-03-30

## Test Framework

**Runner:**
- Framework de teste automatizado dedicado (Vitest/Jest) nao detectado na raiz ativa do projeto.
- Config: `Not detected` para `vitest.config.*` e `jest.config.*` fora de `node_modules`.

**Assertion Library:**
- `Not detected` no escopo principal (`backend`, `frontend`, `packages`).

**Run Commands:**
```bash
bun run typecheck       # Validacao estatica de tipos
bun run lint            # Qualidade estatica (lint)
bun run lint:fix        # Auto-correcao de lint
```

## Test File Organization

**Location:**
- Nao ha padrao ativo de testes automatizados em `backend/`, `frontend/` e `packages/`.
- Arquivos de apoio e roteiros de validacao manual existem na raiz (ex.: `GUIA_TESTES.md`).

**Naming:**
- Para a raiz ativa, padrao de `*.test.*` / `*.spec.*` nao detectado nas pastas principais.

**Structure:**
```
Manual/UAT-oriented:
- `GUIA_TESTES.md` (roteiro funcional ponta a ponta)
- scripts utilitarios em `scripts/` para operacao e verificacao auxiliar
```

## Test Structure

**Suite Organization:**
```typescript
// Not applicable na base ativa: suites `describe/it/test` dedicadas
// nao foram detectadas em `backend/`, `frontend/` e `packages/`.
```

**Patterns:**
- **Setup pattern:** Ambiente preparado por `bun install`, `.env`, `docker-compose`, migracoes e seed conforme `GUIA_TESTES.md`.
- **Teardown pattern:** Nao formalizado em framework; orientado por operacao manual.
- **Assertion pattern:** Verificacao por comportamento esperado (UAT/checklists), nao por asserts automatizados.

## Mocking

**Framework:** `Not detected`.

**Patterns:**
```typescript
// Nao ha padrao de mocks automatizados no escopo principal.
// Integracoes sao exercitadas por fluxo real/manual descrito em `GUIA_TESTES.md`.
```

**What to Mock:**
- Sugestao para evolucao: SDKs externos (`openai`, `@aws-sdk/*`, `stripe`) em futuros testes unitarios/integracao.

**What NOT to Mock:**
- Regras centrais de dominio e validacoes Zod em `packages/validation/*` e fluxos de autorizacao em `backend/lib/predial/middleware/*`.

## Fixtures and Factories

**Test Data:**
```typescript
// Nao ha factories automatizadas detectadas.
// Dados base sao provisionados por scripts operacionais, ex.:
// `scripts/predial/seed.ts`, `scripts/auth/user/create.ts`.
```

**Location:**
- Seeds/scripts em `scripts/` e fluxos de banco em `scripts/db/`.

## Coverage

**Requirements:** Nenhuma meta de coverage automatizada detectada.

**View Coverage:**
```bash
Not applicable (framework/cobertura nao configurados)
```

## Test Types

**Unit Tests:**
- Estado atual: `Not detected` no escopo principal.

**Integration Tests:**
- Estado atual: majoritariamente manual, cobrindo integracao backend/frontend/infra via roteiro em `GUIA_TESTES.md`.

**E2E Tests:**
- Framework configurado nao detectado; dependencia `playwright` existe em `package.json`, mas sem `playwright.config.*` na raiz.

## Common Patterns

**Async Testing:**
```typescript
// Padrao atual orientado por execucao real e validacao funcional:
// 1) executar fluxo no app
// 2) observar efeito em API/UI/logs
// 3) validar checklist em `GUIA_TESTES.md`
```

**Error Testing:**
```typescript
// Validacao manual de cenarios de falha descritos em troubleshooting:
// ver secao "Troubleshooting" em `GUIA_TESTES.md`.
```

## Qualidade Atual, Riscos e Melhorias

**Status atual:**
- Estrategia dominante de qualidade = gate estatico (`typecheck` + `lint`) e validacao manual/UAT documentada.
- Roteiro funcional esta detalhado e cobre fluxos criticos (autenticacao, chamados, geofence, offline, billing) em `GUIA_TESTES.md`.

**Riscos:**
- Regressao silenciosa em regras de negocio sem cobertura automatizada.
- Alto custo manual para validacao de cada release.
- Dependencias externas e fluxos assicronos (fila, IA, notificacoes) sem testes deterministas.
- Refactors em arquivos grandes de rota podem quebrar casos de borda sem deteccao antecipada.

**Melhorias sugeridas:**
- Introduzir baseline de testes unitarios em `packages/validation/*` (alto retorno, baixo acoplamento).
- Criar testes de integracao HTTP para rotas criticas (`backend/api/app/predial/tickets/index.ts`, auth, permissions).
- Ativar suite E2E incremental com Playwright (login, criar chamado, atribuicao, fechamento).
- Adicionar comando dedicado de testes (`bun test` ou `vitest`) e incluir no pipeline de CI junto de `typecheck`/`lint`.
- Definir objetivo inicial de coverage por modulo critico (ex.: tickets, work orders, permissions).

---

*Testing analysis: 2026-03-30*
