# Documentacao do Projeto

# Plataforma de Controle de Estoque Distribuido

Este projeto simula uma empresa com varias filiais que precisa controlar estoque de forma distribuida.

As filiais usadas no sistema sao:

- Taquara
- Porto Alegre
- Novo Hamburgo

O sistema permite:

- cadastrar produtos;
- adicionar estoque em uma filial;
- registrar vendas;
- transferir estoque entre filiais;
- consultar produtos;
- consultar estoque por filial;
- consultar movimentacoes;
- consultar eventos processados.

A ideia principal do projeto e demonstrar uma arquitetura moderna usando:

- microservicos;
- CQRS;
- EDA com RabbitMQ;
- arquitetura hexagonal;
- PostgreSQL;
- Docker Compose;
- frontend React.

---

# 1. Visao Geral

O sistema e dividido em tres microservicos principais:

```text
inventory-command-service
inventory-query-service
inventory-sync-service
```

Tambem existem servicos de infraestrutura:

```text
frontend
postgres
rabbitmq
```

O usuario interage com o frontend. O frontend chama APIs REST dos microservicos.

As operacoes que alteram dados vao para o `inventory-command-service`.

As operacoes de consulta vao para o `inventory-query-service`.

Os eventos sao enviados pelo command-service para o RabbitMQ.

O sync-service escuta esses eventos e atualiza o banco de leitura.

---

# 2. Diagrama Textual

```text
Usuario
  |
  v
Frontend React
  |
  | REST
  v
inventory-command-service
  |
  | grava
  v
inventory_write_db
  |
  | publica evento
  v
RabbitMQ
  |
  | consome evento
  v
inventory-sync-service
  |
  | atualiza
  v
inventory_read_db
  ^
  |
  | consulta
  |
inventory-query-service
  ^
  |
  | REST
  |
Frontend React
```

---

# 3. Tecnologias Usadas

## Frontend

- React
- Vite
- Axios
- CSS puro

## Backend

- Node.js
- Express
- JavaScript
- Prisma ORM
- PostgreSQL
- RabbitMQ com `amqplib`
- dotenv
- cors

## Infraestrutura

- Docker
- Docker Compose

---

# 4. Portas do Sistema

```text
Frontend:                 5173
inventory-command-service: 3001
inventory-query-service:   3002
inventory-sync-service:    3003
RabbitMQ AMQP:             5672
RabbitMQ Management:       15672
PostgreSQL no host:        5433
PostgreSQL no Docker:      5432
```

O PostgreSQL foi exposto no host como `5433` porque a porta `5432` costuma estar ocupada em algumas maquinas.

Dentro do Docker, os servicos continuam acessando o banco em:

```text
postgres:5432
```

---

# 5. Bancos de Dados

O projeto usa dois bancos PostgreSQL:

```text
inventory_write_db
inventory_read_db
```

## inventory_write_db

Banco usado pelo `inventory-command-service`.

Ele representa o banco operacional de escrita.

Guarda:

- produtos;
- estoque real por filial;
- movimentacoes operacionais.

Principais tabelas:

```text
Product
Stock
StockMovement
```

## inventory_read_db

Banco usado pelo `inventory-query-service`.

Ele representa o banco de leitura do CQRS.

Guarda dados ja prontos para consulta no frontend.

Principais tabelas:

```text
ProductReadModel
StockReadModel
MovementReadModel
ProcessedEvent
```

A tabela `ProcessedEvent` registra eventos ja processados pelo sync-service.

Isso ajuda a evitar processamento duplicado.

---

# 6. CQRS

CQRS significa:

```text
Command Query Responsibility Segregation
```

Ou seja:

- comandos alteram dados;
- consultas apenas leem dados.

No projeto:

## Comandos

Ficam no `inventory-command-service`.

```text
POST /products
POST /stock/in
POST /sales
POST /transfers
```

## Consultas

Ficam no `inventory-query-service`.

```text
GET /products
GET /stock
GET /stock/:branch
GET /movements
GET /events
```

Beneficio:

