# Codebase Concerns

**Analysis Date:** 2026-03-30

## Critérios de severidade

- **Crítica:** risco alto de indisponibilidade, falha operacional ou exposição indevida de dados.
- **Alta:** degradação relevante de manutenção/entrega com impacto frequente em produção.
- **Média:** risco real, porém com impacto localizado ou mitigável no curto prazo.
- **Baixa:** melhoria importante, mas sem efeito imediato severo.

## Tech Debt

**[Crítica] RPA com etapa manual e pausa de depuração**
- Issue: fluxo de captcha não implementado e dependência de intervenção manual.
- Files: `backend/rpas/rpas/onr-visualizacao-matricula.ts`
- Impact: jobs ficam bloqueados/pendentes, risco de fila acumulada e SLA comprometido em automações.
- Fix approach: implementar integração de resolução de captcha (helper dedicado), remover `page.pause()` e incluir timeout/retry explícitos com telemetria de falha.

**[Alta] Adoção incompleta de cliente tipado (Hono RPC)**
- Issue: vários pontos de frontend permanecem em `fetch` direto com TODO de migração.
- Files: `frontend/stores/predial/subscription.ts`, `frontend/lib/composables/useMediaUpload.ts`
- Impact: contratos de API menos seguros, maior chance de quebra silenciosa em refactor de endpoints e validação inconsistente.
- Fix approach: migrar chamadas para cliente RPC central e remover caminhos paralelos.

**[Alta] Store offline com implementação placeholder**
- Issue: métricas de sincronização fixadas em zero e sem backend real de persistência offline.
- Files: `frontend/stores/predial/offline.ts`
- Impact: observabilidade falsa do estado offline, decisões operacionais incorretas e risco de perda de confiança do usuário.
- Fix approach: implementar IndexedDB/fila real, com métricas reais e estratégia de retry.

## Known Bugs

**[Crítica] Fluxo de RPA depende de pausa interativa**
- Symptoms: execução pode ficar aguardando pausa/debug em vez de concluir automaticamente.
- Files: `backend/rpas/rpas/onr-visualizacao-matricula.ts`
- Trigger: execução do job de visualização de matrícula ao chegar na etapa de captcha.
- Workaround: intervenção manual durante execução; não escalável.

**[Média] Estado offline reportado sem refletir fila real**
- Symptoms: `pending`, `failed` e `queueSize` permanecem zerados.
- Files: `frontend/stores/predial/offline.ts`
- Trigger: uso de funcionalidades offline/sync.
- Workaround: acompanhamento manual por logs/inspeção externa.

## Security Considerations

**[Alta] Logs de frontend com dados sensíveis de pagamento**
- Risk: exposição de payload de pagamento e dados de cliente em console do navegador.
- Files: `frontend/components/app/core/billing/PaymentDialog.vue`
- Current mitigation: não detectada no arquivo (há múltiplos `console.log` em fluxo de pagamento).
- Recommendations: remover logs sensíveis, aplicar logger com redaction e habilitar logs verbosos apenas em ambiente de desenvolvimento.

**[Média] Resposta 500 inclui detalhe interno**
- Risk: vazamento de detalhes internos via `detail: err.message` em erro não tratado.
- Files: `backend/index.ts`
- Current mitigation: logging server-side para erros 500.
- Recommendations: retornar mensagem genérica em produção e mover detalhes para log estruturado interno.

## Performance Bottlenecks

**[Alta] Páginas/Componentes monolíticos de grande porte**
- Problem: arquivos com 1.5k-2.6k linhas concentram múltiplas responsabilidades.
- Files: `frontend/pages/app/predial/technician.vue`, `frontend/pages/admin/predial/reports.vue`, `frontend/pages/app/predial/supervisor.vue`, `frontend/components/app/core/billing/PaymentDialog.vue`
- Cause: acoplamento de UI, regras de negócio, chamadas de API e tratamento de erro no mesmo arquivo.
- Improvement path: quebrar por feature/composable, extrair serviços de domínio e isolar camadas de acesso a dados.

