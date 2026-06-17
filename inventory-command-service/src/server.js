import cors from "cors"
import express from "express"
import { env } from "./config/env.js"
import { routes } from "./routes.js"
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

const INITIAL_BRANCHES = [
  { name: "Taquara", address: "Rua Principal, 100 - Taquara/RS" },
  { name: "Porto Alegre", address: "Av. Central, 500 - Porto Alegre/RS" },
  { name: "Novo Hamburgo", address: "Rua das Flores, 200 - Novo Hamburgo/RS" }
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

    for (const b of INITIAL_BRANCHES) {
      await prisma.branch.upsert({
        where: { name: b.name },
        create: b,
        update: { address: b.address }
      })
    }
    console.log("Branches seeded.")
  } catch (error) {
    console.error("Seed error:", error.message)
  }
}

const app = express()

app.use(cors({ origin: env.corsOrigin }))
app.use(express.json())
app.use(routes)

app.use((error, _req, res, _next) => {
  const statusCode = error.statusCode || (error.code === "P2002" ? 409 : 400)
  res.status(statusCode).json({
    message: error.code === "P2002" ? "Registro duplicado." : error.message
  })
})

seed().then(() => {
  app.listen(env.port, () => {
    console.log(`inventory-command-service running on port ${env.port}`)
  })
})