O sistema separa claramente a regra de negocio da parte de visualizacao.

---

# 7. EDA com RabbitMQ

EDA significa:

```text
Event-Driven Architecture
```

Neste projeto, quando algo importante acontece, o command-service publica um evento no RabbitMQ.

Exemplos:

```text
Produto criado
Estoque adicionado
Venda concluida
Estoque transferido
```

Eventos publicados:

```text
PRODUCT_CREATED
STOCK_ADDED
SALE_COMPLETED
STOCK_TRANSFERRED
```

O RabbitMQ recebe esses eventos.

O sync-service consome os eventos e atualiza o banco de leitura.

Isso permite demonstrar consistencia eventual.

---

# 8. Consistencia Eventual

Consistencia eventual significa que a escrita acontece primeiro em um lugar, e a leitura e atualizada pouco depois.

Exemplo:

```text
1. Usuario adiciona estoque.
2. Command-service grava no banco de escrita.
3. Command-service publica evento no RabbitMQ.
4. Sync-service consome o evento.
5. Sync-service atualiza banco de leitura.
6. Frontend consulta o banco de leitura.
```

Por isso pode existir um pequeno atraso entre o comando e a atualizacao na tela.

No projeto, esse atraso e intencional e ajuda a demonstrar sistemas distribuidos.

---

# 9. Arquitetura Hexagonal

A arquitetura hexagonal tambem e chamada de:

```text
Ports and Adapters
```

A ideia e separar a regra de negocio das tecnologias externas.

O dominio nao deve depender diretamente de:

- Express;
- Prisma;
- PostgreSQL;
- RabbitMQ;
- HTTP.

Por isso os servicos sao organizados em camadas:

```text
domain
application
ports
adapters
config
```

## domain

Contem regras centrais do negocio.

Exemplos:

```text
Product.js
Stock.js
StockMovement.js
InsufficientStockError.js
```

## application

Contem os casos de uso.

Exemplos:

```text
CreateProductUseCase
AddStockUseCase
RegisterSaleUseCase
TransferStockUseCase
```

## ports

Contem contratos conceituais.

Exemplos:

```text
ProductRepositoryPort
StockRepositoryPort
EventPublisherPort
```

## adapters

Contem implementacoes tecnicas.

Exemplos:

```text
Controllers REST
Repositories Prisma
Publisher RabbitMQ
Consumer RabbitMQ
```

## config

Contem configuracoes do servico.

Exemplos:

```text
env.js
container.js
```

---

# 10. inventory-command-service

Este servico e responsavel por tudo que altera o estado do sistema.

Porta:

```text
3001
```

Rotas:

```text
POST /products
POST /stock/in
POST /sales
POST /transfers
GET /health
```

Responsabilidades:

- receber comandos do frontend;
- validar regras de negocio;
- gravar no `inventory_write_db`;
- publicar eventos no RabbitMQ.

---

# 11. inventory-query-service

Este servico e responsavel por consultas.

Porta:

```text
3002
```

Rotas:

```text
GET /products
GET /stock
GET /stock/:branch
GET /movements
GET /events
GET /health
```

Responsabilidades:

- ler dados do `inventory_read_db`;
- devolver dados prontos para o frontend;
- nao executar operacoes de escrita operacional.

---

# 12. inventory-sync-service

Este servico e responsavel pela sincronizacao.

Porta:

```text
3003
```

Rotas:

```text
GET /health
```

Responsabilidades:

- conectar no RabbitMQ;
- consumir eventos;
- atualizar o banco de leitura;
- registrar eventos processados;
- demonstrar consistencia eventual.

---

# 13. Frontend

O frontend e a interface visual da aplicacao.

Ele possui formularios para:

- cadastrar produto;
- adicionar estoque;
- registrar venda;
- transferir estoque.

Tambem exibe:

- tabela de estoque;
- tabela de produtos;
- tabela de movimentacoes;
- eventos processados.

O frontend chama:

```text
Command API: http://localhost:3001
Query API:   http://localhost:3002
```

---

# 14. Acoes do Sistema em Detalhes

