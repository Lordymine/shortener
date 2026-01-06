# 📚 Documentação do Sistema Encurtador de URLs

> **Versão**: 1.0.0  
> **Última Atualização**: Janeiro 2026  
> **Status**: Produção-Ready

---

## 📖 Sumário

1. [Visão Geral](#-visão-geral)
2. [Arquitetura](#-arquitetura)
3. [Stack Tecnológica](#-stack-tecnológica)
4. [Backend](#-backend)
5. [Frontend](#-frontend)
6. [API Reference](#-api-reference)
7. [Banco de Dados](#-banco-de-dados)
8. [Segurança](#-segurança)
9. [Configuração e Deploy](#-configuração-e-deploy)
10. [Testes](#-testes)
11. [Guia para LLMs](#-guia-para-llms)

---

## 🎯 Visão Geral

Sistema de encurtamento de URLs projetado para operar em **escala massiva**, priorizando alta taxa de leitura, baixa latência e simplicidade arquitetural.

### Objetivos do Produto
- ✅ Transformar URLs longas em links curtos de **7 caracteres Base62**
- ✅ Garantir unicidade do identificador
- ✅ Minimizar leituras no caminho de escrita
- ✅ Maximizar performance no redirecionamento
- ✅ Suportar centenas de milhões de URLs por dia

### Premissas de Escala
| Métrica | Valor |
|---------|-------|
| **Escritas** | 100 milhões/dia (~1.160 RPS) |
| **Leituras** | 10:1 ratio (~11.600 RPS) |
| **Retenção** | 10 anos (~365 bilhões de registros) |
| **Armazenamento** | ~36,5 TB estimado |
| **Capacidade** | 62⁷ ≈ 3,5 trilhões de códigos únicos |

---

## 🏗️ Arquitetura

O sistema segue princípios de **Clean Architecture**, **SOLID** e **DRY**.

```mermaid
graph TB
    subgraph "Frontend - Next.js"
        A[React Components] --> B[API Service]
    end
    
    subgraph "Backend - Fastify"
        C[Presentation Layer] --> D[Application Layer]
        D --> E[Domain Layer]
        D --> F[Infrastructure Layer]
    end
    
    subgraph "Database"
        G[(PostgreSQL)]
    end
    
    B --> C
    F --> G
```

### Camadas do Backend

| Camada | Responsabilidade | Arquivos Principais |
|--------|------------------|---------------------|
| **Presentation** | Rotas HTTP, Controllers | `routes/`, `controllers/` |
| **Application** | Casos de Uso, DTOs | `use-cases/`, `dtos/` |
| **Domain** | Entidades, Serviços, Validadores | `entities/`, `services/`, `validators/` |
| **Infrastructure** | Repositórios, Database, Cache | `repositories/`, `database/` |

### Fluxo de Dados

```mermaid
sequenceDiagram
    participant Client
    participant Controller
    participant UseCase
    participant Service
    participant Repository
    participant Database

    Client->>Controller: POST /shorten {url}
    Controller->>UseCase: execute({url})
    UseCase->>Service: generate(longUrl)
    Service-->>UseCase: shortCode
    UseCase->>Repository: save(url)
    Repository->>Database: INSERT
    Database-->>Repository: Url
    Repository-->>UseCase: Url
    UseCase-->>Controller: CreateUrlResponse
    Controller-->>Client: 201 {shortCode, shortUrl}
```

---

## 🛠️ Stack Tecnológica

### Backend
| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **Node.js** | ≥20.0.0 | Runtime |
| **TypeScript** | ^5.4.5 | Tipagem estática |
| **Fastify** | ^4.28.1 | Framework HTTP (alta performance) |
| **Prisma** | ^5.22.0 | ORM e migrations |
| **PostgreSQL** | 16 (Docker) | Banco de dados relacional |
| **Zod** | ^3.23.8 | Validação de schemas |
| **Hashids** | ^2.3.0 | Ofuscação de IDs |
| **Vitest** | ^1.6.0 | Framework de testes |

### Frontend
| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **Next.js** | 16.1.1 | Framework React |
| **React** | 19.2.3 | UI Library |
| **Tailwind CSS** | v4 | Estilização |
| **Shadcn UI** | Latest | Componentes UI |
| **Lucide React** | ^0.562.0 | Ícones |
| **Sonner** | ^2.0.7 | Notificações toast |

---

## 🔧 Backend

### Estrutura de Diretórios

```
backend/
├── src/
│   ├── domain/                    # Camada de Domínio
│   │   ├── entities/
│   │   │   └── Url.ts            # Entidade principal
│   │   ├── services/
│   │   │   └── ShortCodeGenerator.ts # Gerador de códigos Base62
│   │   ├── validators/
│   │   │   └── UrlValidator.ts   # Validação com Zod
│   │   └── repositories/
│   │       └── IUrlRepository.ts # Interface do repositório
│   │
│   ├── application/               # Camada de Aplicação
│   │   ├── use-cases/
│   │   │   ├── CreateShortUrl.ts # Criar URL curta
│   │   │   └── GetOriginalUrl.ts # Buscar URL original
│   │   └── dtos/
│   │       └── index.ts          # DTOs e Errors
│   │
│   ├── infrastructure/            # Camada de Infraestrutura
│   │   ├── repositories/
│   │   │   └── PrismaUrlRepository.ts # Implementação Prisma
│   │   └── database/
│   │       └── prisma.ts         # Cliente Prisma singleton
│   │
│   ├── presentation/              # Camada de Apresentação
│   │   ├── controllers/
│   │   │   └── UrlController.ts  # Controller HTTP
│   │   └── routes/
│   │       └── urlRoutes.ts      # Definição de rotas
│   │
│   ├── config.ts                  # Configurações do ambiente
│   ├── server.ts                  # Bootstrap do servidor
│   └── index.ts                   # Entry point
│
├── tests/
│   ├── unit/                      # Testes unitários
│   └── integration/               # Testes de integração
│
├── prisma/
│   └── schema.prisma              # Schema do banco
│
└── docker-compose.yml             # PostgreSQL container
```

### Componentes Principais

#### 1. Entidade Url (`domain/entities/Url.ts`)

```typescript
interface Url {
  id?: bigint;
  shortCode: string;  // 7 caracteres Base62
  longUrl: string;    // URL original
  createdAt?: Date;
}
```

#### 2. ShortCodeGenerator (`domain/services/ShortCodeGenerator.ts`)

Serviço responsável por gerar códigos curtos únicos.

**Estratégia de Geração:**
1. Gera hash numérico da URL longa (SHA-256)
2. Adiciona aleatoriedade (timestamp + random bytes)
3. Ofusca com HashID + salt
4. Converte para Base62
5. Extrai 7 caracteres

**Métodos:**
- `generate(longUrl, attempt)` → `string` (7 chars)
- `isValidShortCode(code)` → `boolean`

#### 3. UrlValidator (`domain/validators/UrlValidator.ts`)

Validação com Zod para segurança.

**Protocolos Bloqueados:**
- `javascript:`
- `data:`
- `vbscript:`
- `file:`
- `ftp:`

**Protocolos Permitidos:**
- `http:`
- `https:`

#### 4. Casos de Uso

**CreateShortUrlUseCase:**
```typescript
// Fluxo:
// 1. Valida e sanitiza URL
// 2. Verifica se já existe (reuso)
// 3. Gera código curto
// 4. Salva no banco
// 5. Retry em colisão (máx. 5 tentativas)
execute(input: { url: string }): Promise<CreateUrlResponse>
```

**GetOriginalUrlUseCase:**
```typescript
// Fluxo:
// 1. Valida formato do código
// 2. Busca no repositório
// 3. Retorna URL ou erro 404
execute(shortCode: string): Promise<GetUrlResponse>
getLongUrl(shortCode: string): Promise<string>
```

#### 5. Controller (`presentation/controllers/UrlController.ts`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `createShortUrl` | `POST /shorten` | Cria URL curta |
| `redirectToOriginal` | `GET /:shortCode` | Redireciona (301) |
| `getUrlInfo` | `GET /api/:shortCode` | Info da URL (JSON) |

---

## 🖥️ Frontend

### Estrutura de Diretórios

```
frontend/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Página principal
│   │   ├── layout.tsx            # Layout root
│   │   └── globals.css           # Estilos globais
│   │
│   ├── components/
│   │   ├── url-shortener-form.tsx # Formulário principal
│   │   ├── url-result.tsx        # Exibição do resultado
│   │   ├── features-section.tsx  # Seção de features
│   │   ├── mobile-nav.tsx        # Navegação mobile
│   │   └── ui/                   # Componentes Shadcn
│   │
│   ├── services/
│   │   └── api.ts                # Cliente HTTP
│   │
│   └── tests/
│       └── url-shortener-form.test.tsx
│
└── public/
    └── (assets)
```

### Componentes Principais

#### 1. UrlShortenerForm

Formulário principal com:
- Input com prefixo `https://`
- Validação client-side de URL
- Loading state com spinner
- Design responsivo (mobile/desktop)

#### 2. UrlResult

Exibe a URL encurtada com:
- Campo de input readonly
- Botão de copiar com feedback visual
- Animação de entrada

#### 3. FeaturesSection

Grid de features no estilo "Bento":
- Lightning Fast Redirection
- Enterprise Grade Security
- Analytics
- Custom Alias

### Serviço de API

```typescript
// services/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface ShortenResponse {
  shortCode: string;
  shortUrl: string;
  originalUrl: string;
}

async function shortenUrl(originalUrl: string): Promise<ShortenResponse>
```

---

## 📡 API Reference

### Base URL

```
http://localhost:3001
```

### Endpoints

#### `POST /shorten`

Cria uma URL curta.

**Request:**
```json
{
  "url": "https://example.com/very-long-url"
}
```

**Response (201 Created):**
```json
{
  "shortCode": "aB3dE5f",
  "shortUrl": "http://localhost:3001/aB3dE5f",
  "longUrl": "https://example.com/very-long-url"
}
```

**Errors:**
| Status | Motivo |
|--------|--------|
| 400 | URL inválida ou vazia |
| 400 | Protocolo não permitido |
| 429 | Rate limit excedido |
| 500 | Erro interno |

---

#### `GET /:shortCode`

Redireciona para a URL original.

**Response:** 
- `301 Moved Permanently` → Redirect para URL original

**Errors:**
| Status | Motivo |
|--------|--------|
| 400 | Código inválido (não é 7 chars Base62) |
| 404 | URL não encontrada |

---

#### `GET /api/:shortCode`

Retorna informações da URL sem redirecionar.

**Response (200 OK):**
```json
{
  "shortCode": "aB3dE5f",
  "longUrl": "https://example.com/very-long-url",
  "createdAt": "2026-01-06T17:00:00.000Z"
}
```

---

#### `GET /health`

Health check do servidor.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-06T17:00:00.000Z"
}
```

---

## 🗄️ Banco de Dados

### Schema Prisma

```prisma
model Url {
  id        BigInt   @id @default(autoincrement())
  shortCode String   @unique @map("short_code") @db.Char(7)
  longUrl   String   @map("long_url") @db.Text
  createdAt DateTime @default(now()) @map("created_at")

  @@index([shortCode])
  @@map("urls")
}
```

### DDL Equivalente

```sql
CREATE TABLE urls (
  id BIGSERIAL PRIMARY KEY,
  short_code CHAR(7) NOT NULL UNIQUE,
  long_url TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_urls_short_code ON urls(short_code);
```

### Docker Compose

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: encurtador-db
    environment:
      POSTGRES_USER: encurtador
      POSTGRES_PASSWORD: encurtador123
      POSTGRES_DB: encurtador
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
```

---

## 🔒 Segurança

| Camada | Proteção | Implementação |
|--------|----------|---------------|
| **Rate Limiting** | DDoS/Spam | `@fastify/rate-limit` - 100 req/min por IP |
| **Validação de URL** | URLs maliciosas | Zod + blocklist de protocolos |
| **Headers HTTP** | XSS, Clickjacking | `@fastify/helmet` |
| **CORS** | Cross-origin | `@fastify/cors` com origins configuráveis |
| **Códigos Não-Sequenciais** | Enumeração | HashID + salt |
| **SQL Injection** | Injection attacks | Prisma ORM (parametrizado) |

### Exemplo de Configuração Segura

```bash
# .env (produção)
NODE_ENV=production
HASH_SALT=seu-salt-super-secreto-e-longo-aqui
CORS_ORIGIN=https://seu-dominio.com
RATE_LIMIT_MAX=50
```

---

## ⚙️ Configuração e Deploy

### Variáveis de Ambiente

```bash
# Servidor
NODE_ENV=development|production
PORT=3001
HOST=0.0.0.0

# Banco de Dados
DATABASE_URL="postgresql://user:pass@localhost:5432/db?schema=public"

# Segurança
HASH_SALT="seu-salt-secreto"
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=1 minute

# Logs
LOG_LEVEL=info|debug|error
```

### Setup Inicial

```bash
# Backend
cd backend
npm install
docker-compose up -d       # Inicia PostgreSQL
npm run db:push            # Aplica schema
npm run dev                # Inicia servidor

# Frontend
cd frontend
npm install
npm run dev                # Inicia Next.js
```

### Scripts Disponíveis

**Backend:**
| Script | Descrição |
|--------|-----------|
| `npm run dev` | Desenvolvimento com hot-reload |
| `npm run build` | Build de produção |
| `npm run start` | Inicia build de produção |
| `npm run test` | Testes unitários |
| `npm run test:integration` | Testes de integração |
| `npm run db:generate` | Gera Prisma Client |
| `npm run db:push` | Aplica schema no banco |
| `npm run db:studio` | Abre Prisma Studio |

**Frontend:**
| Script | Descrição |
|--------|-----------|
| `npm run dev` | Desenvolvimento |
| `npm run build` | Build de produção |
| `npm run test` | Testes unitários |

---

## 🧪 Testes

### Backend - Testes Unitários

Localizados em `backend/tests/unit/`:

| Arquivo | Cobertura |
|---------|-----------|
| `ShortCodeGenerator.test.ts` | Geração de códigos, validação |
| `UrlValidator.test.ts` | Validação de URLs, protocolos |
| `CreateShortUrlUseCase.test.ts` | Criação, colisão, reuso |
| `GetOriginalUrlUseCase.test.ts` | Busca, erros |

### Backend - Testes de Integração

Localizados em `backend/tests/integration/`:

| Arquivo | Cobertura |
|---------|-----------|
| `urlRoutes.integration.test.ts` | Rotas HTTP, fluxo completo |

### Frontend - Testes

| Arquivo | Cobertura |
|---------|-----------|
| `url-shortener-form.test.tsx` | Componente de formulário |

### Comandos

```bash
# Backend
cd backend
npm run test              # Unitários
npm run test:integration  # Integração

# Frontend
cd frontend
npm run test
```

---

## 🤖 Guia para LLMs

Esta seção é otimizada para assistentes de IA que precisam trabalhar com este codebase.

### Resumo Executivo

```yaml
tipo: URL Shortener
arquitetura: Clean Architecture
linguagem: TypeScript (strict)
frameworks:
  backend: Fastify
  frontend: Next.js (App Router)
banco: PostgreSQL via Prisma
testes: Vitest
```

### Arquivos-Chave para Modificações

| Tarefa | Arquivos |
|--------|----------|
| Nova rota API | `backend/src/presentation/routes/urlRoutes.ts` |
| Novo caso de uso | `backend/src/application/use-cases/` |
| Alterar validação | `backend/src/domain/validators/UrlValidator.ts` |
| Alterar schema DB | `backend/prisma/schema.prisma` |
| Novo componente UI | `frontend/src/components/` |
| Alterar chamada API | `frontend/src/services/api.ts` |
| Configuração | `backend/src/config.ts` |

### Padrões de Código

```typescript
// Casos de uso seguem este padrão:
export class NomeUseCase {
  constructor(private readonly deps: IDependencies) {}
  
  async execute(input: InputDTO): Promise<OutputDTO> {
    // 1. Validar input
    // 2. Executar lógica
    // 3. Retornar resultado
  }
}

// Controllers seguem este padrão:
async metodo(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    const result = await this.useCase.execute(input);
    await reply.code(200).send(result);
  } catch (error) {
    this.handleError(error, reply);
  }
}
```

### Erros Customizados

```typescript
// Disponíveis em application/dtos/index.ts
InvalidUrlError       // URL malformada
UrlNotFoundError      // 404
ValidationException   // Validação falhou
CollisionError        // Colisão de short code
```

### Fluxo de Adição de Feature

1. **Novo endpoint:**
   - Criar DTO em `application/dtos/`
   - Criar UseCase em `application/use-cases/`
   - Adicionar método no Controller
   - Registrar rota em `presentation/routes/`
   - Adicionar testes

2. **Nova validação:**
   - Modificar schema Zod em `domain/validators/`
   - Adicionar testes

3. **Nova feature UI:**
   - Criar componente em `frontend/src/components/`
   - Importar na página desejada
   - Adicionar testes

### Comandos Úteis para Debug

```bash
# Ver logs do banco
docker logs encurtador-db -f

# Abrir Prisma Studio (UI do banco)
cd backend && npm run db:studio

# Testar API rapidamente
curl -X POST http://localhost:3001/shorten \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

---

## 📄 Licença

MIT License

---

*Documentação gerada automaticamente para o projeto Encurtador de URLs.*
