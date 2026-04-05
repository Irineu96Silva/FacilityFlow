# Domain Pitfalls

**Domain:** Correcao pontual de autenticacao de rota e biblioteca de icones em Vue/Quasar brownfield
**Researched:** 2026-03-30
**Escopo:** Fix pontual sem refatoracao estrutural

## Critical Pitfalls

### Pitfall 1: Loop de redirecionamento no guard de autenticacao
**O que da errado:** acesso a `/login` ou rotas protegidas entra em loop entre landing, login e area autenticada.
**Sinais de alerta:**
- URL alterna rapidamente entre rotas (`/`, `/login`, `/dashboard`).
- Historico do navegador cresce com varios redirects em segundos.
- Usuario autenticado cai em login, e nao autenticado cai em landing sem conseguir entrar.
**Prevencao pratica:**
- No guard global, sempre tratar excecao explicita para a rota de login (ex.: nao redirecionar se destino ja e login).
- Usar sintaxe de retorno do Vue Router (`return { name: 'Login' }`) e evitar mistura parcial com `next()`.
- Centralizar regra minima em `meta.requiresAuth` para nao espalhar condicao em multiplos guards.
**Em qual fase tratar:** Fase 1 - Correcao de acesso da rota `/login`.
**Fonte/Confianca:** Vue Router Navigation Guards (oficial) - **HIGH**.

### Pitfall 2: Estado de autenticacao nao hidratado antes da navegacao
**O que da errado:** guard executa antes de restaurar sessao/token (store/cookie), gerando falso negativo de autenticacao.
**Sinais de alerta:**
- Hard refresh em rota protegida redireciona para login, mas F5 novamente "corrige".
- Comportamento diferente entre navegacao interna SPA e acesso direto por URL.
- Flash de tela publica antes de entrar na area autenticada.
**Prevencao pratica:**
- Garantir bootstrap sincrono/minimo de auth antes de `router.isReady()` ou antes do primeiro guard decisorio.
- Em guard async, aguardar explicitamente a rotina de restauracao de sessao antes de decidir redirect.
- Registrar telemetria/log simples de "auth hydrated" para diagnostico rapido em brownfield.
**Em qual fase tratar:** Fase 1 - Correcao de acesso da rota `/login`.
**Fonte/Confianca:** Vue Router docs + padrao recorrente de comunidade - **MEDIUM**.

### Pitfall 3: Misturar `next()` legado com retorno moderno no mesmo fluxo
**O que da errado:** navegacao fica inconsistente por chamada dupla ou caminhos sobrepostos; em alguns casos o hook nao resolve.
**Sinais de alerta:**
- Warnings de navegacao no console.
- Rotas que "travam" ou finalizam em pagina inesperada.
- Branches condicionais com `next(...)` e `return ...` coexistindo.
**Prevencao pratica:**
- Escolher um unico estilo por guard (preferencia: estilo moderno por retorno).
- Se houver `next()`, garantir chamada unica em todos os caminhos logicos sem sobreposicao.
- Aplicar checklist rapido em PR: "cada guard decide uma vez".
**Em qual fase tratar:** Fase 1 - Correcao de acesso da rota `/login`.
**Fonte/Confianca:** Vue Router Navigation Guards (oficial) - **HIGH**.

### Pitfall 4: Biblioteca de icones instalada, mas set nao declarado corretamente no Quasar
**O que da errado:** componentes Quasar e `QIcon` exibem texto cru ou glifos ausentes no painel autenticado.
**Sinais de alerta:**
- Renderiza nome da classe do icone (ex.: `mdi-home`) no lugar do desenho.
- Somente alguns modulos (admin/app) quebram por bundle/config divergente.
- Erros de fonte/asset 404 no DevTools.
**Prevencao pratica:**
- Declarar explicitamente `extras` no `quasar.config` para webfonts usados.
- Definir `framework.iconSet` coerente com o pacote realmente instalado.
- Evitar "mistura invisivel" (ex.: usar nomes MDI com set ativo Material Icons).
**Em qual fase tratar:** Fase 2 - Normalizacao de icones em painel/admin/app predial.
**Fonte/Confianca:** Quasar Installing Icon Libraries (oficial) - **HIGH**.

