import "dotenv/config"

export const env = {
  port: Number(process.env.PORT || 3002),
  databaseUrl: process.env.DATABASE_URL,
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173"
}
