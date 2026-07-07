import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { authRoutes } from "./routes/auth.routes.js";
import { healthRoutes } from "./routes/health.routes.js";
import { matchRoutes } from "./routes/match.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/health", healthRoutes);
app.use("/match", matchRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