# 14.1 Cadastro de Produto

## O que o usuario faz

No frontend, o usuario preenche:

```text
Nome
SKU
Descricao
```

Depois clica em:

```text
Cadastrar
```

## O que o frontend faz

O frontend envia:

```http
POST /products
```

Para:

```text
inventory-command-service
```

Exemplo de corpo:

```json
{
  "name": "Mouse Logitech M90",
  "sku": "MOU-LOG-090",
  "description": "Mouse USB para estacoes administrativas"
}
```

## O que o command-service faz

1. Recebe a requisicao HTTP.
2. O controller chama o caso de uso `CreateProductUseCase`.
3. O caso de uso cria uma entidade `Product`.
4. A entidade valida se nome e SKU foram informados.
5. O repositorio Prisma salva o produto no banco `inventory_write_db`.
6. O event publisher publica o evento `PRODUCT_CREATED` no RabbitMQ.

## Evento gerado

```json
{
  "eventType": "PRODUCT_CREATED",
  "payload": {
    "productId": "uuid",
    "name": "Mouse Logitech M90",
    "sku": "MOU-LOG-090",
    "description": "Mouse USB para estacoes administrativas"
  }
}
```

## O que o sync-service faz

1. Consome o evento `PRODUCT_CREATED`.
2. Verifica se o evento ja foi processado.
3. Cria ou atualiza o produto no `ProductReadModel`.
4. Registra o evento em `ProcessedEvent`.

## O que aparece na tela

O produto aparece na tabela de produtos.

---

# 14.2 Entrada de Estoque

## O que o usuario faz

No frontend, o usuario seleciona:

```text
Produto
Filial
Quantidade
```

Depois clica em:

```text
Adicionar
```

## O que o frontend faz

O frontend envia:

```http
POST /stock/in
```

Exemplo:

```json
{
  "productId": "uuid",
  "branch": "Taquara",
  "quantity": 20
}
```

## O que o command-service faz

1. Recebe a requisicao.
2. Chama o caso de uso `AddStockUseCase`.
3. Valida se a filial existe.
4. Valida se a quantidade e maior que zero.
5. Verifica se o produto existe.
6. Atualiza ou cria o registro de estoque no `inventory_write_db`.
7. Cria uma movimentacao do tipo `IN`.
8. Publica o evento `STOCK_ADDED`.

## Evento gerado

```json
{
  "eventType": "STOCK_ADDED",
  "payload": {
    "productId": "uuid",
    "productName": "Mouse Logitech M90",
    "sku": "MOU-LOG-090",
    "branch": "Taquara",
    "quantity": 20
  }
}
```

## O que o sync-service faz

1. Consome o evento `STOCK_ADDED`.
2. Garante que o produto exista no read model.
3. Incrementa a quantidade no `StockReadModel`.
4. Cria um registro no `MovementReadModel`.
5. Registra o evento em `ProcessedEvent`.

## O que aparece na tela

O estoque da filial aumenta.

Exemplo:

```text
Taquara | Mouse Logitech M90 | 20
```

---

# 14.3 Venda

## O que o usuario faz

No frontend, o usuario seleciona:

```text
Produto
Filial
Quantidade vendida
```

Depois clica em:

```text
Vender
```

## O que o frontend faz

O frontend envia:

```http
POST /sales
```

Exemplo:

```json
{
  "productId": "uuid",
  "branch": "Taquara",
  "quantity": 3
}
```

## O que o command-service faz

1. Recebe a requisicao.
2. Chama o caso de uso `RegisterSaleUseCase`.
3. Valida filial.
4. Valida quantidade.
5. Verifica se o produto existe.
6. Busca o estoque atual da filial.
7. Verifica se existe quantidade suficiente.
8. Se nao houver estoque suficiente, retorna erro.
9. Se houver estoque, decrementa a quantidade no banco de escrita.
10. Cria uma movimentacao do tipo `SALE`.
11. Publica o evento `SALE_COMPLETED`.

## Regra de negocio importante

O estoque nao pode ficar negativo.

