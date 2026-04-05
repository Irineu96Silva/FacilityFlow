# Phase 01: estabilizacao-de-acesso-e-guardas - Research

**Researched:** 2026-03-30  
**Domain:** Frontend auth routing (Vue Router + Better Auth + Pinia)  
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
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

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| AUTH-01 | Usuario consegue acessar `/login` diretamente sem ser redirecionado para a landing quando nao autenticado | Guard global deve liberar `authType: "unauthenticated"` sem fallback para landing; validar ordem e retorno no `beforeEach`. |
| AUTH-02 | Usuario autenticado acessando `/login` e redirecionado para destino autenticado esperado, sem loop | Guard deve redirecionar autenticado em `/login` para home por permissao (sem usar redirect de query em rotas de auth). |
| AUTH-03 | Guardas de rota preservam comportamento atual de rotas protegidas sem regressao em navegacao | Manter switch por `authType`; alterar apenas branch `unauthenticated` e manter branch `authenticated` intacto. |
| AUTH-04 | Sessao e restaurada no boot antes da decisao final de redirecionamento em rotas de entrada | Reaproveitar `authClient.getSession()` no guard e bloquear decisao final ate resolver sessao (await unico por navegacao). |
</phase_requirements>

## Summary

A base atual ja tem os blocos certos para estabilizar acesso: `router.beforeEach(createAuthGuard())`, metadado `authType` por rota e sessao via Better Auth (`getSession` + `useSession`). O risco principal nao e falta de infraestrutura; e decisao inconsistente entre guard global e pos-login na pagina de login.

Para esta fase, o caminho de menor risco e **corrigir somente pontos de decisao de navegacao**: manter `/login` acessivel para nao autenticado, redirecionar autenticado em `/login` para destino padrao por permissao e padronizar o pos-login para ignorar `redirect`. Isso atende AUTH-01..04 sem refatorar estrutura de router/store.

**Primary recommendation:** aplicar ajuste minimo no guard global e no pos-login da tela de login, preservando rotas protegidas e sem introduzir novo mecanismo de roteamento.

## Project Constraints (from .cursor/rules/)

- Usar Bun no fluxo local e, ao alterar codigo, executar obrigatoriamente: `bun run typecheck` -> `bun run lint:fix` -> `bun lint` -> `bun prettier`.
- Escopo desta fase: correcao pontual, sem refatoracao estrutural de auth/router.
- Frontend deve manter Vue 3 Composition API (`<script setup lang="ts">`) e aliases `@frontend/...`.
- Mensagens para usuario em pt-BR; padrao de tratamento de erro de auth com utilitarios existentes.
- Atualizar documentacao quando houver mudanca de comportamento/API relevante.
- Nyquist validation esta habilitado em `.planning/config.json`, portanto planejamento deve incluir arquitetura de validacao.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| vue-router | projeto: `4.6.4` / latest: `5.0.4` (2026-03-19) | Guard global, meta de rota e redirect | E a camada oficial para controle de navegacao no Vue e ja estrutura o app atual. |
| better-auth | projeto: `1.4.17` / latest: `1.5.6` (2026-03-23) | Sessao, login e estado de autenticacao | Ja e o provedor de auth em uso; evita hand-roll de sessao/cookies. |
| pinia | projeto: `3.0.4` / latest: `3.0.4` (2025-11-05) | Store reativa de auth (`useAuthStore`) | Estado de auth padrao do app e integrado ao fluxo atual. |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| quasar | projeto: `2.18.6` / latest: `2.19.2` (2026-03-26) | UI e notificacoes de login | Manter feedback de UX sem alterar logica de auth/guard. |
| vue | projeto: `3.5.27` | Runtime SPA | Base tecnica atual; sem necessidade de mudanca nesta fase. |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Guard unico com `meta.authType` | Guard per-route (`beforeEnter`) | Aumenta dispersao da logica e risco de regressao; nao recomendado para correcao pontual. |
| `authClient.getSession()` no guard | Hidratar auth em bootstrap global separado | Mais intrusivo e com maior risco de impacto transversal fora do escopo. |

**Installation:**
```bash
npm install vue-router better-auth pinia quasar
```

**Version verification:** validado com `npm view <package> version time --json` em 2026-03-30.

