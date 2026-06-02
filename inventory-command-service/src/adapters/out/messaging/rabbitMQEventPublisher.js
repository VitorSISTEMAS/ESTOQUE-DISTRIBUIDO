import amqp from "amqplib";
import { env } from "../../../config/env.js";

export class RabbitMQEventPublisher {
  constructor() {
    this.connection = null;
    this.channel = null;
  }

  async connect() {
    if (this.channel) return this.channel;

    this.connection = await amqp.connect(env.rabbitmqUrl);
    this.channel = await this.connection.createChannel();
    await this.channel.assertExchange(env.rabbitmqExchange, "topic", { durable: true });
    return this.channel;
  }

  async publish(routingKey, event) {
    const channel = await this.connect();
    channel.publish(
      env.rabbitmqExchange,
      routingKey,
      Buffer.from(JSON.stringify(event)),
      { persistent: true, contentType: "application/json" }
    );
  }
}
