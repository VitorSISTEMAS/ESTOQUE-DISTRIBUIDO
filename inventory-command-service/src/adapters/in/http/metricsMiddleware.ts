import { Request, Response, NextFunction } from "express"
import { httpRequestDuration, httpRequestsTotal } from "../../out/monitoring/prometheusMetrics.js"

export function metricsMiddleware(req: Request, res: Response, next: NextFunction): void {
  const end = httpRequestDuration.startTimer()

  res.on("finish", () => {
    const route = req.route?.path || req.path
    const statusCode = String(res.statusCode)

    httpRequestsTotal.inc({ method: req.method, route, status_code: statusCode })
    end({ method: req.method, route, status_code: statusCode })
  })

  next()
}