## Architecture Patterns

### Recommended Project Structure
```text
frontend/
├── router/
│   ├── index.ts                # aplica guard global
│   ├── core/auth.ts            # define /login e auth routes
│   └── guards/core/guard.ts    # decisao por authType
├── pages/auth/login.vue        # submit de login + destino pos-auth
└── stores/predial/auth.ts      # wrapper Better Auth
```

### Pattern 1: Guard global orientado por `meta.authType`
**What:** usar um unico `beforeEach` para decidir acesso por `public | authenticated | unauthenticated`.  
**When to use:** quando o objetivo e consistencia de regras sem espalhar auth checks.

**Example:**
```typescript
// Source: https://router.vuejs.org/guide/advanced/navigation-guards.html
router.beforeEach(async (to) => {
  if (!isAuthenticated && to.name !== "login") {
    return { name: "login" };
  }
});
```

### Pattern 2: Sessao confiavel antes da decisao de entrada
**What:** resolver sessao com `await authClient.getSession()` antes de decidir redirect no guard.  
**When to use:** rotas de entrada (`/login`, `/`, primeira navegacao do app).

**Example:**
```typescript
// Source: https://www.better-auth.com/docs/concepts/session-management
const { data: session } = await authClient.getSession();
const authenticated = !!session?.user;
```

### Anti-Patterns to Avoid
- **Misturar regra de destino em varios pontos sem prioridade clara:** causa comportamento intermitente e loop de redirect.
- **Redirecionar rota de login para landing por fallback generico:** quebra AUTH-01.
- **Alterar estrutura de router/store na fase 1:** aumenta risco e viola escopo de correcao pontual.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Validacao de redirect seguro | Parser custom inseguro de URL | `getSafeRedirect` existente | Ja bloqueia URL externa e paginas de auth; reduz risco de open redirect/loop. |
| Gerenciamento de sessao do cliente | Store manual de token/cookie | `authClient.getSession()` + `authClient.useSession()` | Better Auth ja resolve ciclo de sessao e consistencia de client/server. |
| Matriz de permissoes para pos-login | Novo motor de autorizacao | Mapeamento simples por role ja usado em `login.vue` | Menor mudanca com impacto controlado no escopo. |

**Key insight:** risco baixo aqui vem de **reuso de componentes existentes**, nao de introduzir nova abstração.

## Common Pitfalls

### Pitfall 1: Loop em rota de autenticacao
**What goes wrong:** autenticado entra em `/login`, guard redireciona para rota que volta a `/login` por regra colateral.  
**Why it happens:** destino pos-login e branch `unauthenticated` usam criterios diferentes.  
**How to avoid:** definir destino autenticado unico por permissao e reaproveitar no guard + pos-login.  
**Warning signs:** multiplas transicoes para `/login` no mesmo ciclo.

### Pitfall 2: Decisao antes de sessao estabilizar
**What goes wrong:** usuario autenticado e tratado como anonimo no boot.  
**Why it happens:** guard decide sem aguardar `getSession`.  
**How to avoid:** sempre `await getSession()` antes da decisao final.  
**Warning signs:** flicker entre `/login` e rota protegida na carga inicial.

### Pitfall 3: Regressao de rotas protegidas
**What goes wrong:** ajuste para `/login` quebra fluxo de `authType: "authenticated"`.  
**Why it happens:** alteracao ampla no switch do guard.  
**How to avoid:** limitar mudanca a branch `unauthenticated` e manter branch `authenticated` sem semantica nova.  
**Warning signs:** paginas privadas acessiveis sem login ou redirect inesperado.

## Code Examples

Verified patterns from official sources:

### Guard assíncrono retornando redirect (Vue Router)
```typescript
// Source: https://router.vuejs.org/guide/advanced/navigation-guards.html
router.beforeEach(async (to) => {
  const canAccess = await canUserAccess(to);
  if (!canAccess) return "/login";
});
```