## Moderate Pitfalls

### Pitfall 5: Dependencia de CDN para webfont em ambiente autenticado
**O que da errado:** em rede restrita/offline parcial, icones somem em telas internas.
**Sinais de alerta:**
- Funciona localmente com internet, falha em rede corporativa/instavel.
- Layout interno perde affordance (botoes sem icone) sem erro de negocio.
**Prevencao pratica:**
- Em brownfield corporativo, priorizar pacote local via `@quasar/extras` em vez de CDN.
- Validar icones com throttling/offline no browser.
**Em qual fase tratar:** Fase 2 - Normalizacao de icones.
**Fonte/Confianca:** Quasar docs (recomendacao para mobile/Electron e configuracao local) - **MEDIUM**.

### Pitfall 6: Troca de icon set sem mapear icones padrao do Quasar
**O que da errado:** icones internos de componentes (close, sort, dropdown) ficam inconsistentes ou ausentes.
**Sinais de alerta:**
- `QTable`, `QSelect`, `QChip` e `QBtnDropdown` com icones faltando.
- Regressao visual apos migracao de set (ex.: FontAwesome/MDI).
**Prevencao pratica:**
- Revisar compatibilidade do set escolhido com icon names usados no projeto.
- Quando necessario, sobrescrever icones especificos do set em boot/config de forma pontual.
- Executar smoke visual em componentes base do Quasar apos ajuste.
**Em qual fase tratar:** Fase 2 - Normalizacao de icones.
**Fonte/Confianca:** Quasar docs + issues publicas de migracao de icon set - **MEDIUM**.

## Minor Pitfalls

### Pitfall 7: Validacao incompleta (testar apenas um perfil/uma area)
**O que da errado:** fix parece correto no dashboard principal, mas falha no admin ou app predial por permissao/layout diferente.
**Sinais de alerta:**
- Bug "reaparece" somente para perfil especifico.
- Ticket fechado e reaberto por area nao validada.
**Prevencao pratica:**
- Definir matriz minima de smoke local: perfil interno, admin e operador predial.
- Testar acesso direto por URL para `/login` e para ao menos uma rota protegida por modulo.
- Incluir checklist visual curto de icones criticos por area.
**Em qual fase tratar:** Fase 3 - Validacao local final sem regressao.
**Fonte/Confianca:** Evidencia operacional de brownfield + contexto do projeto - **MEDIUM**.

## Phase-Specific Warnings

| Fase | Likely Pitfall | Mitigacao |
|------|----------------|-----------|
| Fase 1 - Rota `/login` | Loop de redirecionamento e guard ambigua | Guard unico, excecao explicita para login, decisao unica por navegacao |
| Fase 1 - Rota `/login` | Auth nao hidratada no primeiro acesso | Aguardar restauracao de sessao antes de decidir redirect |
| Fase 2 - Icones painel/admin/app | Set de icones divergente entre config e uso real | Alinhar `extras`, `framework.iconSet` e nomenclatura dos icones |
| Fase 2 - Icones painel/admin/app | Dependencia de CDN em contexto restrito | Preferir assets locais e validar com simulacao offline |
| Fase 3 - Validacao local | Cobertura insuficiente por perfil/modulo | Matriz de smoke por perfil e area antes de encerrar |

## Sources

- Vue Router - Navigation Guards: https://router.vuejs.org/guide/advanced/navigation-guards
- Quasar - Installing Icon Libraries: https://quasar.dev/options/installing-icon-libraries
- Quasar - QIcon (referencia complementar): https://quasar.dev/vue-components/icon
- Quasar issue (icones ausentes ao remover webfonts): https://github.com/quasarframework/quasar/issues/17247
