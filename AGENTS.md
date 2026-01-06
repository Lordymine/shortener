# 🤖 AGENTS.md - Guia para AI Assistants

> Este arquivo contém instruções específicas para LLMs e AI Assistants que trabalharão neste codebase.

---

## 📋 Resumo do Projeto

```yaml
nome: Encurtador de URLs
tipo: Full-Stack Web Application
arquitetura: Clean Architecture
linguagem: TypeScript (strict mode)
framework_backend: Fastify v4
framework_frontend: Next.js 16 (App Router)
orm: Prisma
banco: PostgreSQL 16
testes: Vitest
estilo: Tailwind CSS v4 + Shadcn UI
```

---

## 🗂️ Estrutura de Arquivos

### Backend (`/backend`)

```
src/
├── domain/                    # 🎯 CORE - Regras de negócio puras
│   ├── entities/
│   │   └── Url.ts            # Interface da entidade URL
│   ├── services/
│   │   └── ShortCodeGenerator.ts  # Geração de códigos Base62
│   ├── validators/
│   │   └── UrlValidator.ts   # Schemas Zod para validação
│   └── repositories/
│       └── IUrlRepository.ts # Interface do repositório (contrato)
│
├── application/               # 🔄 Casos de uso / Orquestração
│   ├── use-cases/
│   │   ├── CreateShortUrl.ts # Criação de URL curta
│   │   └── GetOriginalUrl.ts # Busca de URL original
│   └── dtos/
│       └── index.ts          # DTOs + Errors customizados
│
├── infrastructure/            # 🔌 Implementações concretas
│   ├── repositories/
│   │   └── PrismaUrlRepository.ts  # Implementação com Prisma
│   └── database/
│       └── prisma.ts         # Cliente Prisma singleton
│
├── presentation/              # 🌐 Interface HTTP
│   ├── controllers/
│   │   └── UrlController.ts  # Handler de requisições
│   └── routes/
│       └── urlRoutes.ts      # Definição de rotas Fastify
│
├── config.ts                  # Configurações (env vars)
└── server.ts                  # Bootstrap do servidor
```

### Frontend (`/frontend`)

```
src/
├── app/                       # 📄 App Router (Next.js)
│   ├── page.tsx              # Página principal
│   ├── layout.tsx            # Layout root
│   └── globals.css           # Estilos globais
│
├── components/                # 🧩 Componentes React
│   ├── url-shortener-form.tsx # Formulário principal
│   ├── url-result.tsx        # Exibição do resultado
│   ├── features-section.tsx  # Seção de features
│   ├── mobile-nav.tsx        # Navegação mobile
│   └── ui/                   # Componentes Shadcn
│
└── services/
    └── api.ts                # Cliente HTTP para backend
```

---

## 🔑 Arquivos Críticos

| Arquivo | Importância | Cuidados |
|---------|-------------|----------|
| `backend/src/domain/services/ShortCodeGenerator.ts` | ⚠️ CRÍTICO | Algoritmo de geração de códigos - qualquer mudança pode quebrar URLs existentes |
| `backend/prisma/schema.prisma` | ⚠️ CRÍTICO | Schema do banco - mudanças requerem migration |
| `backend/src/config.ts` | IMPORTANTE | Todas as variáveis de ambiente |
| `backend/src/application/dtos/index.ts` | IMPORTANTE | Erros customizados usados em todo o app |
| `frontend/src/services/api.ts` | IMPORTANTE | Comunicação com backend |

---

## 🎯 Padrões de Código

### Casos de Uso

```typescript
// Padrão obrigatório para casos de uso
export class NomeDoUseCase {
  constructor(
    private readonly repository: IRepository,
    private readonly service: Service,
  ) {}

  async execute(input: InputDTO): Promise<OutputDTO> {
    // 1. Validar input
    // 2. Aplicar regras de negócio
    // 3. Persistir se necessário
    // 4. Retornar resultado tipado
  }
}
```

### Controllers

```typescript
// Padrão obrigatório para controllers
async metodo(
  request: FastifyRequest, 
  reply: FastifyReply
): Promise<void> {
  try {
    const input = request.body as InputType;
    const result = await this.useCase.execute(input);
    await reply.code(200).send(result);
  } catch (error) {
    this.handleError(error, reply);
  }
}
```

### Componentes React

```typescript
// Padrão para componentes
'use client' // Se usar hooks/estado

interface ComponentProps {
  prop: PropType;
}

export function ComponentName({ prop }: ComponentProps) {
  // hooks primeiro
  const [state, setState] = useState();
  
  // handlers
  const handleAction = () => {};
  
  // render
  return <div>...</div>;
}
```

---

## ⚠️ Regras Importantes

### DO ✅

