# Plataforma de Controle de Estoque Distribuido

Projeto academico de Arquitetura de Software demonstrando microservicos, CQRS, EDA com RabbitMQ, arquitetura hexagonal, React, Node.js, Prisma, PostgreSQL e Docker Swarm.

## Como Executar

### Docker Compose (desenvolvimento local)

```bash
docker compose up --build
```

### Docker Swarm (produção/distribuído)

```bash
# Build + Deploy
./deploy-swarm.sh

# Com seed de dados
./deploy-swarm.sh inventory --seed
```

### URLs

| Serviço | URL | Credenciais |
|---|---|---|
| Frontend | http://localhost:5173 | - |
| Command Service | http://localhost:3001 | - |
| Query Service | http://localhost:3002 | - |
| RabbitMQ Management | http://localhost:15672 | guest/guest |
| Prometheus | http://localhost:9090 | - |
| Grafana | http://localhost:3000 | admin/admin |

## Arquitetura

```text
Frontend React
  | REST
  v
inventory-command-service ---> postgres-write (inventory_write_db)
  |
  | AMQP / eventos
  v
RabbitMQ
  |
  v
inventory-sync-service -----> postgres-read (inventory_read_db)
  ^
  |
inventory-query-service
  ^
  | REST
Frontend React
```

### CQRS

- **Command side**: `inventory-command-service` → `postgres-write` (banco de escrita)
- **Query side**: `inventory-query-service` → `postgres-read` (banco de leitura)
- **Sync side**: `inventory-sync-service` consome eventos e sincroniza os bancos

Dois bancos PostgreSQL separados fisicamente (`postgres-write` e `postgres-read`) no Swarm, cada um com seu próprio volume.

## Docker Swarm

### Stack (`docker-stack.yml`)

| Serviço | Réplicas | Porta | Banco |
|---|---|---|---|
| postgres-write | 1 | - | inventory_write_db |
| postgres-read | 1 | - | inventory_read_db |
| rabbitmq | 1 | 15672 | - |
| inventory-command-service | 1 (escalável) | 3001 | postgres-write |
| inventory-query-service | 1 (escalável) | 3002 | postgres-read |
| inventory-sync-service | 1 | - | postgres-read |
| frontend | 1 | 5173 | - |
| prometheus | 1 | 9090 | - |
| grafana | 1 | 3000 | - |

### Comandos Swarm

```bash
# Escalar serviços
docker service scale inventory_inventory-command-service=3

# Logs
docker service logs inventory_inventory-command-service -f

# Listar serviços
docker stack services inventory

# Remover stack
docker stack rm inventory
```

### Script de Deploy (`deploy-swarm.sh`)

- Remove stack antigo automaticamente
- Build condicional (só rebuilda se houve mudanças nos fontes, Dockerfiles ou docker-stack.yml)
- Aguarda todos os serviços ficarem saudáveis (healthcheck)
- Flag `--seed` para popular dados de exemplo

```bash
./deploy-swarm.sh                # deploy sem seed
./deploy-swarm.sh inventory      # stack com nome customizado
./deploy-swarm.sh inventory --seed  # deploy + seed
```

## Microservicos

### inventory-command-service

Responsavel pelas operacoes de escrita:

- `POST /products`
- `POST /stock/in`
- `POST /sales`
- `POST /transfers`

Esse servico valida regras de negocio, grava no `inventory_write_db` e publica eventos no RabbitMQ.

Eventos publicados:

- `PRODUCT_CREATED`
- `STOCK_ADDED`
- `SALE_COMPLETED`
- `STOCK_TRANSFERRED`

### inventory-query-service

Responsavel pelas operacoes de leitura:

- `GET /products`
- `GET /stock`
- `GET /stock/:branch`
- `GET /movements`
- `GET /events`

Esse servico le apenas o `inventory_read_db`, que funciona como read model do CQRS.

### inventory-sync-service

Responsavel por consumir eventos do RabbitMQ e atualizar o banco de leitura.

Ele tambem registra eventos processados na tabela `ProcessedEvent`, permitindo demonstrar idempotencia.

## EDA com RabbitMQ

Quando o command-service muda o estado, ele publica um evento no RabbitMQ. O sync-service consome esse evento e atualiza o banco de leitura.

Exchange:

```text
inventory.events (topic)
```

Fila:

```text
inventory.sync.queue
```

Routing keys:

- `product.created`
- `stock.added`
- `sale.completed`
- `stock.transferred`

## Arquitetura Hexagonal

Cada servico separa:

- `domain`: entidades, regras e erros de dominio.
- `application`: casos de uso e portas.
- `adapters`: REST, Prisma e RabbitMQ.
- `config`: variaveis de ambiente e injecao de dependencias.

O dominio nao depende diretamente de Express, Prisma, PostgreSQL ou RabbitMQ.

## Monitoria (Prometheus + Grafana)

```
inventory-command-service:3001/metrics ─┐
inventory-query-service:3002/metrics  ──┤── Prometheus ── Grafana
inventory-sync-service:3003/metrics   ──┘
```

**Métricas expostas:**
- `http_requests_total` — total de requisições por method/route/status
- `http_request_duration_seconds` — latência em buckets de 0.01s a 10s
- `process_*` — CPU, memória, event loop lag

**Populando dados para teste:**
```bash
bash infra/seed-metrics.sh
```

Cria 12 produtos, ~2600 unidades de estoque, 16 vendas e 5 transferências entre 3 filiais.

## Fluxo de Demonstracao

1. Subir o ambiente com `./deploy-swarm.sh inventory --seed`.
2. Abrir o frontend em http://localhost:5173.
3. Cadastrar um produto.
4. Ver o evento `PRODUCT_CREATED` no RabbitMQ e na tela.
5. Adicionar estoque para uma filial.
6. Registrar uma venda.
7. Transferir estoque entre filiais.
8. Mostrar que o banco de escrita recebe comandos e o banco de leitura e atualizado pelo sync-service.
9. Acessar Grafana em http://localhost:3000 (admin/admin) para visualizar metricas.

## ADRs Resumidas

### ADR 001 - Microservicos
Decidimos usar tres microservicos para demonstrar separacao de responsabilidades, baixo acoplamento e comunicacao distribuida.

### ADR 002 - CQRS
Decidimos separar escrita e leitura para deixar comandos com regras de negocio claras e consultas otimizadas para o frontend.

### ADR 003 - RabbitMQ
Decidimos usar RabbitMQ para demonstrar EDA, mensageria AMQP, filas duraveis e processamento assincrono.

### ADR 004 - Arquitetura Hexagonal
Decidimos isolar o dominio de tecnologias externas, facilitando manutencao, testes e troca de infraestrutura.

### ADR 005 - Dois Bancos PostgreSQL
Decidimos usar `inventory_write_db` e `inventory_read_db` para tornar a separacao CQRS visivel na implementacao. No Swarm, cada banco roda em um container PostgreSQL independente.

## Perguntas Provaveis

**Por que nao usar monolito?**
Porque o objetivo academico e demonstrar microservicos, EDA, CQRS e sincronizacao entre servicos. Para um sistema pequeno real, um monolito modular poderia ser suficiente.

**O que impede estoque negativo?**
O command-service verifica o estoque disponivel antes de venda ou transferencia.

**O que acontece se o sync-service cair?**
Os eventos permanecem na fila do RabbitMQ e podem ser processados quando o servico voltar.

**Por que existe consistencia eventual?**
Porque a escrita acontece primeiro no banco operacional e a leitura e atualizada depois por evento.

**Como evitar evento duplicado?**
O sync-service consulta a tabela `ProcessedEvent` antes de processar um evento.
