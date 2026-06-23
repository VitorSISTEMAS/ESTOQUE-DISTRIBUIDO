import "dotenv/config"

interface Env {
  port: number
  databaseUrl: string | undefined
  rabbitmqUrl: string
  rabbitmqExchange: string
  corsOrigin: string
}

export const env: Env = {
  port: Number(process.env.PORT || 3001),
  databaseUrl: process.env.DATABASE_URL,
  rabbitmqUrl: process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672",
  rabbitmqExchange: process.env.RABBITMQ_EXCHANGE || "inventory.events",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173"
}
