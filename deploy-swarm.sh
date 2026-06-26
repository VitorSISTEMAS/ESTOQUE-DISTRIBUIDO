#!/usr/bin/env bash
set -e

STACK_NAME="${1:-inventory}"
SEED="${2:-false}"
BUILD_HASH_FILE="/tmp/${STACK_NAME}_build_hash"

SERVICES_BUILD=(
  "inventory-command-service:inventory-command-service"
  "inventory-query-service:inventory-query-service"
  "inventory-sync-service:inventory-sync-service"
  "frontend:frontend"
)

compute_hash() {
  local hash=""
  for entry in "${SERVICES_BUILD[@]}"; do
    local dir="${entry#*:}"
    hash+=$(find "$dir" -type f \( -name "Dockerfile" -o -name "package*.json" -o -name "tsconfig*.json" -o -path "$dir/src/*" -o -path "$dir/prisma/*" \) -exec md5sum {} + 2>/dev/null | md5sum | cut -d' ' -f1)
  done
  hash+=$(find infra -type f -exec md5sum {} + 2>/dev/null | md5sum | cut -d' ' -f1)
  hash+=$(md5sum docker-stack.yml 2>/dev/null | cut -d' ' -f1)
  echo "$hash" | md5sum | cut -d' ' -f1
}

needs_build() {
  local new_hash
  new_hash=$(compute_hash)
  if [ ! -f "$BUILD_HASH_FILE" ]; then
    echo "$new_hash" > "$BUILD_HASH_FILE"
    return 0
  fi
  local old_hash
  old_hash=$(cat "$BUILD_HASH_FILE")
  if [ "$new_hash" != "$old_hash" ]; then
    echo "$new_hash" > "$BUILD_HASH_FILE"
    return 0
  fi
  for entry in "${SERVICES_BUILD[@]}"; do
    local tag="localhost/${entry%%:*}:latest"
    if ! docker image inspect "$tag" > /dev/null 2>&1; then
      return 0
    fi
  done
  return 1
}

cleanup_stack() {
  if docker stack ls --format '{{.Name}}' 2>/dev/null | grep -qx "$STACK_NAME"; then
    echo "=== Removendo stack antigo '$STACK_NAME' ==="
    docker stack rm "$STACK_NAME"
    echo "Aguardando remocao completa..."
    while docker stack ls --format '{{.Name}}' 2>/dev/null | grep -qx "$STACK_NAME"; do sleep 2; done
    sleep 8
  fi
}

wait_for_task_running() {
  local service_name="$1"
  local max_attempts="${2:-30}"
  local attempt=0

  while [ $attempt -lt "$max_attempts" ]; do
    local running
    running=$(docker service ps "${STACK_NAME}_${service_name}" \
      --filter desired-state=running --format '{{.ID}}' 2>/dev/null | wc -l)
    if [ "$running" -ge 1 ]; then
      return 0
    fi
    attempt=$((attempt + 1))
    sleep 3
  done
  return 1
}

wait_for_healthy() {
  local service_name="$1"
  local max_attempts="${2:-20}"
  local attempt=0

  while [ $attempt -lt "$max_attempts" ]; do
    local container_id
    container_id=$(docker ps --filter "name=${STACK_NAME}_${service_name}" --format '{{.ID}}' 2>/dev/null | head -1)
    if [ -n "$container_id" ]; then
      local status
      status=$(docker inspect --format='{{.State.Health.Status}}' "$container_id" 2>/dev/null || echo "starting")
      if [ "$status" = "healthy" ]; then
        echo "  $service_name: healthy"
        return 0
      fi
    fi
    attempt=$((attempt + 1))
    sleep 3
  done
  echo "  $service_name: timeout (continuando...)"
  return 1
}

wait_for_http() {
  local url="$1"
  local max_attempts="${2:-30}"
  local attempt=0

  while [ $attempt -lt "$max_attempts" ]; do
    if curl -sf "$url" > /dev/null 2>&1; then
      echo "  $url: OK"
      return 0
    fi
    attempt=$((attempt + 1))
    sleep 3
  done
  echo "  $url: timeout"
  return 1
}

# ─── Main ──────────────────────────────────────────

cleanup_stack

echo "=== Verificando necessidade de build ==="
if needs_build; then
  echo "  Mudancas detectadas ou imagens ausentes. Buildando..."
  docker compose -f docker-stack.yml build
else
  echo "  Sem mudancas. Usando imagens existentes."
fi

echo ""
echo "=== Deploying stack '$STACK_NAME' ==="
docker stack deploy -c docker-stack.yml "$STACK_NAME"

echo ""
echo "=== Aguardando servicos ficarem saudaveis ==="
echo "Postgres..."
wait_for_task_running "postgres-write"
wait_for_healthy "postgres-write"
wait_for_task_running "postgres-read"
wait_for_healthy "postgres-read"
echo "RabbitMQ..."
wait_for_task_running "rabbitmq"
wait_for_healthy "rabbitmq"

echo "Servicos HTTP..."
wait_for_task_running "inventory-command-service"
wait_for_http "http://localhost:3001/health"
wait_for_task_running "inventory-query-service"
wait_for_http "http://localhost:3002/health"
wait_for_task_running "frontend"
wait_for_http "http://localhost:5173"

echo ""
echo "=== Stack services ==="
docker stack services "$STACK_NAME"

# Seed data if requested
if [ "$SEED" = "--seed" ] || [ "$SEED" = "true" ]; then
  echo ""
  echo "=== Populando dados de exemplo ==="
  if [ -f infra/seed-metrics.sh ]; then
    bash infra/seed-metrics.sh
  else
    echo "Script infra/seed-metrics.sh nao encontrado."
  fi
fi

echo ""
echo "=== Deploy concluido! ==="
echo "Frontend: http://localhost:5173"
echo "Command:  http://localhost:3001"
echo "Query:    http://localhost:3002"
echo "RabbitMQ: http://localhost:15672 (guest/guest)"
echo "Prometheus: http://localhost:9090"
echo "Grafana:  http://localhost:3000 (admin/admin)"
if [ "$SEED" = "--seed" ] || [ "$SEED" = "true" ]; then
  echo "Dados de exemplo populados com sucesso."
fi
