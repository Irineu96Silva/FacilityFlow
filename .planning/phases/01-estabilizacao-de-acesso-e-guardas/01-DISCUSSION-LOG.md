# Phase 1: Estabilizacao de Acesso e Guardas - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-30
**Phase:** 1-estabilizacao-de-acesso-e-guardas
**Areas discussed:** Destino pos-login e comportamento de entrada em `/login`

---

## Destino pos-login e acesso a /login

| Option | Description | Selected |
|--------|-------------|----------|
| Usuario autenticado acessando `/login` redireciona para dashboard/home padrao por permissao | Evita permanencia em tela de login com sessao valida | ✓ |
| Usuario autenticado acessando `/login` permanece na tela de login | Forca nova interacao de autenticar mesmo com sessao ativa | |
| Comportamento customizado por contexto | Regras especiais por origem/rota | |

**User's choice:** Opcao A (redirecionar para dashboard/home padrao por permissao).
**Notes:** Usuario confirmou que a rota e tela de login existem e devem ser restabelecidas; comportamento atual de voltar para landing esta incorreto.

---

## Pos-autenticacao com parametro redirect

| Option | Description | Selected |
|--------|-------------|----------|
| Respeitar `?redirect=...` quando presente | Pos-login vai para rota de origem solicitada | |
| Ignorar `redirect` e sempre ir para dashboard/home padrao | Fluxo deterministico por permissao apos login | ✓ |
| Regra mista por tipo de rota | Usa redirect apenas em casos selecionados | |

**User's choice:** Opcao B (sempre dashboard/home padrao; ignorar redirect).
**Notes:** Fluxo desejado e primeiro autenticar na pagina de login e depois entrar no sistema com permissoes.

---

## Claude's Discretion

- Localizar causa raiz do redirecionamento para landing e aplicar correcao minima em guard/roteamento.
- Definir o ponto tecnico de aplicacao da regra "ignorar redirect apos login" com menor risco de regressao.

## Deferred Ideas

None.
