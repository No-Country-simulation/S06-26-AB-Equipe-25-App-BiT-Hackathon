import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { AppDataSource } from "./data-source.js";
import { authRoutes } from "./routes/auth.routes.js";
import { healthRoutes } from "./routes/health.routes.js";
import { insightsRoutes } from "./routes/insights.routes.js";
import { matchRoutes } from "./routes/match.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/insights", insightsRoutes);
app.use("/api/v1/match", matchRoutes);
app.use("/auth", authRoutes);
app.use("/health", healthRoutes);
app.use("/insights", insightsRoutes);
app.use("/match", matchRoutes);

const PORT = process.env.PORT || 3001;

AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Backend running on port ${PORT}`);
    });
  })
  .catch((error: unknown) => {
    console.error("Erro ao inicializar banco de dados:", error);
    process.exit(1);
  });
