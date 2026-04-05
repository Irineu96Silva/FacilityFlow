<div align="center">

<h1>🏢 FacilityFlow</h1>

<p><strong>Plataforma inteligente de gestão de serviços prediais</strong></p>

<p>
  <img src="https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/Bun-1.x-f9f1e1?style=for-the-badge&logo=bun&logoColor=black" alt="Bun" />
  <img src="https://img.shields.io/badge/Vue.js-3.x-42b883?style=for-the-badge&logo=vue.js&logoColor=white" alt="Vue.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178c6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/PostgreSQL-17-336791?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Docker-Compose-2496ed?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
</p>

<p>
  <a href="#-sobre-o-projeto">Sobre</a> •
  <a href="#-funcionalidades">Funcionalidades</a> •
  <a href="#-arquitetura">Arquitetura</a> •
  <a href="#-tecnologias">Tecnologias</a> •
  <a href="#-instalação-e-configuração">Instalação</a> •
  <a href="#-variáveis-de-ambiente">Variáveis de Ambiente</a> •
  <a href="#-estrutura-do-projeto">Estrutura</a> •
  <a href="#-fluxo-de-trabalho">Fluxo de Trabalho</a>
</p>

</div>

---

## 📋 Sobre o Projeto

O **FacilityFlow** é uma plataforma SaaS completa para **gestão de serviços prediais** (facility management). O sistema digitaliza e automatiza todo o ciclo de vida de uma solicitação de manutenção — desde a abertura de um chamado via **QR Code** por qualquer usuário, passando pela triagem, atribuição de técnicos, execução, orçamentação, até o encerramento e geração de relatórios profissionais em PPTX.

### Problema que resolve

Empresas que administram múltiplos imóveis, condomínios ou instalações enfrentam dificuldades para:
- Rastrear e priorizar solicitações de manutenção de forma centralizada
- Gerenciar equipes de técnicos e distribuidores de ordens de serviço
- Controlar orçamentos e aprovações de forma ágil
- Gerar relatórios de desempenho para gestores

O FacilityFlow resolve todos esses pontos em uma única plataforma acessível via web e desktop.

---

## ✨ Funcionalidades

### 🎫 Gestão de Chamados (Tickets)
- **Abertura pública via QR Code** — qualquer pessoa pode abrir um chamado escaneando o QR Code do local, sem necessidade de login
- Submissão de fotos, descrição do problema e seleção do tipo de serviço
- Acompanhamento do status do chamado em tempo real
- Histórico completo de eventos do ticket (log de auditoria)

### 🔧 Ordens de Serviço (Work Orders)
- Criação de ordens de serviço a partir dos chamados aprovados
- Atribuição de técnicos responsáveis com controle de geofencing (validação de proximidade)
- Controle de status: `Aberta → Em Andamento → Aguardando Aprovação → Concluída`
- Registro fotográfico das execuções pelos técnicos

### 💰 Módulo de Orçamentos (Budgets)
- Técnicos podem submeter orçamentos vinculados a chamados
- Fluxo de aprovação/rejeição pelo gestor
- Controle de orçamentos pendentes no dashboard

### 🏗️ Gestão de Unidades (Units)
- Cadastro de unidades prediais (andares, salas, áreas comuns)
- Geração de **QR Codes exclusivos** para cada unidade
- Mapeamento de unidades para roteamento automático de chamados

### 👥 Gerenciamento de Usuários e Permissões (PBAC)
- Controle de acesso baseado em políticas (**Policy-Based Access Control**)
- Perfis: **Administrador**, **Gestor**, **Técnico**, **Solicitante**
- Convites por e-mail com verificação de conta

### 📊 Dashboard Analítico
- KPIs em tempo real: tickets abertos, em andamento, concluídos, críticos
- Métricas de produtividade por técnico
- Controle de SLA e orçamentos pendentes
- Gráficos interativos com dados históricos

### 📄 Relatórios Profissionais
- Geração de relatórios fotográficos em **formato PPTX** (PowerPoint)
- Layout padronizado com imagens, descrições e dados do serviço
- Download direto pela interface

### 🤖 Inteligência Artificial
- Integração com **OpenAI (GPT)** para geração automática de descrições técnicas
- Normalização e enriquecimento de dados de chamados

