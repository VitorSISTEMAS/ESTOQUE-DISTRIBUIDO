import "dotenv/config";

export const env = {
  port: Number(process.env.PORT || 3003),
  databaseUrl: process.env.DATABASE_URL,
  rabbitmqUrl: process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672",
  rabbitmqExchange: process.env.RABBITMQ_EXCHANGE || "inventory.events",
  rabbitmqQueue: process.env.RABBITMQ_QUEUE || "inventory.sync.queue",
  syncDelayMs: Number(process.env.SYNC_DELAY_MS || 700)
};