1. **Sempre validar inputs** com Zod antes de processar
2. **Usar tipos explícitos** - evitar `any`
3. **Manter separação de camadas** - domain não importa de infrastructure
4. **Adicionar testes** para novas features
5. **Usar erros customizados** de `application/dtos`
6. **Documentar funções públicas** com JSDoc

### DON'T ❌

1. **Não modificar** `ShortCodeGenerator` sem entender o impacto
2. **Não expor** detalhes internos de erro para o cliente
3. **Não fazer** queries diretas ao Prisma fora do repositório
4. **Não ignorar** erros - sempre tratar ou propagar
5. **Não hardcodar** valores - usar `config.ts`

---

## 🔧 Comandos Úteis

```bash
# Backend
cd backend
npm run dev                    # Dev server
npm run test                   # Testes unitários
npm run test:integration       # Testes de integração
npm run db:studio              # UI do banco (Prisma Studio)
npm run db:push                # Aplicar schema
npm run lint:fix               # Corrigir lint

# Frontend
cd frontend
npm run dev                    # Dev server
npm run test                   # Testes
npm run build                  # Build produção
```

---

## 📝 Checklist para Novas Features

### Nova Rota API

- [ ] Criar DTO em `application/dtos/index.ts`
- [ ] Criar UseCase em `application/use-cases/`
- [ ] Adicionar método no `UrlController`
- [ ] Registrar rota em `presentation/routes/urlRoutes.ts`
- [ ] Adicionar testes unitários
- [ ] Adicionar testes de integração
- [ ] Atualizar documentação

### Novo Componente UI

- [ ] Criar em `frontend/src/components/`
- [ ] Usar Tailwind CSS + variáveis do projeto
- [ ] Garantir responsividade
- [ ] Adicionar testes
- [ ] Importar na página desejada

### Alteração no Schema

- [ ] Modificar `prisma/schema.prisma`
- [ ] Rodar `npm run db:generate`
- [ ] Criar migration se necessário
- [ ] Atualizar entidade em `domain/entities/`
- [ ] Atualizar repositório
- [ ] Atualizar testes

---

## 🎨 Sistema de Design

### Cores do Projeto

```css
/* Definidas em globals.css */
--brand-navy: #0b1736;
--brand-light-navy: #1a2744;
--brand-blue: #2a5bd7;
--brand-orange: #f97316;
```

### Componentes Shadcn Disponíveis

- `Button` - Botões com variants
- `Input` - Campos de entrada
- `Dialog` - Modais
- `Sonner` - Toasts/Notificações

---

## 🧪 Exemplos de Testes

### Teste Unitário (UseCase)

```typescript
import { describe, it, expect, vi } from 'vitest';
import { CreateShortUrlUseCase } from './CreateShortUrl';

describe('CreateShortUrlUseCase', () => {
  it('should create shortened URL', async () => {
    const mockRepo = { save: vi.fn(), findByLongUrl: vi.fn() };
    const mockGenerator = { generate: vi.fn().mockReturnValue('abc1234') };
    
    const useCase = new CreateShortUrlUseCase(mockRepo, mockGenerator, 'http://localhost');
    
    const result = await useCase.execute({ url: 'https://example.com' });
    
    expect(result.shortCode).toBe('abc1234');
  });
});
```

### Teste de Componente (React)

```typescript
import { render, screen } from '@testing-library/react';
import { UrlResult } from './url-result';

describe('UrlResult', () => {
  it('displays shortened URL', () => {
    render(<UrlResult shortUrl="http://localhost/abc123" />);
    expect(screen.getByDisplayValue('http://localhost/abc123')).toBeInTheDocument();
  });
});
```

---

## 📚 Referências Rápidas

### Endpoints da API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/shorten` | Criar URL curta |
| GET | `/:shortCode` | Redirecionar |
| GET | `/api/:shortCode` | Info da URL |
| GET | `/health` | Health check |

### Erros Customizados

```typescript
InvalidUrlError       // URL inválida (400)
UrlNotFoundError      // URL não encontrada (404)
ValidationException   // Falha de validação (400)
CollisionError        // Colisão de código (interno)
```

### Variáveis de Ambiente Importantes

```env
DATABASE_URL          # Conexão PostgreSQL
HASH_SALT             # Salt para HashID
CORS_ORIGIN           # Origins permitidas
RATE_LIMIT_MAX        # Limite de requisições
```

---

## 💡 Dicas de Debug

1. **Verificar logs do servidor:** Fastify loga automaticamente
2. **Prisma Studio:** `npm run db:studio` para ver dados
3. **Testar API:** Use curl ou Thunder Client
4. **Verificar tipos:** `npx tsc --noEmit`

---

*Este arquivo deve ser atualizado sempre que houver mudanças significativas na arquitetura ou padrões do projeto.*