### 🔔 Notificações
- Notificações em tempo real via sistema de filas (BullMQ + Redis)
- Envio de e-mails transacionais via **AWS SES** ou **SMTP**
- Suporte a **SMS** via iAgente

### 🗃️ Armazenamento de Arquivos
- Suporte a armazenamento **local** (desenvolvimento) e **Amazon S3** (produção)
- Upload de fotos pelos usuários e técnicos
- Geração e servimento de URLs assinadas com expiração

### 🖥️ Aplicativo Desktop (Tauri)
- Versão desktop nativa construída com **Tauri** para Windows/macOS/Linux
- Mesmas funcionalidades da versão web em um executável nativo

---

## 🏛️ Arquitetura

O projeto segue uma arquitetura **monorepo** com separação clara entre frontend, backend e pacotes compartilhados.

```
┌─────────────────────────────────────────────────────────┐
│                        CLIENTE                          │
│                                                         │
│  ┌────────────────┐          ┌────────────────────────┐ │
│  │  Web (Vue 3 +  │          │  Desktop (Tauri +       │ │
│  │  Quasar)       │          │  Vue 3)                 │ │
│  └───────┬────────┘          └───────────┬────────────┘ │
└──────────┼────────────────────────────────┼─────────────┘
           │                                │
           ▼                                ▼
┌──────────────────────────────────────────────────────────┐
│                   BACKEND (Bun + Hono)                   │
│                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────┐ │
│  │  API REST   │  │    Auth     │  │  Workers (BullMQ) │ │
│  │  (Hono)     │  │ (BetterAuth)│  │  Email/SMS/Notif  │ │
│  └──────┬──────┘  └──────┬──────┘  └────────┬─────────┘ │
└─────────┼────────────────┼───────────────────┼──────────┘
          │                │                   │
          ▼                ▼                   ▼
┌─────────────────┐  ┌──────────┐  ┌──────────────────────┐
│   PostgreSQL 17  │  │  Redis 8 │  │  Amazon S3 / Local   │
│   (Drizzle ORM) │  │  (Cache+ │  │  (File Storage)      │
└─────────────────┘  │  Queues) │  └──────────────────────┘
                     └──────────┘
```

### Módulos do Backend

| Módulo | Descrição |
|--------|-----------|
| `api/app/predial/tickets` | CRUD e lifecycle de chamados |
| `api/app/predial/work-orders` | Ordens de serviço e atribuição de técnicos |
| `api/app/predial/budgets` | Orçamentos e fluxo de aprovação |
| `api/app/predial/units` | Unidades prediais e geração de QR Code |
| `api/app/predial/service-types` | Tipos de serviço configuráveis |
| `api/app/predial/users` | Perfis dos usuários (técnicos, gestores) |
| `api/app/predial/media` | Upload e gerenciamento de fotos |
| `api/app/predial/notifications` | Central de notificações |
| `api/app/predial/events` | Log de eventos de auditoria |
| `api/app/core/auth` | Autenticação com Better Auth |
| `api/app/core/billing` | Assinaturas e pagamentos |
| `api/app/core/files` | Abstração de armazenamento de arquivos |
| `api/admin` | APIs exclusivas para super-administradores |
| `api/public` | Endpoints públicos (QR Code, abertura de tickets) |
| `api/billing` | Webhooks de pagamento (Asaas, Mercado Pago, Stripe) |

### Pacotes Compartilhados (`packages/`)

| Pacote | Descrição |
|--------|-----------|
| `auth` | Configuração centralizada da autenticação |
| `billing` | Lógica de assinaturas e faturamento |
| `cache` | Abstração de cache com Redis |
| `db` | Configuração e exportação do banco de dados |
| `drizzle` | Migrations e client Drizzle ORM |
| `email` | Serviço de e-mail (SES/SMTP) |
| `files` | Serviço de arquivos (S3/Local) |
| `openai` | Integração com OpenAI |
| `pbac` | Policy-Based Access Control |
| `queues` | BullMQ — definição das filas |
| `redis` | Conexão Redis compartilhada |
| `schema` | Schemas Drizzle do banco de dados |
| `workers` | Workers de processamento assíncrono |
| `validation` | Schemas de validação Zod compartilhados |
| `config` | Configuração centralizada via variáveis de ambiente |
| `parameters` | Parâmetros dinâmicos do sistema |

---

## 🛠️ Tecnologias

