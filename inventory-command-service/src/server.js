import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { routes } from "./routes.js";

const app = express();

app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());
app.use(routes);

app.use((error, _req, res, _next) => {
  const statusCode = error.statusCode || (error.code === "P2002" ? 409 : 400);
  res.status(statusCode).json({
    message: error.code === "P2002" ? "Registro duplicado." : error.message
  });
});

app.listen(env.port, () => {
  console.log(`inventory-command-service running on port ${env.port}`);
});
