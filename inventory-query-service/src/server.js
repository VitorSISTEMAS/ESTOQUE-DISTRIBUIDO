import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { routes } from "./routes.js";

const app = express();

app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());
app.use(routes);

app.use((error, _req, res, _next) => {
  res.status(400).json({ message: error.message });
});

app.listen(env.port, () => {
  console.log(`inventory-query-service running on port ${env.port}`);
});
