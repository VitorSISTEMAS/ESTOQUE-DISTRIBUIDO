import amqp from "amqplib"
import { env } from "../../../config/env.js"

export class RabbitMQEventPublisher {
  private connection: amqp.Connection | null = null
  private channel: amqp.Channel | null = null

  async connect(): Promise<amqp.Channel> {
    if (this.channel) return this.channel

    this.connection = await amqp.connect(env.rabbitmqUrl)
    this.channel = await this.connection.createChannel()
    await this.channel.assertExchange(env.rabbitmqExchange, "topic", { durable: true })
    return this.channel
  }

  async publish(routingKey: string, event: Record<string, unknown>): Promise<void> {
    const channel = await this.connect()
    channel.publish(
      env.rabbitmqExchange,
      routingKey,
      Buffer.from(JSON.stringify(event)),
      { persistent: true, contentType: "application/json" }
    )
  }
}
