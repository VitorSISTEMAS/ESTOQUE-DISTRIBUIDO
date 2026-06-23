import "dotenv/config"

interface Env {
  port: number
  databaseUrl: string | undefined
  corsOrigin: string
}

export const env: Env = {
  port: Number(process.env.PORT || 3002),
  databaseUrl: process.env.DATABASE_URL,
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173"
}