### Sessao reativa e consulta pontual (Better Auth)
```typescript
// Source: https://www.better-auth.com/docs/concepts/client
const session = authClient.useSession();
const { data: freshSession } = await authClient.getSession();
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Varios guards/per-route sem contrato unico | Guard global com meta + retorno async | Vue Router 4+ consolidou esse padrao | Menos pontos de falha e menos loop de navegacao. |
| Sessao apenas em store local | Sessao via client auth oficial com hook + fetch | Better Auth 1.x | Coerencia maior entre estado reativo e sessao real no servidor. |

**Deprecated/outdated:**
- Uso extensivo de `next` com multiplas saidas no mesmo guard: suportado, mas mais propenso a erro de fluxo.

## Open Questions

1. **Qual rota "home padrao" final por permissao deve ser considerada canonica?**
   - What we know: `login.vue` ja tem mapeamento por `predialRole`.
   - What's unclear: se existe helper central reutilizavel para esse mapeamento fora da pagina.
   - Recommendation: manter mapeamento atual nesta fase e apenas extrair helper se aparecer duplicacao minima.

2. **Ha algum redirecionamento para landing fora do guard principal?**
   - What we know: `/login` esta em `authRoutes` com `authType: "unauthenticated"`.
   - What's unclear: alguma regra residual em outros guards/modulos nao listados.
   - Recommendation: na implementacao, validar com smoke de navegacao em toda entrada (`/`, `/login`, rota protegida direta).

## Environment Availability

Step 2.6: **SKIPPED** (fase de correcao de codigo/roteamento sem dependencia externa adicional alem do stack ja presente no projeto).

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Nenhum framework de teste ativo detectado para este app frontend (há apenas exemplos em outro subtree) |
| Config file | none — see Wave 0 |
| Quick run command | `bun run typecheck` |
| Full suite command | `bun run typecheck && bun run lint:fix && bun lint && bun prettier` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| AUTH-01 | `/login` abre para nao autenticado | smoke/manual | `bun run dev` + navegacao manual | ❌ Wave 0 |
| AUTH-02 | autenticado em `/login` vai para home sem loop | smoke/manual | `bun run dev` + login real local | ❌ Wave 0 |
| AUTH-03 | rotas protegidas sem regressao | smoke/manual | `bun run dev` + acesso direto a rota protegida | ❌ Wave 0 |
| AUTH-04 | sessao resolvida antes da decisao final | smoke/manual (com logs) | `bun run dev` + validacao de fluxo de boot | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `bun run typecheck`
- **Per wave merge:** `bun run typecheck && bun run lint:fix && bun lint`
- **Phase gate:** `bun run typecheck && bun run lint:fix && bun lint && bun prettier` + smoke local de auth

### Wave 0 Gaps
- [ ] `frontend/router/guards/core/guard.auth.spec.ts` — cobre AUTH-01/AUTH-02/AUTH-03
- [ ] `frontend/pages/auth/login.redirect.spec.ts` — cobre AUTH-04 e destino pos-login
- [ ] Configurar runner de testes frontend (Vitest) — atualmente inexistente neste app

## Sources

### Primary (HIGH confidence)
- Código local: `frontend/router/index.ts`, `frontend/router/guards/core/guard.ts`, `frontend/router/core/auth.ts`, `frontend/pages/auth/login.vue`, `frontend/stores/predial/auth.ts`, `frontend/lib/core/utils/redirect.ts` (fonte de verdade do comportamento atual)
- [Vue Router - Navigation Guards](https://router.vuejs.org/guide/advanced/navigation-guards.html) - contrato oficial de guard async/redirect
- [Better Auth - Client](https://www.better-auth.com/docs/concepts/client) - `useSession` e métodos do client
- [Better Auth - Session Management](https://www.better-auth.com/docs/concepts/session-management) - `getSession` e semantica de sessao

### Secondary (MEDIUM confidence)
- `npm view <pkg> version time --json` (registry npm) para validar versoes atuais/publicacao
- [Better Auth - Basic Usage](https://www.better-auth.com/docs/basic-usage) (referencia geral de fluxo)

### Tertiary (LOW confidence)
- Nenhuma dependencia critica mantida apenas em fonte terciaria.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - sustentado por dependencias instaladas + npm registry atual.
- Architecture: HIGH - padrao ja aplicado no codigo e confirmado por docs oficiais do Vue Router/Better Auth.
- Pitfalls: MEDIUM - parte observacional do comportamento atual, a confirmar no smoke local.

**Research date:** 2026-03-30  
**Valid until:** 2026-04-29