Se o usuario tentar vender mais itens e so houver 10, o sistema retorna erro.

Esse erro vem de:

```text
InsufficientStockError
```

## Evento gerado

```json
{
  "eventType": "SALE_COMPLETED",
  "payload": {
    "productId": "uuid",
    "productName": "Mouse Logitech M90",
    "sku": "MOU-LOG-090",
    "branch": "Taquara",
    "quantity": 3
  }
}
```

## O que o sync-service faz

1. Consome o evento `SALE_COMPLETED`.
2. Decrementa a quantidade no `StockReadModel`.
3. Cria movimentacao do tipo `SALE`.
4. Registra o evento em `ProcessedEvent`.

## O que aparece na tela

O estoque da filial diminui.

Exemplo:

```text
Antes: 20 unidades
Venda: 3 unidades
Depois: 17 unidades
```

---

# 14.4 Transferencia entre Filiais

## O que o usuario faz

No frontend, o usuario seleciona:

```text
Produto
Filial origem
Filial destino
Quantidade
```

Depois clica em:

```text
Transferir
```

## O que o frontend faz

O frontend envia:

```http
POST /transfers
```

Exemplo:

```json
{
  "productId": "uuid",
  "sourceBranch": "Taquara",
  "targetBranch": "Novo Hamburgo",
  "quantity": 5
}
```

## O que o command-service faz

1. Recebe a requisicao.
2. Chama o caso de uso `TransferStockUseCase`.
3. Valida a filial de origem.
4. Valida a filial de destino.
5. Verifica se origem e destino sao diferentes.
6. Valida a quantidade.
7. Verifica se o produto existe.
8. Verifica se existe estoque suficiente na origem.
9. Decrementa estoque da origem no banco de escrita.
10. Incrementa estoque do destino no banco de escrita.
11. Cria movimentacao `TRANSFER_OUT`.
12. Cria movimentacao `TRANSFER_IN`.
13. Publica o evento `STOCK_TRANSFERRED`.

## Evento gerado

```json
{
  "eventType": "STOCK_TRANSFERRED",
  "payload": {
    "productId": "uuid",
    "productName": "Mouse Logitech M90",
    "sku": "MOU-LOG-090",
    "sourceBranch": "Taquara",
    "targetBranch": "Novo Hamburgo",
    "quantity": 5
  }
}
```

## O que o sync-service faz

1. Consome o evento `STOCK_TRANSFERRED`.
2. Decrementa estoque da filial origem no `StockReadModel`.
3. Incrementa estoque da filial destino no `StockReadModel`.
4. Cria movimentacao `TRANSFER_OUT`.
5. Cria movimentacao `TRANSFER_IN`.
6. Registra o evento em `ProcessedEvent`.

## O que aparece na tela

Exemplo:

```text
Antes:
Taquara: 20
Novo Hamburgo: 5

Transferencia: 5 de Taquara para Novo Hamburgo

Depois:
Taquara: 15
Novo Hamburgo: 10
```

---

# 14.5 Consulta de Produtos

## O que o frontend faz

O frontend chama:

```http
GET /products
```

No:

```text
inventory-query-service
```

## O que o query-service faz

1. Recebe a requisicao.
2. Chama o caso de uso `ListProductsUseCase`.
3. Busca produtos no `ProductReadModel`.
4. Retorna os produtos para o frontend.

---

# 14.6 Consulta de Estoque

## O que o frontend faz

O frontend chama:

```http
GET /stock
```

## O que o query-service faz

1. Recebe a requisicao.
2. Chama o caso de uso `GetStockUseCase`.
3. Busca dados no `StockReadModel`.
4. Retorna o estoque agrupado por produto e filial.

---

# 14.7 Consulta de Movimentacoes

## O que o frontend faz

O frontend chama:

```http
GET /movements
```

## O que o query-service faz

1. Busca as ultimas movimentacoes no `MovementReadModel`.
2. Retorna para a tabela de movimentacoes.

Movimentacoes possiveis:

```text
IN
SALE
TRANSFER_OUT
TRANSFER_IN
```

---

