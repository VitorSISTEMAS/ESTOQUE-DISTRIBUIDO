# Plataforma de Controle de Estoque Distribuido

Projeto academico de Arquitetura de Software demonstrando microservicos, CQRS, EDA com RabbitMQ, arquitetura hexagonal, React, Node.js, Prisma, PostgreSQL e Docker Compose.

## Como Executar

```bash
docker compose up --build
```

URLs:

- Frontend: http://localhost:5173
- Command Service: http://localhost:3001/health
- Query Service: http://localhost:3002/health
- Sync Service: http://localhost:3003/health
- RabbitMQ Management: http://localhost:15672
- PostgreSQL exposto no host: localhost:5433

Credenciais do RabbitMQ:

```text
usuario: guest
senha: guest
```

## Arquitetura

```text
Frontend React
  | REST
  v
inventory-command-service ---> inventory_write_db
  |
  | AMQP / eventos
  v
RabbitMQ
  |
  v
inventory-sync-service -----> inventory_read_db
  ^
  |
inventory-query-service
  ^
  | REST
Frontend React
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

## CQRS

CQRS separa comandos e consultas.

Comandos alteram estado:

- cadastrar produto
- adicionar estoque
- registrar venda
- transferir estoque

Consultas apenas leem dados:

- produtos
- estoque por filial
- movimentacoes
- eventos processados

No projeto, essa separacao e reforcada por dois bancos:

- `inventory_write_db`
- `inventory_read_db`

## EDA com RabbitMQ

Quando o command-service muda o estado, ele publica um evento no RabbitMQ. O sync-service consome esse evento e atualiza o banco de leitura.

Exchange:

```text
inventory.events
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

## Fluxo de Demonstracao

1. Subir o ambiente com `docker compose up --build`.
2. Abrir o frontend em http://localhost:5173.
3. Cadastrar um produto.
4. Ver o evento `PRODUCT_CREATED` no RabbitMQ e na tela.
5. Adicionar estoque para uma filial.
6. Registrar uma venda.
7. Transferir estoque entre filiais.
8. Mostrar que o banco de escrita recebe comandos e o banco de leitura e atualizado pelo sync-service.

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

Decidimos usar `inventory_write_db` e `inventory_read_db` para tornar a separacao CQRS visivel na implementacao.

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
