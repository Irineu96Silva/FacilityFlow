# Technology Stack

**Project:** Gestão Predial (brownfield, estabilização sem refatoração estrutural)
**Researched:** 2026-03-30

## Recommended Stack

### Core Framework
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Vue | `^3.5.x` | SPA frontend | Já está em produção no repositório, madura para manutenção incremental, sem custo de migração. |
| Vue Router | `^4.6.x` | Roteamento público/autenticado | Compatível com guardas atuais (`beforeEach`) e fluxo de `/login` já modelado em `frontend/router/core/auth.ts`. |
| Pinia | `^3.0.x` | Estado de sessão/UI | Stack oficial do Vue moderno e já integrada no bootstrap (`frontend/main.ts`). |
| Quasar | `^2.18.x` | UI system (layout, componentes, icon API) | Base visual existente; migrar framework agora elevaria risco de regressão em telas autenticadas. |
| Vite | `^7.x` | Build/dev frontend | Toolchain já estável no projeto com startup rápido e integração direta com Vue/TS. |
| TypeScript | `~5.9.x` | Segurança de tipos | Essencial para mudanças localizadas em autenticação e navegação sem regressão silenciosa. |

### Backend/API
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Hono | `^4.11.x` | API HTTP e middleware | Já é o núcleo da API atual e suporta evolução incremental sem remodelagem de rotas. |
| Better Auth | `^1.4.x` | Autenticação/sessão | Já adotado no monorepo; trocar auth provider neste ciclo aumenta risco funcional e de segurança. |
| Bun | `^1.3.x` | Runtime e scripts do monorepo | Base operacional atual (scripts, dev server, tarefas), reduzindo fricção de manutenção. |

### Database & Infra
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| PostgreSQL | `3.x client (postgres)` | Persistência transacional | Banco já integrado no backend e nos módulos de negócio; estabilidade > inovação neste ciclo. |
| Drizzle ORM | `^0.44.x` | Acesso tipado ao banco | Já consolidado no projeto, com migrações/scripts existentes. |
| Redis + BullMQ | `ioredis ^5.x / bullmq ^5.x` | filas/cache assíncrono | Manter como está; não mexer na infraestrutura paralela enquanto foco é login/ícones. |

### UI Icons (foco do problema atual)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@quasar/extras/material-icons` | `^1.17.x` | Set padrão Quasar (`iconSet: material-icons`) | Usar como padrão para componentes Quasar e ícones de layout base. |
| `@quasar/extras/mdi-v7` | `^1.17.x` | Ícones adicionais de domínio | Usar somente quando não houver equivalente claro no Material Icons. |
| `@quasar/extras/fontawesome-v6` | `^1.17.x` | Casos legados específicos | Manter apenas onde já existe dependência explícita; evitar expandir uso para não fragmentar convenções. |

## O que manter, o que evitar (2026, contexto brownfield)

| Category | Maintain | Avoid | Why |
|----------|----------|-------|-----|
| Frontend base | Vue 3 + Quasar + Vite + TS atuais | Migrar para outro framework UI ou SSR neste ciclo | Não resolve o bug alvo e aumenta superfície de regressão. |
| Auth | Better Auth + guardas existentes | Trocar engine de auth/JWT/session strategy agora | Alto risco em fluxo crítico de login e sessão autenticada. |
| Router | Estrutura atual com `meta.authType` e guarda única | Reescrever árvore de rotas inteira | Problema é pontual em `/login`; solução deve ser localizada. |
| Ícones | Consolidar convenção de prefixo/set por módulo | Misturar livremente `mdi`, `fa`, `material` sem padrão | Causa exatamente o sintoma atual: texto/tag no lugar de ícone. |
| Runtime | Bun e scripts existentes | Migração para outro package manager/runtime neste momento | Não agrega valor ao objetivo de estabilização imediata. |

## Riscos técnicos de mudanças (auth/roteamento/UI)