**[Média] Pooling periódico sem teardown no store offline**
- Problem: `setInterval` contínuo sem limpeza explícita no ciclo de vida.
- Files: `frontend/stores/predial/offline.ts`
- Cause: inicialização de polling sem estratégia de dispose.
- Improvement path: controlar ciclo de vida (start/stop), usar backoff e evitar polling fixo global.

## Fragile Areas

**[Alta] Concentração de fluxo operacional em páginas únicas**
- Files: `frontend/pages/app/predial/technician.vue`, `frontend/pages/app/predial/requester.vue`, `frontend/pages/admin/predial/units.vue`
- Why fragile: alto uso de `any`, múltiplos `catch` genéricos e muitos fluxos assíncronos em cadeia no mesmo módulo.
- Safe modification: alterar em passos pequenos, extrair funções puras/composables antes de mudar regra de negócio.
- Test coverage: sem testes detectados no app principal (`frontend/` e `backend/`) para validar regressões.

**[Alta] Endpoint de relatórios com alta densidade de responsabilidades**
- Files: `backend/api/admin/predial/reports/index.ts`
- Why fragile: endpoint único agrega filtros, KPIs, exportações e lógica de transformação em grande volume.
- Safe modification: separar builders de query/serialização e criar contratos por tipo de relatório.
- Test coverage: não foram detectados testes cobrindo este endpoint.

## Scaling Limits

**[Alta] Escala limitada por execução manual em automações RPA**
- Current capacity: limitada por intervenção humana no fluxo com captcha.
- Limit: paralelismo real baixo para jobs que dependem do passo manual.
- Scaling path: resolver captcha de forma automatizada + retry policy + monitoramento por fila.

**[Média] Escalabilidade de manutenção limitada por monolitos de frontend**
- Current capacity: mudanças funcionais concentram risco em poucos arquivos extensos.
- Limit: throughput de equipe reduzido por alto custo de revisão/regressão.
- Scaling path: modularização incremental por domínio (tickets, mídia, pagamento, relatórios).

## Dependencies at Risk

**[Média] Dependência operacional de serviços externos sem fallback explícito no fluxo crítico**
- Risk: indisponibilidade/latência de integrações afeta UX e conclusão de fluxos.
- Impact: falhas em geração de descrição IA e pagamentos podem interromper jornada.
- Migration plan: padronizar circuit-breaker/retry por integração e fallback funcional por feature.
- Files: `backend/api/app/predial/tickets/index.ts`, `frontend/components/app/core/billing/PaymentDialog.vue`

## Missing Critical Features

**[Alta] Camada de testes automatizados ausente no app principal**
- Problem: não há testes detectados em `frontend/`, `backend/` e `packages/` (apenas exemplos em código legado dentro de `projeto_predial/`).
- Blocks: refactors seguros, redução de regressões e confiança em deploy contínuo.

## Test Coverage Gaps

**[Alta] Fluxos críticos sem cobertura**
- What's not tested: pagamentos, tickets (abertura/execução/finalização), relatórios e RPA de matrícula.
- Files: `frontend/components/app/core/billing/PaymentDialog.vue`, `backend/api/app/predial/tickets/index.ts`, `backend/api/admin/predial/reports/index.ts`, `backend/rpas/rpas/onr-visualizacao-matricula.ts`
- Risk: regressões funcionais e operacionais só descobertas em produção.
- Priority: High

**[Média] Ausência de testes de integração para contratos frontend-backend**
- What's not tested: consistência de payload/erros em endpoints usados por `fetch` direto.
- Files: `frontend/stores/predial/subscription.ts`, `frontend/lib/composables/useMediaUpload.ts`
- Risk: quebra silenciosa após mudanças de rota/shape de resposta.
- Priority: Medium

---

*Concerns audit: 2026-03-30*
