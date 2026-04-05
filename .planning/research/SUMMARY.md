# Project Research Summary

**Project:** Gestão Predial
**Domain:** Brownfield web app (Vue/Quasar + Hono/Bun) com foco em estabilização
**Researched:** 2026-03-30
**Confidence:** HIGH

## Executive Summary

O produto é um sistema de gestão predial já em operação, com arquitetura definida e stack madura. Para este ciclo, a estratégia correta é estabilização incremental: corrigir o acesso à rota `/login` e normalizar a renderização de ícones no sistema autenticado sem abrir frentes de refatoração estrutural.

A recomendação consolidada é manter integralmente a stack atual (Vue 3, Quasar, Vue Router, Pinia, Hono, Better Auth, Bun, PostgreSQL, Drizzle) e atuar por superfície funcional: primeiro autenticação/guardas, depois camada visual de ícones por módulo. Isso reduz risco de regressão transversal em rotas, sessão e UI.

Os riscos mais relevantes são loop de redirecionamento, decisão de navegação antes da hidratação da sessão e inconsistência de icon set/configuração. A mitigação é objetiva: guarda determinística com decisão única, espera explícita da restauração de sessão no boot, e padronização de ícones com fallback visual sem trocar provider global.

## Key Findings

### Stack a manter

Manter stack e versões atuais como baseline operacional:

- `Vue 3` + `Vue Router 4` + `Pinia` + `Quasar 2` + `Vite` + `TypeScript`
- `Hono` + `Better Auth` + `Bun`
- `PostgreSQL` + `Drizzle ORM`
- `Redis/BullMQ` sem alterações neste ciclo

Diretriz para ícones:
- manter `material-icons` como padrão Quasar;
- usar `mdi-v7` apenas quando necessário e com prefixo explícito;
- evitar expansão de `fontawesome` para não fragmentar convenções.

### Table stakes de v1

Itens mínimos para considerar o sistema estável no ciclo:

- Acesso direto em `/login` funcionando sem redirecionamento indevido.
- Sessão autenticada previsível (entrada, permanência e saída consistentes).
- Navegação autenticada confiável (rotas protegidas, menu e fluxo pós-login).
- Ícones renderizados corretamente nas áreas autenticadas (painel, admin, app predial).
- Feedback claro de acesso negado/permissões.

### Principais riscos e mitigação

1. **Loop de redirecionamento no guard**
   - Mitigar com regra explícita para `/login`, metadados de rota claros e decisão única por navegação.
2. **Sessão não hidratada antes da decisão do guard**
   - Mitigar aguardando restauração de sessão antes do primeiro redirect.
3. **Mistura de `next()` com retorno moderno**
   - Mitigar adotando um único estilo de guard (preferência por retorno).
4. **Icon set divergente entre config e uso**
   - Mitigar alinhando `extras`, `framework.iconSet` e nomenclatura dos ícones.
5. **Cobertura de validação insuficiente**
   - Mitigar com smoke por perfil e por módulo (painel/admin/app) incluindo acesso direto por URL.

## Implications for Roadmap

### Phase 1: Estabilização de acesso `/login`
**Rationale:** Dependência primária; sem login estável, nenhuma validação de área autenticada é confiável.  
**Delivers:** Guarda determinística, hidratação de sessão no momento correto e redirect seguro pós-login.  
**Addresses:** Table stakes de acesso, sessão e navegação básica.  
**Avoids:** Loop de redirect, falso negativo de autenticação, navegação ambígua.

### Phase 2: Normalização de ícones no sistema autenticado
**Rationale:** Após autenticação estável, corrigir UI por superfície reduz regressão e facilita validação.  
**Delivers:** Padrão único de resolução de ícones com fallback no painel, admin e app predial.  
**Addresses:** Table stake de legibilidade e execução operacional rápida.  
**Avoids:** Texto no lugar de ícone, inconsistência entre módulos, quebra por configuração.

### Phase 3: Validação integrada e hardening leve
**Rationale:** Consolidar correções com evidência de não regressão por perfil e fluxo completo.  
**Delivers:** Matriz de smoke (login/logout, rotas protegidas, ícones críticos) e checklist final.  
**Addresses:** Confiabilidade final de v1.  
**Avoids:** Fechamento prematuro com bug residual em perfil/módulo não testado.

### Ordem recomendada de execução

- Primeiro autenticação e roteamento (`/login`) por ser pré-requisito funcional.
- Depois ícones por áreas autenticadas (painel -> admin -> app predial), reutilizando o mesmo padrão.
- Por fim validação integrada por perfil, evitando regressões tardias.

### Research Flags

Fases que **podem seguir padrão conhecido** (sem pesquisa adicional extensa):
- **Phase 1:** padrões bem documentados de Vue Router guards.
- **Phase 2:** padrões consolidados de Quasar icon libraries/config.

Fase que **merece atenção de validação local**:
- **Phase 3:** depende de matriz real de perfis e rotas do projeto (risco operacional, não tecnológico).

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Baseada em stack já instalada e utilizada no projeto. |
| Features | HIGH | Alinhada ao objetivo explícito do ciclo (estabilização de login + ícones). |
| Architecture | HIGH | Estratégia incremental consistente com fronteiras atuais do monorepo. |
| Pitfalls | HIGH | Principais falhas mapeadas com documentação oficial e contexto brownfield. |

**Overall confidence:** HIGH

### Gaps to Address

- Confirmar lista completa de rotas públicas/autenticadas para evitar falso-positivo em redirects.
- Confirmar inventário de ícones críticos por módulo/perfil para smoke final.

## Sources

### Primary (HIGH confidence)
- `.planning/research/STACK.md`
- `.planning/research/FEATURES.md`
- `.planning/research/ARCHITECTURE.md`
- `.planning/research/PITFALLS.md`
- [Vue Router - Navigation Guards](https://router.vuejs.org/guide/advanced/navigation-guards)
- [Quasar - Installing Icon Libraries](https://quasar.dev/options/installing-icon-libraries)

---
*Research completed: 2026-03-30*  
*Ready for roadmap: yes*
