---
phase: 01
slug: estabilizacao-de-acesso-e-guardas
status: ready
nyquist_compliant: true
wave_0_complete: true
created: 2026-03-30
updated: 2026-03-30
---

# Phase 01 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest + vue-tsc + eslint |
| **Config file** | `package.json` scripts |
| **Quick run command** | `bun run typecheck` |
| **Full suite command** | `bun run typecheck && bun run lint:fix && bun lint && bun prettier` |
| **Estimated runtime** | ~120 seconds |

---

## Sampling Rate

- **After every task commit:** Run `bun run typecheck`
- **After every plan wave:** Run `bun run typecheck && bun run lint:fix && bun lint && bun prettier`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 180 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 01-02-01 | 02 | 2 | AUTH-01 | manual+static | `bun run typecheck` | ✅ | ⬜ pending |
| 01-02-02 | 02 | 2 | AUTH-02 | manual+static | `bun run typecheck` | ✅ | ⬜ pending |
| 01-02-03 | 02 | 2 | AUTH-03 | manual+static | `bun run typecheck` | ✅ | ⬜ pending |
| 01-02-04 | 02 | 2 | AUTH-04 | manual+static | `bun run typecheck` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] Existing infrastructure covers all phase requirements.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Acesso direto em `/login` exibe tela de autenticação para anônimo | AUTH-01 | depende de navegação real no browser | abrir `/login` em aba limpa e confirmar que não redireciona para landing |
| Usuário autenticado em `/login` vai para home por permissão sem loop | AUTH-02 | depende de estado de sessão real | autenticar, navegar para `/login`, confirmar redirect para dashboard/home esperado e sem retorno para `/login` |
| Rota protegida continua bloqueando acesso sem sessão | AUTH-03 | depende de navegação real + estado sem sessão | limpar sessão, abrir rota protegida (ex.: dashboard), confirmar redirecionamento para `/login` |
| Decisão final ocorre somente após restauração de sessão no boot | AUTH-04 | depende da ordem de hidratação de sessão no app | recarregar aplicação já autenticado, acessar `/login` e confirmar que redirecionamento final só ocorre após sessão restaurada (sem piscar para landing) |

---

## Smoke Local Final da Fase (AUTH-01..AUTH-04)

1. Abrir aba anônima e navegar para `/login` (esperado: permanece no fluxo de login).
2. Autenticar com usuário válido e tentar acessar `/login` manualmente (esperado: home por permissão, sem loop).
3. Limpar sessão e abrir rota protegida diretamente (esperado: bloqueio e ida para `/login`).
4. Com sessão ativa, recarregar app no boot e abrir `/login` (esperado: decisão final apenas após sessão restaurada).

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 180s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
