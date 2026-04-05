# Phase 1: Estabilizacao de Acesso e Guardas - Context

**Gathered:** 2026-03-30
**Status:** Ready for planning

<domain>
## Phase Boundary

Esta fase entrega a estabilizacao do fluxo de autenticacao na entrada do sistema:
- acesso previsivel a `/login` para usuario nao autenticado;
- redirecionamento correto sem loop;
- preservacao das regras de rotas protegidas ja existentes;
- decisao de navegacao somente apos estado de sessao confiavel.

Nao inclui novos recursos de produto nem mudancas estruturais de arquitetura.

</domain>

<decisions>
## Implementation Decisions

### Fluxo de entrada em `/login`
- **D-01:** A rota `/login` deve abrir a tela de login existente (nao redirecionar para landing).
- **D-02:** A causa do desvio de rota deve ser investigada e corrigida no fluxo de guard/roteamento, sem alterar escopo de produto.

### Comportamento para usuario autenticado
- **D-03:** Se usuario ja autenticado acessar `/login` manualmente, deve ser redirecionado para o dashboard/home padrao conforme permissao.

### Comportamento apos autenticacao
- **D-04:** Apos login com sucesso, o sistema deve ir sempre para dashboard/home padrao por permissao, ignorando parametro `redirect`.

### Restricoes de execucao
- **D-05:** Correcao pontual apenas em rota/guardas, sem refatoracao estrutural.
- **D-06:** Validacao desta fase sera somente em ambiente local.

### Claude's Discretion
- Definir a menor alteracao tecnica possivel para garantir o comportamento decidido acima.
- Escolher o ponto exato de ajuste entre guard global e fluxo de pos-login, desde que mantenha os requisitos AUTH-01..AUTH-04.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Planejamento da fase
- `.planning/ROADMAP.md` — objetivo, requisitos e criterios de sucesso da Fase 1
- `.planning/REQUIREMENTS.md` — REQ-IDs da fase (`AUTH-01`, `AUTH-02`, `AUTH-03`, `AUTH-04`)
- `.planning/PROJECT.md` — limites de escopo e restricoes (sem refatoracao estrutural)
- `.planning/STATE.md` — estado atual do ciclo e continuidade

### Roteamento e guardas frontend
- `frontend/router/index.ts` — composicao de rotas e aplicacao do guard global
- `frontend/router/guards/core/guard.ts` — logica de decisao por `authType`
- `frontend/router/core/auth.ts` — definicao da rota `/login` e rotas de autenticacao
- `frontend/lib/core/utils/redirect.ts` — utilitario de sanitizacao e fallback de redirect

### Tela e fluxo de login
- `frontend/pages/auth/login.vue` — pagina de login existente e redirecionamento pos-autenticacao
- `frontend/stores/predial/auth.ts` — login/logout e leitura de sessao no frontend

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `createAuthGuard` em `frontend/router/guards/core/guard.ts`: ja centraliza decisao de acesso por `meta.authType`.
- `getSafeRedirect` em `frontend/lib/core/utils/redirect.ts`: ja valida redirect interno seguro.
- `useAuthStore` em `frontend/stores/predial/auth.ts`: encapsula login e sessao via Better Auth.

### Established Patterns
- Guarda global aplicada em `router.beforeEach(...)` para todas as rotas.
- Rota `/login` marcada como `authType: "unauthenticated"`.
- Pos-login atual decide destino por `predialRole` diretamente na pagina de login.

### Integration Points
- Ajuste principal deve ocorrer na interseccao entre:
  - regra `authType: "unauthenticated"` do guard global;
  - comportamento de redirect na pagina `login.vue`;
  - estado de sessao retornado por `authClient.getSession()` e `authClient.useSession()`.

</code_context>

<specifics>
## Specific Ideas

- Restaurar comportamento esperado da rota `/login` sem mexer em design/system-wide.
- Manter entrada no sistema somente apos autenticacao bem-sucedida.
- Preservar roteamento por permissao no destino final (dashboard/home do perfil).

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 01-estabilizacao-de-acesso-e-guardas*
*Context gathered: 2026-03-30*
