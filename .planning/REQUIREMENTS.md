# Requirements: Gestao Predial - Estabilizacao de Acesso e UI

**Defined:** 2026-03-30
**Core Value:** Usuarios conseguem entrar no sistema pela rota de login e usar as telas autenticadas com interface legivel e consistente, sem regressao funcional.

## v1 Requirements

Requirements para este ciclo de correcao local, sem refatoracao estrutural.

### Authentication and Access

- [x] **AUTH-01**: Usuario consegue acessar `/login` diretamente sem ser redirecionado para a landing quando nao autenticado
- [x] **AUTH-02**: Usuario autenticado acessando `/login` e redirecionado para destino autenticado esperado, sem loop
- [x] **AUTH-03**: Guardas de rota preservam comportamento atual de rotas protegidas sem regressao em navegacao
- [x] **AUTH-04**: Sessao e restaurada no boot antes da decisao final de redirecionamento em rotas de entrada

### Icon Rendering - Authenticated Panel

- [ ] **UIPN-01**: Icones criticos do painel autenticado renderizam como icones (nao texto/tag)
- [ ] **UIPN-02**: Acoes principais do painel mantem legibilidade visual com icones consistentes

### Icon Rendering - Admin

- [ ] **UIAD-01**: Icones criticos da area admin renderizam como icones (nao texto/tag)
- [ ] **UIAD-02**: Menus e acoes administrativas usam padrao consistente de iconografia

### Icon Rendering - Predial App

- [ ] **UIPR-01**: Icones criticos do app predial renderizam como icones (nao texto/tag)
- [ ] **UIPR-02**: Fluxos operacionais do app predial mantem legibilidade de acoes com icones corretos

### Local Validation

- [ ] **VAL-01**: Smoke local confirma `/login`, login/logout e acesso a rotas protegidas para perfis relevantes
- [ ] **VAL-02**: Smoke local confirma renderizacao de icones em painel, admin e app predial sem regressao funcional

## v2 Requirements

Deferred para ciclo futuro.

### Hardening and Automation

- **AUTO-01**: Cobertura automatizada de smoke de navegacao/autenticacao em E2E
- **AUTO-02**: Auditoria automatica de icones invalidos/inexistentes no frontend

## Out of Scope

| Feature | Reason |
|---------|--------|
| Refatoracao ampla de arquitetura de auth/router | Fora do escopo de correcao pontual sem regressao |
| Mudanca de design system completo | Objetivo atual e estabilizacao visual, nao redesign |
| Homologacao em producao neste ciclo | Decisao explicita: validar apenas local por enquanto |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | Phase 1 | Complete |
| AUTH-02 | Phase 1 | Complete |
| AUTH-03 | Phase 1 | Complete |
| AUTH-04 | Phase 1 | Complete |
| UIPN-01 | Phase 2 | Pending |
| UIPN-02 | Phase 2 | Pending |
| UIAD-01 | Phase 2 | Pending |
| UIAD-02 | Phase 2 | Pending |
| UIPR-01 | Phase 2 | Pending |
| UIPR-02 | Phase 2 | Pending |
| VAL-01 | Phase 3 | Pending |
| VAL-02 | Phase 3 | Pending |

**Coverage:**
- v1 requirements: 12 total
- Mapped to phases: 12
- Unmapped: 0

---
*Requirements defined: 2026-03-30*
*Last updated: 2026-03-30 after initial definition*
