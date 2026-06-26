# AGENTS.md - Instruções para Agentes de IA

## Projeto: Plataforma de Controle de Estoque Distribuído

### Stack
- **Backend**: Node.js 18+, Express 4, TypeScript 5 (ES Modules, `"type": "module"`)
- **Runtime TS**: `tsx` (execução direta, sem build step)
- **ORM**: Prisma 5
- **Banco**: PostgreSQL 16 (dois bancos: `inventory_write_db` e `inventory_read_db` em instâncias separadas no Swarm)
- **Mensageria**: RabbitMQ via `amqplib`
- **Monitoria**: Prometheus + Grafana (via Docker)
- **Frontend**: React 18, Vite 6, Axios
- **Infra**: Docker Compose + Docker Swarm (`docker-stack.yml`)

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

**Docker Compose (desenvolvimento local):**
```bash
docker compose up --build
```

**Docker Swarm (produção/distribuído):**
```bash
# Build + Deploy (com seed opcional)
./deploy-swarm.sh
./deploy-swarm.sh inventory --seed

# Ou manualmente
docker compose -f docker-stack.yml build
docker stack deploy -c docker-stack.yml inventory

# Escalar serviço
docker service scale inventory_inventory-command-service=3

# Logs
docker service logs inventory_inventory-command-service -f

# Remover
docker stack rm inventory
```

**Individual (precisa de PostgreSQL e RabbitMQ rodando):**
```bash
cd inventory-command-service && npm start
cd inventory-query-service && npm start
cd inventory-sync-service && npm start
cd frontend && npm run dev
```

### URLs
- Frontend: http://localhost:5173
- Command: http://localhost:3001
- Query: http://localhost:3002
- Sync: http://localhost:3003
- RabbitMQ Management: http://localhost:15672 (guest/guest)
- PostgreSQL: localhost:5433 (postgres/postgres)
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3000 (admin/admin)


### Monitoria (Prometheus + Grafana)

**Arquitetura:**
```
inventory-command-service:3001/metrics ─┐
inventory-query-service:3002/metrics  ──┤── Prometheus (scrape a cada 5s) ── Grafana (dashboard)
inventory-sync-service:3003/metrics   ──┘
```

**Métricas expostas por cada serviço (`GET /metrics`):**
- `http_requests_total` (counter) — total de requisições por method/route/status
- `http_request_duration_seconds` (histogram) — latência em buckets de 0.01s a 10s
- `process_*` (default metrics) — CPU, memória, event loop lag, etc.

**Implementação (mantendo hexagonal):**
- `adapters/out/monitoring/prometheusMetrics.ts` — registry + definição das métricas (adapter de saída)
- `adapters/in/http/metricsMiddleware.ts` — middleware Express que coleta duration e total (adapter de entrada)
- Rota `/metrics` registrada no `server.ts` de cada serviço

**Infraestrutura:**

| Arquivo | Propósito |
|---|---|
| `infra/prometheus/prometheus.yml` | Config do Prometheus (scrape targets, intervalo 5s) |
| `infra/grafana/datasources/datasource.yml` | Datasource Prometheus provisionado |
| `infra/grafana/dashboards/dashboard.yml` | Provider de dashboards automáticos |
| `infra/grafana/dashboards/inventory-dashboard.json` | Dashboard "Inventory - Visão Geral" |

**Dashboard provisionado (inventory-dashboard.json):**
- Requisições por segundo (`rate(http_requests_total[1m])`)
- Latência P95 (`histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[1m]))`)
- Códigos de status (2xx, 4xx, 5xx)
- Health check (`up` job do Prometheus)

**Populando dados para teste:**
```bash
./infra/seed-metrics.sh
```
Cria 12 produtos, ~2600 unidades de estoque, 16 vendas e 5 transferências entre as 3 filiais.

**Queries úteis no Grafana:**
```promql
# Taxa de requisições por serviço
rate(http_requests_total[1m])

# Latência P99
histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[1m]))

# Erros 5xx por serviço
rate(http_requests_total{status_code=~"5.."}[1m])

# Taxa de falha (% de 5xx sobre o total)
rate(http_requests_total{status_code=~"5.."}[1m]) / rate(http_requests_total[1m]) * 100

# Top rotas mais lentas
topk(5, avg by (route) (http_request_duration_seconds_sum / http_request_duration_seconds_count))

# Contagem absoluta de erros 5xx nas últimas 5min
increase(http_requests_total{status_code=~"5.."}[5m])
```

### Convenções de Código

**Geral:**
- TypeScript (ES Modules), extensão `.ts`, imports com `.js` (resolvido pelo bundler moduleResolution)
- `snake_case` em nomes de banco de dados
- `camelCase` em código JavaScript
- `PascalCase` para classes e interfaces
- Arquivos com sufixo descritivo: `productController.ts`, `CreateProductUseCase.ts`, `prismaProductRepository.ts`
- Sem pontos e vírgula no final das linhas
- Strings em português nas mensagens para o usuário; código e logs em inglês
- Portas (contracts) são `interface`; use-cases tipam constructor com interfaces
- Controllers usam `Request`, `Response`, `NextFunction` do Express

**Estrutura de cada serviço:**
```
src/
  config/
    env.ts              # variáveis de ambiente
    container.ts        # DI container (instancia use-cases com repositórios)
  domain/
    entities/           # classes do domínio (Product, Stock, StockMovement)
    errors/             # erros de domínio (InsufficientStockError)
  application/
    use-cases/          # caso de uso = 1 classe (CreateProductUseCase, etc.)
    ports/              # interfaces/contratos (ProductRepositoryPort, etc.)
  adapters/
    in/http/            # controllers Express (1 arquivo por recurso) + routes.ts
    out/database/       # implementações Prisma dos repositórios
    out/messaging/      # publisher/consumer RabbitMQ
  server.ts             # bootstrap do Express
```

**Controllers:**
```ts
import { Request, Response, NextFunction } from "express"

export function createProduct(createProductUseCase: CreateProductUseCase) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      const product = await createProductUseCase.execute(req.body)
      res.status(201).json(product)
    } catch (error) {
      next(error)
    }
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

# Verificar tipos TypeScript
cd inventory-command-service && npm run typecheck
```

### Schema do Banco
- `inventory_write_db`: Product, Stock, StockMovement
- `inventory_read_db`: ProductReadModel, StockReadModel, MovementReadModel, ProcessedEvent
