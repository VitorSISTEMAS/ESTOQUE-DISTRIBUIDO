# AGENTS.md - Instruções para Agentes de IA

## Projeto: Plataforma de Controle de Estoque Distribuído

### Stack
- **Backend**: Node.js 18+, Express 4, JavaScript (ES Modules, `"type": "module"`)
- **ORM**: Prisma 5
- **Banco**: PostgreSQL 16 (dois bancos: `inventory_write_db` e `inventory_read_db`)
- **Mensageria**: RabbitMQ via `amqplib`
- **Frontend**: React 18, Vite 6, Axios
- **Infra**: Docker Compose

### Arquitetura
```
Frontend React → inventory-command-service (3001) → inventory_write_db
                                                    ↓ RabbitMQ
                                               inventory-sync-service (3003) → inventory_read_db
                                                                                 ↑
                                          Frontend React → inventory-query-service (3002)
```

- **Hexagonal**: `domain/entities` → `application/use-cases` + `application/ports` → `adapters/in/http` + `adapters/out/database` + `adapters/out/messaging` + `config`
- **CQRS**: escrita no command-service (banco `inventory_write_db`), leitura no query-service (banco `inventory_read_db`)
- **EDA**: eventos publicados via RabbitMQ pelo command-service, consumidos pelo sync-service

### Microserviços

| Serviço | Porta | Propósito |
|---|---|---|
| `inventory-command-service` | 3001 | Escrita (POST), validação, publicação de eventos |
| `inventory-query-service` | 3002 | Leitura (GET), consulta ao read model |
| `inventory-sync-service` | 3003 | Consome eventos do RabbitMQ e sincroniza o read model |

### Endpoints

**Command (3001):**
- `GET /health`
- `POST /products` - criar produto
- `POST /stock/in` - adicionar estoque
- `POST /sales` - registrar venda
- `POST /transfers` - transferir estoque entre filiais

**Query (3002):**
- `GET /health`
- `GET /products`, `GET /stock`, `GET /stock/:branch`, `GET /movements`, `GET /events`

### Eventos (RabbitMQ)
- Exchange: `inventory.events` (topic)
- Queue: `inventory.sync.queue`
- Routing keys: `product.created`, `stock.added`, `sale.completed`, `stock.transferred`

### Variáveis de Ambiente
```env
PORT=3001
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/inventory_write_db?schema=public
RABBITMQ_URL=amqp://guest:guest@localhost:5672
RABBITMQ_EXCHANGE=inventory.events
CORS_ORIGIN=http://localhost:5173
```

### Como Executar
```bash
# Tudo com Docker
docker compose up --build

# Individual (precisa de PostgreSQL e RabbitMQ rodando)
# Command
cd inventory-command-service && npm start
# Query
cd inventory-query-service && npm start
# Sync
cd inventory-sync-service && npm start
# Frontend
cd frontend && npm run dev
```

### URLs
- Frontend: http://localhost:5173
- Command: http://localhost:3001
- Query: http://localhost:3002
- Sync: http://localhost:3003
- RabbitMQ Management: http://localhost:15672 (guest/guest)
- PostgreSQL: localhost:5433 (postgres/postgres)

### Convenções de Código

**Geral:**
- ES Modules (`import`/`export`), sem TypeScript
- `snake_case` em nomes de banco de dados
- `camelCase` em código JavaScript
- `PascalCase` para classes
- Arquivos com sufixo descritivo: `productController.js`, `CreateProductUseCase.js`, `prismaProductRepository.js`
- Sem pontos e vírgula no final das linhas
- Strings em português nas mensagens para o usuário; código e logs em inglês

**Estrutura de cada serviço:**
```
src/
  config/
    env.js              # variáveis de ambiente
    container.js        # DI container (instancia use-cases com repositórios)
  domain/
    entities/           # classes do domínio (Product, Stock, StockMovement)
    errors/             # erros de domínio (InsufficientStockError)
  application/
    use-cases/          # caso de uso = 1 classe (CreateProductUseCase, etc.)
    ports/              # interfaces/contratos (ProductRepositoryPort, etc.)
  adapters/
    in/http/            # controllers Express (1 arquivo por recurso)
    out/database/       # implementações Prisma dos repositórios
    out/messaging/      # publisher/consumer RabbitMQ
  routes.js             # definição de rotas Express
  server.js             # bootstrap do Express
```

**Controllers:**
```js
import { container } from "../../../config/container.js";

export async function createProduct(req, res, next) {
  try {
    const product = await container.createProductUseCase.execute(req.body);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
}
```

**Use Cases:**
- 1 classe por caso de uso
- Recebe repositórios/portas no constructor
- Método `execute(input)` assíncrono
- Publica evento após sucesso

**Entities:**
- Classe com constructor que valida e define propriedades
- Sem métodos de negócio (apenas estrutura de dados)

**Error handling:**
- Erros são propagados com `next(error)` para o middleware global em `server.js`
- `error.statusCode` para códigos HTTP customizados
- `InsufficientStockError` para saldo insuficiente

**Repositórios (Prisma):**
- Implementam os métodos definidos na porta correspondente
- Usam `prismaClient.js` compartilhado que instancia `PrismaClient`

### Comandos Úteis
```bash
# Instalar dependências de um serviço
cd inventory-command-service && npm install

# Aplicar schema Prisma ao banco
cd inventory-command-service && npm run prisma:push

# Rodar em modo dev (com watch)
cd inventory-command-service && npm run dev
```

### Schema do Banco
- `inventory_write_db`: Product, Stock, StockMovement
- `inventory_read_db`: ProductReadModel, StockReadModel, MovementReadModel, ProcessedEvent
