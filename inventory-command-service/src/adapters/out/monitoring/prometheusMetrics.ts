import client from "prom-client"

export const register: client.Registry = new client.Registry()

client.collectDefaultMetrics({ register })

export const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duracao das requisicoes HTTP em segundos",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 3, 5, 10],
  registers: [register],
})

export const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total de requisicoes HTTP",
  labelNames: ["method", "route", "status_code"],
  registers: [register],
})