### Backend
| Tecnologia | Versão | Uso |
|-----------|--------|-----|
| **Bun** | 1.x | Runtime JavaScript ultrarrápido |
| **Hono** | latest | Framework web minimalista e tipado |
| **TypeScript** | 5.x | Tipagem estática |
| **Drizzle ORM** | latest | ORM type-safe para PostgreSQL |
| **PostgreSQL** | 17 | Banco de dados relacional principal |
| **Redis** | 8 | Cache, sessões e filas |
| **BullMQ** | latest | Filas de processamento assíncrono |
| **Better Auth** | latest | Autenticação moderna com suporte a OAuth |
| **Zod** | latest | Validação de schemas em runtime |

### Frontend
| Tecnologia | Versão | Uso |
|-----------|--------|-----|
| **Vue.js** | 3.x | Framework frontend reativo |
| **Quasar Framework** | 2.x | UI Components e build system |
| **TypeScript** | 5.x | Tipagem estática |
| **Pinia** | latest | Gerenciamento de estado |
| **Vue Router** | 4.x | Roteamento SPA |
| **Vite** | latest | Bundler e dev server |
| **Tauri** | 2.x | Wrapper para versão desktop nativa |

### Infraestrutura & DevOps
| Tecnologia | Uso |
|-----------|-----|
| **Docker + Docker Compose** | Containerização dos serviços |
| **Husky + lint-staged** | Pre-commit hooks e linting automático |
| **ESLint + Prettier** | Qualidade e formatação de código |
| **AWS SES** | Envio de e-mails transacionais |
| **Amazon S3** | Armazenamento de arquivos em produção |

### Integrações Externas
| Serviço | Finalidade |
|---------|-----------|
| **OpenAI (GPT)** | IA para descrições técnicas automáticas |
| **Asaas** | Gateway de pagamento (BR) |
| **Mercado Pago** | Gateway de pagamento (BR/LATAM) |
| **Stripe** | Gateway de pagamento (global) |
| **iAgente SMS** | Envio de SMS |
| **CNPJ.ja** | Consulta e validação de CNPJ |

---

## 🚀 Instalação e Configuração

### Pré-requisitos

