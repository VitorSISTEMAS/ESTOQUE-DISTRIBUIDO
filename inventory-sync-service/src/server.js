import express from "express"
import { RabbitMQConsumer } from "./adapters/in/messaging/rabbitMQConsumer.js"
import { env } from "./config/env.js"
import { healthRoutes } from "./health.js"
import { prisma } from "./adapters/out/database/prismaClient.js"

const STOCK_TYPES = [
  { id: 1, name: "Geral" },
  { id: 2, name: "Alimentos" },
  { id: 3, name: "Bebidas" },
  { id: 4, name: "Eletronicos" },
  { id: 5, name: "Acessorios" },
  { id: 6, name: "Vendidos" },
  { id: 7, name: "Pereciveis" },
  { id: 8, name: "Ferramentas" }
]

async function seed() {
  try {
    for (const st of STOCK_TYPES) {
      await prisma.stockType.upsert({
        where: { id: st.id },
        create: st,
        update: { name: st.name }
      })
    }
    console.log("Stock types seeded.")
  } catch (error) {
    console.error("Seed error:", error.message)
  }
}

const app = express()

app.use(express.json())
app.use(healthRoutes)

app.listen(env.port, () => {
  console.log(`inventory-sync-service health endpoint on port ${env.port}`)
})

seed().then(() => {
  const consumer = new RabbitMQConsumer()
  consumer.start().catch((error) => {
    console.error("Nao foi possivel iniciar o consumer RabbitMQ apos todas as tentativas", error)
  })
})
