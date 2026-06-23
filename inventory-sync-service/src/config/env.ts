import "dotenv/config"

interface Env {
  port: number
  databaseUrl: string | undefined
  rabbitmqUrl: string
  rabbitmqExchange: string
  rabbitmqQueue: string
  syncDelayMs: number
}

export const env: Env = {
  port: Number(process.env.PORT || 3003),
  databaseUrl: process.env.DATABASE_URL,
  rabbitmqUrl: process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672",
  rabbitmqExchange: process.env.RABBITMQ_EXCHANGE || "inventory.events",
  rabbitmqQueue: process.env.RABBITMQ_QUEUE || "inventory.sync.queue",
  syncDelayMs: Number(process.env.SYNC_DELAY_MS || 700)
}