- **Bun** >= 1.0.0 — [Instalar Bun](https://bun.sh)
- **Node.js** >= 20.x (para compatibilidade com algumas ferramentas)
- **Docker** e **Docker Compose** — para os serviços de infraestrutura
- **Git**

### 1. Clonar o repositório

```bash
git clone https://github.com/Irineu96Silva/FacilityFlow.git
cd FacilityFlow
```

### 2. Instalar dependências

```bash
bun install
```

### 3. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações. Consulte a seção [Variáveis de Ambiente](#-variáveis-de-ambiente) para detalhes.

### 4. Subir os serviços de infraestrutura

```bash
# Sobe PostgreSQL e Redis em background
docker compose up postgres redis -d
```

### 5. Executar as migrations do banco de dados

```bash
bun run db:migrate
```

### 6. (Opcional) Popular o banco com dados iniciais

```bash
bun run db:seed
```

### 7. Iniciar o servidor de desenvolvimento

```bash
# Backend (porta 3000)
bun run dev:backend

# Frontend (porta 5173 ou conforme configuração do Quasar)
bun run dev:frontend
```

### Usando Docker Compose completo (produção/staging)

Para subir toda a stack com um único comando:

```bash
docker compose up -d
```

Isso irá iniciar:
- `postgres` — banco de dados na porta `5433`
- `redis` — cache e filas na porta `6379`
- `app` — servidor da aplicação na porta `3500`
- `workers` — processadores de filas em background
- `rpa-workers` — workers de automação (RPA)
- `chromium` — navegador headless para automações

---

## ⚙️ Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env` e preencha os valores. Abaixo estão as variáveis agrupadas por categoria:

### 🗄️ Banco de Dados
```dotenv
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/gestao_predial
```

### 🔴 Redis
```dotenv
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=          # Deixe em branco para desenvolvimento
REDIS_DB=0
```

### 🔐 Autenticação (Better Auth)
```dotenv
BETTER_AUTH_SECRET=your-secret-key-here-minimum-32-characters-long
BETTER_AUTH_URL=http://localhost:3000
```

### 📧 E-mail
```dotenv
# Driver: 'ses' (AWS SES) ou 'smtp'
EMAIL_DRIVER=ses
EMAIL_SES_REGION=us-east-1
EMAIL_SES_ACCESS_KEY_ID=your-aws-access-key
EMAIL_SES_SECRET_ACCESS_KEY=your-aws-secret-key
EMAIL_FROM_ADDRESS=noreply@yourdomain.com
EMAIL_FROM_NAME="FacilityFlow"
```

### 📁 Armazenamento de Arquivos
```dotenv
# Driver: 'local' (desenvolvimento) ou 's3' (produção)
FILES_PROVIDER=local
FILES_LOCAL_FOLDER=./storage/files
FILES_LOCAL_SIGNING_KEY=your-signing-key-here
```

### 🤖 Inteligência Artificial
```dotenv
PREDIAL_AI_PROVIDER=openai
PREDIAL_AI_MODEL=gpt-3.5-turbo
PREDIAL_AI_API_URL=https://api.openai.com/v1
PREDIAL_AI_API_KEY=sk-your-openai-api-key-here
```

### 🏢 Configurações Predial
```dotenv
PREDIAL_ENABLED=true
PREDIAL_GEOFENCE_DISTANCE=100       # Distância em metros para validação de geofencing
PREDIAL_NOTIFICATION_ENABLED=true
PREDIAL_MAX_PHOTO_SIZE=5            # Tamanho máximo de foto em MB
PREDIAL_TRIAL_DURATION_DAYS=15      # Dias de trial para novos clientes
```

### 🔄 Filas de Processamento
```dotenv
QUEUES_WORKERS_ENABLED=email,notification
```

### 🌐 Servidor
```dotenv
PORT=3000
NODE_ENV=development
```

---

## 📁 Estrutura do Projeto

```
gestao_predial/
├── 📁 backend/                    # Servidor Bun + Hono
│   ├── 📁 api/
│   │   ├── 📁 app/
│   │   │   ├── 📁 core/           # Autenticação, billing, arquivos, CEP, CNPJ, FIPE
│   │   │   └── 📁 predial/        # Módulo principal de gestão predial
│   │   │       ├── 📁 tickets/    # Chamados
│   │   │       ├── 📁 work-orders # Ordens de serviço
│   │   │       ├── 📁 budgets/    # Orçamentos
│   │   │       ├── 📁 units/      # Unidades prediais
│   │   │       ├── 📁 service-types/ # Tipos de serviço
│   │   │       ├── 📁 users/      # Perfis de usuários
│   │   │       ├── 📁 media/      # Upload de mídia
│   │   │       ├── 📁 notifications/ # Notificações
│   │   │       └── 📁 events/     # Log de eventos
│   │   ├── 📁 admin/              # APIs administrativas
│   │   ├── 📁 billing/            # Webhooks de pagamento
│   │   ├── 📁 menus/              # Configuração de menus dinâmicos
│   │   ├── 📁 public/             # Endpoints públicos (QR Code)
│   │   └── 📁 rpa/                # Automações RPA
│   ├── 📁 auth/                   # Configuração Better Auth
│   ├── 📁 assets/                 # Assets estáticos do backend
│   ├── 📁 dynamic/                # Configurações dinâmicas
│   ├── 📁 files/                  # Processamento de arquivos
│   ├── 📁 lib/                    # Utilitários e helpers
│   ├── 📁 middleware/             # Middlewares Hono
│   ├── 📁 queues/                 # Produtores de filas BullMQ
│   ├── 📁 rpas/                   # Scripts de automação RPA
│   └── 📁 workers/                # Consumidores de filas
│
├── 📁 frontend/                   # SPA Vue 3 + Quasar
│   ├── 📁 components/
│   │   ├── 📁 app/                # Componentes da aplicação autenticada
│   │   ├── 📁 admin/              # Componentes do painel administrativo
│   │   ├── 📁 dashboard/          # Componentes do dashboard
│   │   ├── 📁 landing/            # Componentes da landing page
│   │   └── 📁 layouts/            # Componentes de layout
│   ├── 📁 composables/            # Composables Vue (lógica reutilizável)
│   ├── 📁 layouts/                # Layouts de página (autenticado, público, admin)
│   ├── 📁 lib/                    # Utilitários do frontend
│   ├── 📁 pages/
│   │   ├── 📁 admin/              # Páginas do painel administrativo
│   │   │   ├── 📁 core/           # Gerenciamento de plataforma
│   │   │   ├── 📁 platform/       # Configurações de plataforma
│   │   │   └── 📁 predial/        # Gestão predial (admin)
│   │   ├── 📁 app/
│   │   │   ├── 📁 core/           # Dashboard, perfil, billing
│   │   │   └── 📁 predial/        # Módulo predial (usuário final)
│   │   ├── 📁 auth/               # Login, cadastro, recuperação de senha
│   │   ├── 📁 core/               # Páginas centrais (erro 404, etc.)
│   │   ├── 📁 landing/            # Landing page pública
│   │   └── 📁 public/             # Páginas públicas (ex: QR Code ticket)
│   ├── 📁 router/                 # Configuração do Vue Router
│   ├── 📁 schemas/                # Schemas de validação do frontend
│   ├── 📁 stores/                 # Stores Pinia
│   └── 📁 style/                  # Estilos globais e design system
│
├── 📁 packages/                   # Pacotes compartilhados (monorepo)
│   ├── 📁 auth/                   # Configuração de autenticação
│   ├── 📁 billing/                # Módulo de faturamento
│   ├── 📁 cache/                  # Abstração de cache
│   ├── 📁 cep/                    # Consulta de CEP
│   ├── 📁 cnpjja/                 # Consulta de CNPJ
│   ├── 📁 config/                 # Configuração central
│   ├── 📁 db/                     # Cliente do banco de dados
│   ├── 📁 document-validation/    # Validação de documentos (CPF/CNPJ)
│   ├── 📁 drizzle/                # Migrations Drizzle ORM
│   ├── 📁 email/                  # Serviço de e-mail
│   ├── 📁 files/                  # Serviço de arquivos
│   ├── 📁 fipe/                   # Consulta tabela FIPE
│   ├── 📁 limits/                 # Limites por plano/assinatura
│   ├── 📁 liquid/                 # Templates com Liquid (e-mails)
│   ├── 📁 openai/                 # Integração OpenAI
│   ├── 📁 parameters/             # Parâmetros dinâmicos do sistema
│   ├── 📁 pbac/                   # Policy-Based Access Control
│   ├── 📁 queues/                 # Definições de filas BullMQ
│   ├── 📁 redis/                  # Conexão Redis
│   ├── 📁 rpa/                    # Automação RPA
│   ├── 📁 schema/                 # Schemas do banco de dados
│   ├── 📁 sms/                    # Serviço de SMS
│   ├── 📁 validation/             # Schemas de validação compartilhados
│   └── 📁 workers/                # Workers de processamento
│
├── 📁 docker/                     # Dockerfiles para cada serviço
│   ├── 📁 app/                    # Dockerfile da aplicação principal
│   ├── 📁 postgres/               # Dockerfile do PostgreSQL customizado
│   ├── 📁 postgres-simple/        # Dockerfile PostgreSQL simplificado
│   └── 📁 rpa/                    # Dockerfile para automações RPA
│
├── 📁 scripts/                    # Scripts utilitários
│   ├── 📁 auth/                   # Scripts de autenticação
│   ├── 📁 billing/                # Scripts de faturamento
│   ├── 📁 db/                     # Scripts de banco de dados
│   ├── 📁 predial/                # Scripts específicos do módulo predial
│   └── 📁 services/               # Scripts de serviços
│
├── 📁 src-tauri/                  # Aplicativo desktop (Tauri)
│   ├── 📁 capabilities/           # Permissões do app Tauri
│   ├── 📁 icons/                  # Ícones do aplicativo
│   └── 📁 src/                    # Código Rust nativo
│
├── 📁 templates/                  # Templates de e-mail e documentos
├── 📁 storage/                    # Armazenamento local (desenvolvimento)
├── 📁 docs/                       # Documentação técnica e sprints
├── 📁 guides/                     # Guias e manuais
├── 📁 reference/                  # Material de referência
├── 📄 docker-compose.yml          # Orquestração Docker
├── 📄 .env.example                # Exemplo de variáveis de ambiente
└── 📄 .gitignore
```

---

## 🔄 Fluxo de Trabalho

### Ciclo de vida de um Chamado (Ticket)

```
Usuário escaneia QR Code
         │
         ▼
  Página Pública (sem login)
  → Preenche descrição + fotos
  → Seleciona tipo de serviço
         │
         ▼
  Ticket criado com status: ABERTO
         │
         ▼
  Gestor analisa no Dashboard
  → Aprova ou Rejeita
         │
    ┌────┴────┐
    ▼         ▼
Rejeitado   Aprovado
           → Ordem de Serviço criada
                    │
                    ▼
           Técnico atribuído
           → Recebe notificação
           → Acessa a O.S. no app
                    │
                    ▼
           Executa o serviço
           → Registra fotos
           → Submete orçamento (se necessário)
                    │
                    ▼
           Gestor aprova orçamento?
           → Sim: Marca como CONCLUÍDA
           → Gera relatório PPTX
```

### Papéis e Permissões

| Papel | Acesso |
|-------|--------|
| **Super Admin** | Acesso total à plataforma e gestão de tenants |
| **Administrador** | Gerenciamento completo do tenant (empresa) |
| **Gestor** | Dashboard, aprovação de chamados, orçamentos e relatórios |
| **Técnico** | Visualização e execução de ordens de serviço atribuídas |
| **Solicitante** | Abertura de chamados via QR Code (sem login necessário) |

---

## 🐳 Docker

### Serviços disponíveis

| Serviço | Porta | Descrição |
|---------|-------|-----------|
| `postgres` | `5433:5432` | Banco de dados PostgreSQL 17 |
| `redis` | `6379:6379` | Cache e filas |
| `app` | `3500:3500` | Servidor principal da aplicação |
| `workers` | — | Processadores de filas em background |
| `rpa-workers` | — | Workers para automações RPA |
| `chromium` | — | Navegador headless para automações |

### Comandos úteis Docker

```bash
# Subir toda a stack
docker compose up -d

# Visualizar logs de um serviço específico
docker compose logs -f app

# Reiniciar um serviço
docker compose restart app

# Parar todos os serviços
docker compose down

# Parar e remover volumes (⚠️ apaga dados)
docker compose down -v
```

---

## 🗃️ Banco de Dados

O projeto utiliza **Drizzle ORM** para gerenciamento do schema e migrations.

### Comandos de banco de dados

```bash
# Executar todas as migrations pendentes
bun run db:migrate

# Gerar uma nova migration a partir do schema
bun run db:generate

# Abrir o Drizzle Studio (interface visual)
bun run db:studio

# Popular o banco com dados iniciais
bun run db:seed
```

### Entidades principais

| Entidade | Descrição |
|----------|-----------|
| `tenants` | Empresas/organizações clientes da plataforma |
| `users` | Usuários do sistema |
| `units` | Unidades prediais (salas, andares, áreas) |
| `tickets` | Chamados de manutenção |
| `work_orders` | Ordens de serviço |
| `budgets` | Orçamentos das ordens |
| `service_types` | Tipos de serviço configuráveis |
| `ticket_events` | Log de auditoria dos chamados |
| `media` | Arquivos de mídia (fotos) |
| `notifications` | Notificações do sistema |

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Siga os passos abaixo:

1. Faça um **fork** do repositório
2. Crie uma branch para sua feature: `git checkout -b feature/minha-feature`
3. Faça commit das suas alterações: `git commit -m 'feat: adiciona minha feature'`
4. Faça push para a branch: `git push origin feature/minha-feature`
5. Abra um **Pull Request**

### Convenção de commits

Este projeto segue o padrão **Conventional Commits**:

```
feat:     Nova funcionalidade
fix:      Correção de bug
docs:     Alterações na documentação
style:    Formatação, ponto e vírgula faltando, etc.
refactor: Refatoração de código
test:     Adição ou correção de testes
chore:    Atualização de tarefas de build, etc.
```

### Pre-commit hooks

O projeto utiliza **Husky** e **lint-staged** para garantir qualidade do código antes de cada commit:
- ESLint para verificação de código
- Prettier para formatação

---

## 📜 Licença

Este projeto está sob licença proprietária. Todos os direitos reservados.

---

## 👤 Autor

**Irineu Silva**

- GitHub: [@Irineu96Silva](https://github.com/Irineu96Silva)

---

<div align="center">
  <p>Feito com ❤️ para modernizar a gestão predial</p>
  <p><strong>FacilityFlow</strong> — Da solicitação à solução, em um só lugar.</p>
</div>
