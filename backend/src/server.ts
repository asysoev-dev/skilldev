import "./preload";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { createServer } from "http";
import { PrismaClient } from "@prisma/client";

import { logger } from "./utils/logger";
import { CORS_OPTIONS, RATE_LIMIT_OPTIONS } from "./utils/constants";
import { initSocket } from "./socket";

import authRoutes from "./routes/auth.routes";
import leadRoutes from "./routes/lead.routes";
import analyticsRoutes from "./routes/analytics.routes";

export const prisma = new PrismaClient();

const app = express();
const PORT = parseInt(process.env.PORT as string, 10) || 3001;

app.use(cors(CORS_OPTIONS));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit(RATE_LIMIT_OPTIONS);

app.use("/api/", limiter);
app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/analytics", analyticsRoutes);

app.use((err: any, res: express.Response) => {
  logger.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

const startServer = async () => {
  try {
    await prisma.$connect();
    logger.info("Database connected successfully");

    const httpServer = createServer(app);
    initSocket(httpServer);

    httpServer.listen(PORT, "0.0.0.0", () => {
      logger.info(`Server running on http://localhost:${PORT}`);
      logger.info("Socket.io ready");
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