# 14.8 Consulta de Eventos

## O que o frontend faz

O frontend chama:

```http
GET /events
```

## O que o query-service faz

1. Busca eventos processados na tabela `ProcessedEvent`.
2. Mostra quais eventos o sync-service ja consumiu.

Isso ajuda na apresentacao porque prova que o RabbitMQ e o sync-service estao participando do fluxo.

---

# 15. Como Rodar o Projeto

Entre na pasta:

```bash
cd "/home/vitor/Área de trabalho/Trabg2jardim/ESTOQUE-DISTRIBUIDO"
```

Suba tudo:

```bash
docker compose up -d --build
```

Veja os containers:

```bash
docker compose ps
```

Veja os logs:

```bash
docker compose logs -f
```

Pare tudo:

```bash
docker compose down
```

---

# 16. URLs Importantes

Frontend:

```text
http://localhost:5173
```

Command Service:

```text
http://localhost:3001/health
```

Query Service:

```text
http://localhost:3002/health
```

Sync Service:

```text
http://localhost:3003/health
```

RabbitMQ:

```text
http://localhost:15672
```

Credenciais RabbitMQ:

```text
usuario: guest
senha: guest
```

---

# 17. Como Explicar na Apresentacao

Uma forma simples de apresentar:

1. O problema e controlar estoque entre varias filiais.
2. O projeto usa microservicos para separar responsabilidades.
3. O command-service recebe operacoes de escrita.
4. O query-service recebe operacoes de leitura.
5. O sync-service sincroniza o banco de leitura por eventos.
6. O RabbitMQ permite comunicacao assincrona.
7. O CQRS separa escrita e leitura.
8. A arquitetura hexagonal separa dominio de tecnologia.
9. O PostgreSQL guarda os dados.
10. O frontend demonstra os fluxos na pratica.

---

# 18. Exemplo de Demonstracao em Aula

## Passo 1

Abrir:

```text
http://localhost:5173
```

## Passo 2

Cadastrar um produto.

## Passo 3

Adicionar estoque em Taquara.

## Passo 4

Abrir RabbitMQ:

```text
http://localhost:15672
```

Mostrar que existe exchange/fila relacionada aos eventos.

## Passo 5

Registrar uma venda.

Mostrar que o estoque diminui.

## Passo 6

Transferir estoque entre filiais.

Mostrar que:

- a origem diminui;
- o destino aumenta;
- as movimentacoes aparecem;
- os eventos processados aparecem.

---

# 19. Perguntas Provaveis do Professor

## Por que usar microservicos?

Para demonstrar separacao de responsabilidades, escalabilidade independente e comunicacao distribuida.

## Por que usar CQRS?

Para separar escrita e leitura. Isso facilita evolucao, consulta e organizacao do sistema.

## Por que usar RabbitMQ?

Para permitir comunicacao assincrona por eventos entre os servicos.

## O que e consistencia eventual?

E quando a escrita ocorre primeiro, e a leitura e atualizada depois pelo processamento de eventos.

## O que impede estoque negativo?

O command-service valida estoque antes de venda e transferencia.

## O que acontece se o sync-service cair?

Os eventos ficam na fila do RabbitMQ. Quando o sync-service voltar, ele pode consumir e atualizar o banco de leitura.

## Por que arquitetura hexagonal?

Para proteger a regra de negocio de detalhes tecnicos como Express, Prisma, PostgreSQL e RabbitMQ.

## O sistema e mais complexo que um monolito?

Sim. Mas essa complexidade existe para demonstrar arquitetura distribuida, CQRS, EDA e separacao entre servicos.

---

# 20. Resumo Final

Este projeto mostra uma plataforma de estoque distribuido com tres ideias centrais:

```text
Microservicos
CQRS
Eventos com RabbitMQ
```

O command-service altera o estado.

O query-service consulta o estado projetado.

O sync-service conecta os dois mundos processando eventos.

O frontend permite demonstrar tudo isso visualmente.

Essa estrutura torna o projeto bom para explicar arquitetura de software porque cada decisao tecnica aparece na pratica.
