# Gestao Predial - Estabilizacao de Acesso e UI

## What This Is

Plataforma web de gestao predial para operacao de condominios e edificios, com frontend em Vue/Quasar e backend em Hono. O foco desta iniciativa e estabilizar comportamentos quebrados sem alterar arquitetura: corrigir acesso a rota de login e normalizar renderizacao de icones no sistema autenticado.

## Core Value

Usuarios conseguem entrar no sistema pela rota de login e usar as telas autenticadas com interface legivel e consistente, sem regressao funcional.

## Requirements

### Validated

- ✓ API modular com autenticacao e autorizacao por middleware em Hono - existente
- ✓ Frontend SPA com roteamento entre areas publicas e autenticadas - existente
- ✓ Modulo predial operacional com telas de app para usuarios internos - existente
- ✓ Area administrativa ativa com componentes e fluxos de manutencao - existente
- ✓ Integracao de estado e dados via backend `/api/*` com persistencia em PostgreSQL - existente

### Active

- [ ] Corrigir acesso direto a `/login` para impedir redirecionamento indevido para a landing page
- [ ] Garantir renderizacao correta de icones no painel autenticado para todos os perfis de usuario
- [ ] Garantir renderizacao correta de icones no admin para todos os perfis de usuario
- [ ] Garantir renderizacao correta de icones no app predial para todos os perfis de usuario
- [ ] Validar em ambiente local que as correcoes visuais e de rota nao introduzem quebra de comportamento existente

### Out of Scope

- Refatoracao estrutural de arquitetura frontend/backend - fora do objetivo atual de correcao
- Mudancas de produto/feature novas alem de rota de acesso e icones - evitar scope creep
- Homologacao em ambiente de producao neste ciclo - decisao atual e validar apenas local

## Context

Codebase brownfield em monorepo com `frontend/`, `backend/` e `packages/`, ja mapeada em `.planning/codebase/`. Ha historico recente de migracao de icones no frontend, mas ainda existem telas autenticadas exibindo tags/textos no lugar dos icones esperados. O problema de navegacao reportado e que acessar `/login` retorna para a landing, impedindo entrada pelo fluxo esperado.

## Constraints

- **Scope**: Somente correcoes de rota e visual - sem refatoracao estrutural
- **Safety**: Nao quebrar fluxos existentes do sistema - preservar comportamento funcional atual
- **Validation**: Verificacao obrigatoria apenas em ambiente local neste momento
- **Stack**: Manter stack atual (Vue/Quasar/Hono/Bun) e padroes do repositorio

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Corrigir primeiro a rota `/login` | Bloqueia acesso ao sistema e tem maior impacto funcional imediato | — Pending |
| Tratar icones depois da rota, cobrindo painel/admin/app predial | Problema visual abrangente em usuarios autenticados, mas sem bloquear acesso | — Pending |
| Limitar mudancas a correcoes pontuais | Objetivo explicito de estabilidade sem risco de regressao por refatoracao | — Pending |
| Validar apenas local por enquanto | Decisao atual de execucao para acelerar ciclo de correcao inicial | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? -> Move to Out of Scope with reason
2. Requirements validated? -> Move to Validated with phase reference
3. New requirements emerged? -> Add to Active
4. Decisions to log? -> Add to Key Decisions
5. "What This Is" still accurate? -> Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check - still the right priority?
3. Audit Out of Scope - reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-03-30 after initialization*
