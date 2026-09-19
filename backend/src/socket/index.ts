import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { logger } from "../utils/logger";

let io: Server | null = null;
let onlineCount = 0;

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3005",
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

export const initSocket = (httpServer: HttpServer): Server => {
  io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });

  io.on("connection", (socket: Socket) => {
    onlineCount++;
    io?.emit("online-users", onlineCount);
    logger.info(`Socket connected: ${socket.id} (online: ${onlineCount})`);

    socket.on(
      "broadcast-notification",
      (payload: { text: string; type?: string }) => {
        io?.emit("notification", {
          text: payload.text,
          type: payload.type ?? "info",
          timestamp: Date.now(),
        });
      },
    );

    socket.on("disconnect", () => {
      onlineCount = Math.max(0, onlineCount - 1);
      io?.emit("online-users", onlineCount);
      logger.info(`Socket disconnected: ${socket.id} (online: ${onlineCount})`);
    });
  });

  return io;
};

export const getIO = (): Server | null => io;
