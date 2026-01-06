# 🔗 Shortener - Sistema de Encurtamento de URLs

[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue.svg)](https://www.typescriptlang.org/)
[![Fastify](https://img.shields.io/badge/Fastify-4.28-000000.svg)](https://www.fastify.io/)
[![Next.js](https://img.shields.io/badge/Next.js-16.1-black.svg)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791.svg)](https://www.postgresql.org/)

Sistema de encurtamento de URLs projetado para **alta escala**, com arquitetura limpa e foco em performance.

![Shortener Preview](frontend/public/preview.png)

---

## ✨ Features

- ⚡ **Alta Performance** - Fastify + PostgreSQL otimizado
- 🔐 **Seguro** - Rate limiting, validação de URLs, headers seguros
- 🎯 **Códigos Únicos** - 7 caracteres Base62 (3.5 trilhões de combinações)
- 📱 **Responsivo** - Interface moderna com Tailwind CSS
- 🧪 **Testado** - Testes unitários e de integração

---

## 🚀 Quick Start

### Pré-requisitos

- Node.js ≥ 20.0.0
- Docker & Docker Compose
- npm ou yarn

### 1. Clone e configure

```bash
git clone https://github.com/seu-usuario/encurtador.git
cd encurtador
```

### 2. Inicie o banco de dados

```bash
cd backend
docker-compose up -d
```

### 3. Configure e inicie o backend

```bash
cd backend
cp .env.example .env
npm install
npm run db:push
npm run dev
```

### 4. Inicie o frontend

```bash
cd frontend
npm install
npm run dev
```

### 5. Acesse

- **Frontend:** http://localhost:3000
- **API:** http://localhost:3001
- **Health Check:** http://localhost:3001/health

---

## 📡 API

### Encurtar URL

```bash
curl -X POST http://localhost:3001/shorten \
  -H "Content-Type: application/json" \
  -d '{"url":"https://exemplo.com/url-muito-longa"}'
```

**Resposta:**
```json
{
  "shortCode": "aB3dE5f",
  "shortUrl": "http://localhost:3001/aB3dE5f",
  "longUrl": "https://exemplo.com/url-muito-longa"
}
```

### Redirecionar

```bash
curl -I http://localhost:3001/aB3dE5f
# 301 Redirect → URL original
```

### Obter Info

```bash
curl http://localhost:3001/api/aB3dE5f
```

---

## 🏗️ Arquitetura

```
encurtador/
├── backend/           # API Fastify + Prisma
│   ├── src/
│   │   ├── domain/           # Entidades, serviços, validação
│   │   ├── application/      # Casos de uso
│   │   ├── infrastructure/   # Repositórios, database
│   │   └── presentation/     # Controllers, rotas
│   └── tests/
│
├── frontend/          # Next.js + React
│   ├── src/
│   │   ├── app/              # App Router
│   │   ├── components/       # Componentes React
│   │   └── services/         # Cliente API
│   └── tests/
│
└── DOCUMENTATION.md   # Documentação completa
```

---

## 🧪 Testes

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

## 📚 Documentação

Para documentação detalhada, incluindo:
- Arquitetura completa
- Referência da API
- Guia de segurança
- Configuração de produção
- **Guia para LLMs**

Consulte: **[DOCUMENTATION.md](./DOCUMENTATION.md)**

---

## 🛠️ Stack

| Backend | Frontend |
|---------|----------|
| Fastify | Next.js 16 |
| TypeScript 5 | React 19 |
| Prisma ORM | Tailwind CSS v4 |
| PostgreSQL 16 | Shadcn UI |
| Zod | Lucide Icons |
| Vitest | Vitest |

---

## 📝 Licença

MIT - veja [LICENSE](LICENSE) para detalhes.

---

Feito com ❤️ para alta escala.
