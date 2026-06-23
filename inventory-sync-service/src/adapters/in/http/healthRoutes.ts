import { Router, Request, Response } from "express"

export const healthRoutes = Router()

healthRoutes.get("/health", (_req: Request, res: Response) => {
  res.json({ service: "inventory-sync-service", status: "ok" })
})
