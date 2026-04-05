# Architecture Patterns

**Domain:** Correcao brownfield de app web fullstack (Vue/Quasar + Hono + Bun), sem refatoracao estrutural
**Researched:** 2026-03-30

## Recommended Architecture

Arquitetura recomendada: **preservar a estrutura atual do monorepo e aplicar correcoes cirurgicas por camada**, com isolamento de risco por fronteiras ja existentes.

- **Frontend (Vue/Quasar SPA):** tratar o problema de navegacao em `login` no nivel de roteamento/guards e tratar icones no nivel de camada de apresentacao (componentes/layout), sem alterar contrato de dados.
- **Backend (Hono):** manter contratos de autenticacao e middleware como fonte unica de verdade para sessao/permissoes; nenhuma mudanca estrutural de API.
- **Packages compartilhados:** reutilizar tipos e utilitarios existentes para evitar divergencia entre frontend e backend.

## Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| Vue Router (public/auth routes) | Resolver acesso a rotas publicas/autenticadas e redirecionamentos | Auth store/session composable |
| Auth Store / Session Composable | Carregar estado de sessao e expor `isAuthenticated`/perfil | Backend `/api/auth/*` |
| Login Page | Renderizar formulario, disparar autenticacao e navegar para destino correto | Auth store + Router |
| App Shell (painel/admin/app predial) | Estrutura base de telas autenticadas e menus | Icon adapter + Router views |
| Icon Adapter (camada de UI) | Normalizar nomes/componentes de icones para um padrao unico | Componentes de menu/cards/botoes |
| Backend Auth Middleware (Hono) | Validar sessao, anexar contexto do usuario, autorizar acesso | Rotas `/api/*` |
| Backend Auth Endpoints | Login/logout/refresh/session check | Frontend auth store |

## Data Flow

Fluxo de baixo risco para navegacao/autenticacao:

1. Usuario acessa `/login` diretamente.
2. Router identifica rota publica e **nao redireciona para landing** por default.
3. Login page renderiza independentemente de sessao previa (exceto sessao valida ativa).
4. Ao autenticar com sucesso, frontend consulta/atualiza sessao via `/api/auth/*`.
5. Auth store marca sessao valida e redireciona para destino definido (`redirect` seguro ou rota padrao autenticada).
6. Guards de rotas autenticadas usam apenas estado de sessao; quando invalido, redirecionam para `/login`.

Fluxo de icones de baixo risco:

1. Componentes autenticados (painel/admin/app) continuam emitindo chave de icone existente.
2. Icon adapter converte chave legada/heterogenea para componente/fonte padronizada.
3. Render fallback explicito (icone default) quando chave for desconhecida.
4. Validacao visual por area/perfil sem mudar payload de API.

## Patterns to Follow

### Pattern 1: Guard deterministico por estado de sessao
**What:** Guard decide apenas com base em metadados de rota (`public`/`auth`) + sessao atual.
**When:** Em toda navegacao inicial e troca de rota.
**Example:**
```typescript
router.beforeEach(async (to) => {
  const session = await authStore.ensureSession();
  const isAuthRoute = to.meta.requiresAuth === true;
  const isPublicOnly = to.meta.publicOnly === true;

  if (isAuthRoute && !session.isAuthenticated) {
    return { path: "/login", query: { redirect: to.fullPath } };
  }

  if (isPublicOnly && session.isAuthenticated) {
    return { path: "/app" };
  }

  return true;
});
```

### Pattern 2: Adapter de icones sem quebrar chamadas existentes
**What:** Introduzir uma funcao/componente unico para resolver icones.
**When:** Em menus, cards e acoes do painel/admin/app predial.
**Example:**
```typescript
export function resolveIcon(name: string): string {
  const map: Record<string, string> = {
    "home": "i-tabler-home",
    "settings": "i-tabler-settings",
    "user": "i-tabler-user",
  };

  return map[name] ?? "i-tabler-circle";
}
```

### Pattern 3: Mudancas por superficie (surface-by-surface)
**What:** Corrigir por area funcional isolada (login, painel, admin, app).
**When:** Em brownfield com risco de regressao e prazo curto.
**Example:**
1. Corrigir `/login` + guard.
2. Corrigir icones do painel.
3. Corrigir icones do admin.
4. Corrigir icones do app predial.

## Anti-Patterns to Avoid

### Anti-Pattern 1: Refatoracao ampla de auth/router
**What:** Reescrever fluxo completo de autenticacao/roteamento.
**Why bad:** Alto risco de regressao transversal em todas as rotas.
**Instead:** Ajustes localizados em regras de guard e condicoes de redirect.

### Anti-Pattern 2: Trocar biblioteca/fonte de icones no ciclo de correcao
**What:** Migracao total de provider de icones durante bugfix.
**Why bad:** Amplia escopo e impacto visual sem necessidade.
**Instead:** Padronizacao via adapter e aliases mantendo stack atual.

### Anti-Pattern 3: Misturar mudanca de contrato API com bug visual
**What:** Alterar payload/backend para resolver renderizacao de icones.
**Why bad:** Introduz risco de quebra de integracao sem ganho direto.
**Instead:** Resolver no frontend com mapeamento e fallback.

## Scalability Considerations

| Concern | At 100 users | At 10K users | At 1M users |
|---------|--------------|--------------|-------------|
| Guards de rota | Avaliacao local de sessao, custo baixo | Caching de sessao no cliente e refresh controlado | Estrategia robusta de expiracao/refresh para reduzir churn |
| Auth endpoints | Trafego moderado | Rate limit + observabilidade de login falho | Distribuicao/otimizacao de sessao em camada auth |
| Renderizacao de icones | Mapeamento estatico simples | Catalogo central de aliases por modulo | Governanca de design tokens e lint de icones |
| Regressao em brownfield | Testes manuais por area | Checklist de smoke por perfil/area | Automacao E2E de fluxo de login e telas criticas |

## Ordem de Implementacao Sugerida (Minimizar Regressao)

1. **Baseline e reproducoes**: documentar casos falhos atuais (`/login`, painel, admin, app predial) por perfil.
2. **Correcao do `/login`**: ajustar apenas guard/redirect e validar navegacao direta + sessao ativa/inativa.
3. **Padronizacao de icones no painel**: aplicar adapter em area menor/mais visivel para validar abordagem.
4. **Padronizacao de icones no admin**: reaplicar padrao sem alterar contratos.
5. **Padronizacao de icones no app predial**: cobrir ultima superficie autenticada.
6. **Smoke final integrado**: fluxo login -> navegacao principal -> verificacao visual por perfil.

## Sources

- Projeto local: `.planning/PROJECT.md` (fonte primaria do escopo e restricoes)
- Padrões de arquitetura brownfield incremental (conhecimento consolidado de engenharia; sem alteracao estrutural)