### 1) Autenticação (`/login`)
- **Risco:** loop de redirecionamento ou fallback indevido para landing por conflito entre guarda global e `authType` da rota.
- **Onde aparece no código:** `frontend/router/index.ts`, `frontend/router/core/auth.ts`, `frontend/lib/core/utils/redirect.ts`.
- **Impacto:** bloqueio de acesso ao sistema para usuários válidos.
- **Mitigação de baixo risco:** alterar apenas condição da guarda para permitir explicitamente rota `name: "login"` quando não autenticado; manter fallback atual para demais rotas.

### 2) Roteamento pós-login
- **Risco:** `redirect` query inválido ou bloqueado por sanitização excessiva, enviando usuário para rota inesperada.
- **Onde aparece no código:** `getSafeRedirect` em `frontend/lib/core/utils/redirect.ts`.
- **Impacto:** experiência inconsistente após autenticação (entra e cai em tela errada).
- **Mitigação de baixo risco:** preservar validação de segurança (bloquear externo), mas ajustar whitelist/lista de auth pages somente se houver falso-positivo confirmado.

### 3) UI de ícones no sistema autenticado
- **Risco:** ícone renderizado como texto por prefixo incompatível com set carregado (`mdi:`, `fa-`, `o_`, etc.) ou dependência CSS não carregada.
- **Onde aparece no código:** bootstrap de estilos em `frontend/main.ts` + componentes de `frontend/layouts` e `frontend/pages/(admin|app)`.
- **Impacto:** perda de legibilidade e sinais de ação em menus e botões.
- **Mitigação de baixo risco:** padronizar convenção de ícones por módulo e substituir apenas strings inválidas; não trocar `iconSet` global neste ciclo.

## Recomendações práticas de baixo risco

1. **Manter baseline atual**: não atualizar major versions de Vue/Quasar/Hono/Better Auth durante correção de `/login` e ícones.
2. **Corrigir por menor dif possível**: ajuste pontual em guarda/redirect sem reestruturação de rotas.
3. **Padronizar ícones por regra simples**:
   - padrão Quasar: Material Icons;
   - MDI/FA apenas com prefixo explícito e quando necessário.
4. **Checklist de validação local antes de fechar tarefa**:
   - acesso direto em `/login`;
   - login/logout em perfil comum e admin;
   - navegação para `admin` e `app/predial`;
   - telas com menus, botões e tabelas exibindo ícones esperados.
5. **Não expandir escopo**: adiar refactor de layout/auth store para fase dedicada de hardening.

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| UI framework | Quasar 2 atual | Migração para outro sistema de componentes | Alto custo/risco para bugfix curto. |
| Auth stack | Better Auth atual | Reimplementar auth com solução custom | Aumenta risco de segurança e regressão sem benefício imediato. |
| Router flow | Guardas atuais com ajuste local | Redesenho completo de navegação | Desalinhado ao objetivo de estabilização. |

## Installation

```bash
# Manter stack atual (sem upgrades estruturais neste ciclo)
bun install

# Validação obrigatória após ajustes
bun run typecheck
bun run lint:fix
bun lint
bun prettier
```

## Sources

- Contexto e escopo do projeto: `.planning/PROJECT.md`
- Stack e versões reais do repositório: `package.json`
- Roteamento/autenticação atual:
  - `frontend/router/index.ts`
  - `frontend/router/core/auth.ts`
  - `frontend/lib/core/utils/redirect.ts`
- Configuração de ícones/UI bootstrap: `frontend/main.ts`
- Referências externas (suporte, confiança MEDIUM/LOW para tendência 2026):
  - [Vue docs - TypeScript](https://vuejs.org/guide/typescript/overview.html) (MEDIUM)
  - [Quasar docs - Icon Sets](https://v2.quasar.dev/options/quasar-icon-sets) (MEDIUM)
  - [Hono docs - Middleware](https://hono.dev/docs/) (MEDIUM)
