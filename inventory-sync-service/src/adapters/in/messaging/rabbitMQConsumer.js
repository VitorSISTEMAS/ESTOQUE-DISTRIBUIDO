import amqp from "amqplib"
import { env } from "../../../config/env.js"
import { container } from "../../../config/container.js"

const routingKeys = ["product.created", "stock.added", "sale.completed", "stock.transferred", "branch.created"]

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export class RabbitMQConsumer {
  async start(retries = 10, delay = 3000) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const connection = await amqp.connect(env.rabbitmqUrl)
        const channel = await connection.createChannel()

        await channel.assertExchange(env.rabbitmqExchange, "topic", { durable: true })
        await channel.assertQueue(env.rabbitmqQueue, { durable: true })

        for (const routingKey of routingKeys) {
          await channel.bindQueue(env.rabbitmqQueue, env.rabbitmqExchange, routingKey)
        }

        channel.prefetch(1)
        await channel.consume(env.rabbitmqQueue, async (message) => {
          if (!message) return

          try {
            const event = JSON.parse(message.content.toString())
            const alreadyProcessed = await container.readModelRepository.hasProcessed(event.eventId)

            if (alreadyProcessed) {
              channel.ack(message)
              return
            }

            await sleep(env.syncDelayMs)

            const handler = container.handlers[event.eventType]
            if (!handler) throw new Error(`Handler nao encontrado para ${event.eventType}.`)

            await handler.handle(event)
            console.log(`Evento processado: ${event.eventType} (${event.eventId})`)
            channel.ack(message)
          } catch (error) {
            console.error("Erro ao processar evento", error)
            channel.nack(message, false, true)
          }
        })

        console.log(`inventory-sync-service consuming queue ${env.rabbitmqQueue}`)
        return
      } catch (error) {
        console.log(`Tentativa ${attempt}/${retries} de conectar ao RabbitMQ...`)
        if (attempt === retries) {
          console.error("Nao foi possivel conectar ao RabbitMQ apos", retries, "tentativas.", error)
          throw error
        }
        await sleep(delay)
      }
    }
  }
}
