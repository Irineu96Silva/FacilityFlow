# ROADMAP - Gestao Predial (Estabilizacao Brownfield)

## Phases

- [x] **Phase 1: Estabilizacao de Acesso e Guardas** - Corrigir `/login` e consolidar decisao de redirecionamento com sessao hidratada
- [ ] **Phase 2: Normalizacao de Iconografia nas Areas Autenticadas** - Padronizar renderizacao de icones no painel, admin e app predial
- [ ] **Phase 3: Validacao Integrada de Nao Regressao Local** - Validar fluxo de acesso e consistencia visual por perfil em ambiente local

## Phase Details

### Phase 1: Estabilizacao de Acesso e Guardas
**Goal**: Usuarios acessam `/login` de forma previsivel, com redirecionamento correto e sem loop, preservando rotas protegidas.
**Depends on**: Nothing (first phase)
**Requirements**: AUTH-01, AUTH-02, AUTH-03, AUTH-04
**Success Criteria** (what must be TRUE):
  1. Usuario nao autenticado acessa `/login` diretamente e permanece no fluxo de login sem voltar para a landing.
  2. Usuario autenticado que acessa `/login` e encaminhado para destino autenticado esperado sem loop de navegacao.
  3. Navegacao para rotas protegidas continua bloqueando acesso indevido e mantendo comportamento atual para usuarios validos.
  4. Decisao de redirecionamento em rotas de entrada ocorre somente apos restauracao de sessao no boot.
**Plans**: 2 plans
Plans:
- [x] 01-01-PLAN.md — Corrigir guard de `/login` e padronizar redirecionamento pós-login por permissão
- [x] 01-02-PLAN.md — Consolidar validação local e gate de não regressão para AUTH-01..AUTH-04

### Phase 2: Normalizacao de Iconografia nas Areas Autenticadas
**Goal**: Usuarios visualizam icones corretos e consistentes nas interfaces autenticadas, sem texto/tag no lugar de icones.
**Depends on**: Phase 1
**Requirements**: UIPN-01, UIPN-02, UIAD-01, UIAD-02, UIPR-01, UIPR-02
**Success Criteria** (what must be TRUE):
  1. Itens criticos do painel autenticado exibem icones corretos e legiveis para os perfis relevantes.
  2. Menus e acoes da area admin exibem iconografia consistente com o padrao definido da aplicacao.
  3. Fluxos operacionais do app predial exibem icones corretos, preservando legibilidade de acoes.
  4. Nenhuma tela coberta neste ciclo mostra texto/tag no lugar de icone esperado nas acoes criticas.
**Plans**: TBD
**UI hint**: yes

### Phase 3: Validacao Integrada de Nao Regressao Local
**Goal**: Correcao de acesso e iconografia e validada localmente para perfis relevantes sem introduzir quebra funcional.
**Depends on**: Phase 2
**Requirements**: VAL-01, VAL-02
**Success Criteria** (what must be TRUE):
  1. Smoke local comprova fluxo completo de `/login`, login/logout e acesso a rotas protegidas para perfis relevantes.
  2. Smoke local comprova renderizacao correta de icones no painel, admin e app predial para os cenarios criticos.
  3. Fluxos existentes continuam funcionando apos as correcoes, sem regressao funcional observavel no escopo v1.
**Plans**: TBD
**UI hint**: yes

## Progress Table

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Estabilizacao de Acesso e Guardas | 2/2 | Complete | 2026-03-30 |
| 2. Normalizacao de Iconografia nas Areas Autenticadas | 0/1 | Not started | - |
| 3. Validacao Integrada de Nao Regressao Local | 0/1 | Not started | - |

