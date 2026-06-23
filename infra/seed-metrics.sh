#!/usr/bin/env bash
set -e

BASE_URL="${1:-http://localhost:3001}"

echo "Aguardando o inventory-command-service ficar pronto..."
until curl -s "$BASE_URL/health" > /dev/null 2>&1; do
  sleep 1
done
echo "Service ready!"

PRODUCTS=()
BRANCHES=("Taquara" "Porto Alegre" "Novo Hamburgo")

echo ""
echo "=== Criando produtos ==="

create_product() {
  local name="$1" sku="$2" stock_type_id="$3"
  local payload
  payload=$(cat <<EOF
{ "name": "$name", "sku": "$sku", "stockTypeId": $stock_type_id }
EOF
)
  local resp
  resp=$(curl -s -X POST "$BASE_URL/products" -H "Content-Type: application/json" -d "$payload")
  local id
  id=$(echo "$resp" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
  echo "  -> $sku | $name | id=$id"
  PRODUCTS+=("$id")
  sleep 0.3
}

create_product "Teclado Mecanico RGB" "TEC-RGB-001" 4
create_product "Mouse Gamer" "MOU-GAM-002" 4
create_product "Monitor 27 4K" "MON-27K-003" 4
create_product "Cadeira Ergonômica" "CAD-ERG-004" 5
create_product "Fone Bluetooth" "FON-BLU-005" 5
create_product "Arroz 5kg" "ARZ-5KG-006" 2
create_product "Feijao Preto 1kg" "FEI-PRE-007" 2
create_product "Agua Mineral 500ml" "AGU-500-008" 3
create_product "Cerveja Pilsen Lata" "CER-PIL-009" 3
create_product "Refrigerante Cola 2L" "REF-COL-010" 3
create_product "Furadeira Eletrica" "FUR-ELE-011" 8
create_product "Martelo Profissional" "MAR-PRO-012" 8

echo ""
echo "=== Adicionando estoque ==="

add_stock() {
  local idx=$1 branch="$2" qty="$3"
  local product_id="${PRODUCTS[$idx]}"
  local payload
  payload=$(cat <<EOF
{ "productId": "$product_id", "branch": "$branch", "quantity": $qty }
EOF
)
  curl -s -X POST "$BASE_URL/stock/in" -H "Content-Type: application/json" -d "$payload" > /dev/null
  echo "  +$qty x ${PRODUCTS[$idx]:0:8}... em $branch"
  sleep 0.2
}

add_stock 0 "Taquara" 50
add_stock 0 "Porto Alegre" 30
add_stock 0 "Novo Hamburgo" 20

add_stock 1 "Taquara" 40
add_stock 1 "Porto Alegre" 25

add_stock 2 "Taquara" 10
add_stock 3 "Taquara" 15
add_stock 3 "Novo Hamburgo" 10

add_stock 4 "Porto Alegre" 35
add_stock 4 "Novo Hamburgo" 20

add_stock 5 "Taquara" 100
add_stock 5 "Porto Alegre" 200
add_stock 5 "Novo Hamburgo" 150

add_stock 6 "Taquara" 80
add_stock 6 "Porto Alegre" 120

add_stock 7 "Taquara" 200
add_stock 7 "Porto Alegre" 300
add_stock 7 "Novo Hamburgo" 150

add_stock 8 "Taquara" 300
add_stock 8 "Porto Alegre" 500
add_stock 8 "Novo Hamburgo" 200

add_stock 9 "Taquara" 150
add_stock 9 "Porto Alegre" 200

add_stock 10 "Taquara" 12
add_stock 11 "Taquara" 25
add_stock 11 "Porto Alegre" 15

echo ""
echo "=== Registrando vendas ==="

register_sale() {
  local idx=$1 branch="$2" qty="$3"
  local product_id="${PRODUCTS[$idx]}"
  local payload
  payload=$(cat <<EOF
{ "productId": "$product_id", "branch": "$branch", "quantity": $qty }
EOF
)
  curl -s -X POST "$BASE_URL/sales" -H "Content-Type: application/json" -d "$payload" > /dev/null
  echo "  -$qty x ${PRODUCTS[$idx]:0:8}... em $branch (venda)"
  sleep 0.3
}

register_sale 0 "Taquara" 3
register_sale 0 "Porto Alegre" 2
register_sale 1 "Taquara" 5
register_sale 2 "Taquara" 1
register_sale 4 "Porto Alegre" 2
register_sale 5 "Taquara" 10
register_sale 5 "Porto Alegre" 15
register_sale 6 "Taquara" 8
register_sale 7 "Taquara" 30
register_sale 7 "Porto Alegre" 50
register_sale 8 "Taquara" 60
register_sale 8 "Porto Alegre" 100
register_sale 9 "Taquara" 20
register_sale 9 "Novo Hamburgo" 15
register_sale 10 "Taquara" 2
register_sale 11 "Taquara" 3

echo ""
echo "=== Transferindo estoque ==="

transfer_stock() {
  local idx=$1 src="$2" tgt="$3" qty="$4"
  local product_id="${PRODUCTS[$idx]}"
  local payload
  payload=$(cat <<EOF
{ "productId": "$product_id", "sourceBranch": "$src", "targetBranch": "$tgt", "quantity": $qty }
EOF
)
  curl -s -X POST "$BASE_URL/transfers" -H "Content-Type: application/json" -d "$payload" > /dev/null
  echo "  -> $qty x ${PRODUCTS[$idx]:0:8}... de $src para $tgt"
  sleep 0.3
}

transfer_stock 0 "Taquara" "Novo Hamburgo" 5
transfer_stock 1 "Taquara" "Porto Alegre" 3
transfer_stock 5 "Porto Alegre" "Taquara" 10
transfer_stock 7 "Taquara" "Novo Hamburgo" 20
transfer_stock 8 "Porto Alegre" "Taquara" 30

echo ""
echo "=== Seed concluido! ==="
echo "Dados populados em todas as filiais."
echo "Acesse http://localhost:3000 (admin/admin) para ver as metricas no Grafana."
