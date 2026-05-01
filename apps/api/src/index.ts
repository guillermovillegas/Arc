import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { createServer } from "http";
import { env } from "./config/env";
import { generalLimiter } from "./middleware/rate-limit";
import { errorHandler } from "./middleware/error-handler";
import routes from "./routes";
import { setupSocketIO } from "./sockets";

const app = express();
const httpServer = createServer(app);

// Stripe webhook needs raw body
app.use("/api/v1/payments/webhook", express.raw({ type: "application/json" }));

// Global middleware
app.use(cors({ origin: env.WEB_URL, credentials: true }));
app.use(helmet());
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "10mb" }));
app.use(generalLimiter);

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API routes
app.use("/api/v1", routes);

// Error handler (must be last)
app.use(errorHandler);

// Socket.IO
setupSocketIO(httpServer);

// Start server
httpServer.listen(env.API_PORT, () => {
  console.log(`FAINEANT API running on port ${env.API_PORT}`);
  console.log(`Environment: ${env.NODE_ENV}`);
});

export default app;
