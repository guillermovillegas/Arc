import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AuthPayload } from "../middleware/auth";

export function setupSocketIO(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: env.WEB_URL,
      methods: ["GET", "POST"],
    },
  });

  // Auth middleware for socket connections
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Authentication required"));

    try {
      const payload = jwt.verify(token, env.JWT_SECRET) as AuthPayload;
      socket.data.user = payload;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.data.user.userId;

    // Join personal room for notifications
    socket.join(`user:${userId}`);

    // Join a conversation room
    socket.on("join:conversation", (conversationId: string) => {
      socket.join(`conversation:${conversationId}`);
    });

    // Leave a conversation room
    socket.on("leave:conversation", (conversationId: string) => {
      socket.leave(`conversation:${conversationId}`);
    });

    // Send chat message (real-time relay - persistence happens via REST)
    socket.on("chat:message", (data: { conversationId: string; message: unknown }) => {
      socket.to(`conversation:${data.conversationId}`).emit("chat:message", data.message);
    });

    // Typing indicator
    socket.on("chat:typing", (data: { conversationId: string }) => {
      socket.to(`conversation:${data.conversationId}`).emit("chat:typing", {
        userId,
        conversationId: data.conversationId,
      });
    });

    socket.on("disconnect", () => {
      // Clean up if needed
    });
  });

  return io;
}
