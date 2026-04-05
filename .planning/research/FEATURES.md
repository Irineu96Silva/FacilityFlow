# Feature Landscape

**Domain:** Sistema de gestao predial (brownfield em producao/desenvolvimento)
**Researched:** 2026-03-30

## Table Stakes

Features que usuarios esperam em qualquer sistema autenticado. Se falharem, a percepcao e de sistema quebrado.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Login acessivel por rota direta (`/login`) | Entrada no sistema deve funcionar por URL direta e fluxo guiado | Baixa | Requisito ativo no projeto; sem isso bloqueia uso |
| Sessao autenticada estavel (persistencia + expiracao previsivel) | Usuario espera permanecer logado com comportamento consistente | Media | Evitar mudancas de mecanismo; focar em correcoes de regressao |
| Navegacao autenticada consistente (menu, breadcrumbs, rotas protegidas) | Base de usabilidade para operacao diaria | Media | Inclui evitar redirecionamentos indevidos para landing |
| Visibilidade de acoes por icones (painel/admin/app predial) | Interface operacional depende de reconhecimento rapido visual | Baixa | Item ativo e transversal; priorizar cobertura de todos os perfis |
| Fallback visual seguro (icone ausente nao quebra acao) | Usuario precisa executar tarefa mesmo com falha de asset | Baixa | Mostrar label/tooltip de forma consistente sem degradar fluxo |
| Feedback de permissao/acesso negado claro | Em sistema com perfis, usuario espera entender o motivo de bloqueio | Media | Importante para reduzir chamados e evitar percepcao de erro tecnico |

## Differentiators

Recursos que aumentam valor no contexto predial, mas nao devem competir com a estabilizacao imediata.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Experiencia unificada entre painel, admin e app predial | Reduz curva de aprendizado e erros operacionais entre modulos | Media | Diferencial forte se mantiver padrao visual e navegacional comum |
| Governanca por perfil com acoes contextuais | Diminui risco operacional e melhora produtividade por tipo de usuario | Alta | Ja existe base; foco atual e preservar comportamento sem ampliar escopo |
| Operacao com alta legibilidade (icones + labels + hierarquia visual) | Aumenta velocidade de execucao em rotinas repetitivas | Media | Diferencial pratico em ambiente de uso intensivo |

## Anti-Features

Itens a evitar neste ciclo para nao aumentar risco de regressao.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Refatoracao ampla de roteamento/autenticacao | Alto risco em brownfield e fora do escopo de estabilidade | Corrigir somente regras pontuais de `/login` e guardas afetados |
| Troca de biblioteca/sistema de icones | Efeito cascata em multiplos modulos e risco visual alto | Normalizar mapeamentos e imports existentes com testes de regressao visual |
| Mudancas de UX nao relacionadas (novo layout, novo menu) | Scope creep e aumento de superficie de falha | Limitar ajustes a consistencia visual necessaria para a correcao |
| Novas features de produto no mesmo ciclo | Dispersa foco de correcoes criticas | Congelar backlog funcional e priorizar confiabilidade |
| Alteracao estrutural de autorizacao/perfis | Pode quebrar regras de negocio em producao | Preservar matriz atual e apenas corrigir exibicao/comportamento inconsistentes |

## Feature Dependencies

```
Rota /login correta -> Sessao autenticada previsivel -> Navegacao autenticada confiavel
Navegacao confiavel -> Visibilidade correta de acoes com icones -> Operacao rapida sem ambiguidade
Sessao + autorizacao estaveis -> Feedback claro de permissao -> Menor retrabalho de suporte
```

## MVP Recommendation

Priorizar:
1. Login acessivel por rota direta (`/login`) sem redirecionamento indevido
2. Navegacao autenticada consistente em todos os modulos principais
3. Renderizacao correta de icones no painel, admin e app predial para todos os perfis

Defer:
- Diferenciais de UX mais amplos (padroes visuais novos): adiar para fase dedicada apos estabilizacao
- Evolucao de governanca/permissoes: tratar em fase separada com validacao funcional completa

## Sources

- `.planning/PROJECT.md` (contexto oficial do ciclo atual: brownfield + foco em estabilidade)
