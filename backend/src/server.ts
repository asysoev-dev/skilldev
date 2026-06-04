import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import rateLimit from "express-rate-limit";
import { PrismaClient } from "@prisma/client";

import { logger } from "./utils/logger";
import { CORS_OPTIONS, RATE_LIMIT_OPTIONS } from "./utils/constants";

import authRoutes from "./routes/auth.routes";

dotenv.config({
  path: path.resolve(__dirname, "../../.env.dev"),
});

export const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors(CORS_OPTIONS));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit(RATE_LIMIT_OPTIONS);

app.use("/api/", limiter);
app.use("/api/auth", authRoutes);

app.get("/test", (req, res) => {
  res.json({ status: "ok" });
});

app.use(
  (
    err: any,
    // req: express.Request,
    res: express.Response,
    // next: express.NextFunction,
  ) => {
    logger.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
  },
);

const startServer = async () => {
  try {
    await prisma.$connect();
    logger.info("Database connected successfully");

    app.listen(PORT, () => {
      logger.info(`Server running on http://localhost:${PORT}`);
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
