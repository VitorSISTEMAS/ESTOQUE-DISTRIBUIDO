import express from "express";
import { RabbitMQConsumer } from "./adapters/in/messaging/rabbitMQConsumer.js";
import { env } from "./config/env.js";
import { healthRoutes } from "./health.js";

const app = express();

app.use(express.json());
app.use(healthRoutes);

app.listen(env.port, () => {
  console.log(`inventory-sync-service health endpoint on port ${env.port}`);
});

const consumer = new RabbitMQConsumer();
consumer.start().catch((error) => {
  console.error("Nao foi possivel iniciar o consumer RabbitMQ", error);
  process.exit(1);
});
