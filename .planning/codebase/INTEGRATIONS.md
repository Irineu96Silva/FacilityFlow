# External Integrations

**Analysis Date:** 2026-03-30

## APIs & External Services

**AI:**
- OpenAI - Geração/consumo de modelos de IA
  - SDK/Client: `openai` via `packages/openai/index.ts`
  - Auth: `OPENAI_API_KEY` em `packages/config/schema/core/openai.ts`

**Payments:**
- Stripe - Provedor de pagamento suportado (checkout/webhook)
  - SDK/Client: `stripe`, `@stripe/stripe-js`
  - Auth: `PAYMENT_STRIPE_SECRET_KEY`, `PAYMENT_STRIPE_WEBHOOK_SECRET` em `packages/config/schema/core/payment.ts`
- Mercado Pago - Provedor de pagamento suportado (inclui fluxo de frontend e webhook)
  - SDK/Client: `mercadopago`
  - Auth: `PAYMENT_MERCADO_PAGO_ACCESS_TOKEN`, `PAYMENT_MERCADO_PAGO_WEBHOOK_SECRET` em `packages/config/schema/core/payment.ts`
- Asaas / Pagar.me - Configuração e webhook mapeados, com providers definidos em schema
  - SDK/Client: integração por HTTP/processamento interno (sem SDK explícito confirmado nos arquivos lidos)
  - Auth: `PAYMENT_ASAAS_API_KEY`, `PAYMENT_PAGAR_ME_API_KEY` em `packages/config/schema/core/payment.ts`

**Email:**
- AWS SES - Envio de e-mail transacional
  - SDK/Client: `@aws-sdk/client-ses` em `packages/email/sesEmailSender.ts`
  - Auth: `EMAIL_SES_ACCESS_KEY_ID`, `EMAIL_SES_SECRET_ACCESS_KEY` em `packages/config/schema/core/email.ts`
- SMTP - Canal alternativo de envio
  - SDK/Client: `nodemailer` em `packages/email/smtpEmailSender.ts`
  - Auth: `EMAIL_SMTP_USER`, `EMAIL_SMTP_PASSWORD` em `packages/config/schema/core/email.ts`

**SMS:**
- iAgente SMS - Provedor de envio SMS
  - SDK/Client: integração HTTP em `packages/sms/iagenteSMSSender.ts`
  - Auth: `SMS_IAGENTE_USERNAME`, `SMS_IAGENTE_PASSWORD` em `packages/config/schema/core/sms.ts`

**Object Storage:**
- AWS S3 - Upload/download/URLs assinadas
  - SDK/Client: `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner` em `packages/files/s3Storage.ts`
  - Auth: chaves de acesso configuradas no provider S3 (consumidas por `S3StorageConfig`)

## Data Storage

**Databases:**
- PostgreSQL
  - Connection: `DATABASE_URL` (prioritário) ou `DATABASE_CONNECTION_*` em `packages/config/schema/core/database.ts`
  - Client: `drizzle-orm` + `postgres` em `packages/db/index.ts`

**File Storage:**
- AWS S3 (provider explícito) em `packages/files/s3Storage.ts`
- Suporte a armazenamento local também documentado no módulo `packages/files/README.md`

**Caching:**
- Redis
  - Connection: `REDIS_URL` ou `REDIS_HOST`/`REDIS_PORT`/`REDIS_PASSWORD` em `packages/config/schema/core/redis.ts`
  - Client: `ioredis` em `packages/redis/index.ts`
  - Uso adicional para filas BullMQ e sessão/rate limit

## Authentication & Identity

**Auth Provider:**
- Better Auth
  - Implementation: instância central em `packages/auth/index.ts` com adapter Drizzle, storage secundário Redis e social login (Google/Apple/Meta)

## Monitoring & Observability

**Error Tracking:**
- Serviço externo dedicado não detectado

**Logs:**
- Logging via `console.*` em pontos de erro/operação (ex.: `backend/index.ts`, `backend/api/app/core/billing/index.ts`)
- Persistência operacional em banco para mensagens e integrações (ex.: `emailMessages`, `smsMessages` em `packages/email/*`, `packages/sms/*`)

## CI/CD & Deployment

**Hosting:**
- Plataforma de hospedagem específica não detectada no código lido

**CI Pipeline:**
- Pipeline GitLab detectado (`.gitlab-ci.yml`)
- Workflows GitHub no projeto principal não detectados (somente em dependências de `node_modules`)

## Environment Configuration

**Required env vars:**
- Banco: `DATABASE_URL` ou `DATABASE_CONNECTION_HOST`, `DATABASE_CONNECTION_DATABASE`, `DATABASE_CONNECTION_USERNAME`, `DATABASE_CONNECTION_PASSWORD`
- Cache/filas: `REDIS_URL` ou `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`
- Auth: `BETTER_AUTH_SECRET` (via schema de auth), `PUBLIC_BASE_URL`/base URLs relacionadas
- Email SES: `EMAIL_SES_ACCESS_KEY_ID`, `EMAIL_SES_SECRET_ACCESS_KEY`, `EMAIL_FROM`
- Pagamento: `PAYMENT_DEFAULT_PROVIDER` e chaves por provedor (`PAYMENT_STRIPE_*`, `PAYMENT_MERCADO_PAGO_*`, etc.)
- IA: `OPENAI_API_KEY`
- SMS: `SMS_DRIVER` e credenciais `SMS_IAGENTE_*` quando driver iAgente

**Secrets location:**
- Variáveis de ambiente carregadas via `.env` e schema central `packages/config/schema/**`

## Webhooks & Callbacks

**Incoming:**
- Pagamentos: `POST /api/billing/webhook/:provider` em `backend/api/billing/webhooks.ts`
  - Providers suportados: `stripe`, `asaas`, `pagar_me`, `mercado_pago`
- Auth callbacks gerenciados pelo Better Auth em `/api/auth/*` (roteamento em `backend/index.ts` + `backend/auth/index.ts`)

**Outgoing:**
- OpenAI API requests via cliente em `packages/openai/index.ts`
- AWS SES requests em `packages/email/sesEmailSender.ts`
- iAgente SMS via HTTP GET em `packages/sms/iagenteSMSSender.ts`
- AWS S3 operations/sign URLs em `packages/files/s3Storage.ts`

---

*Integration audit: 2026-03-30*
