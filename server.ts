import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import helmet from "helmet";
import { Server } from "socket.io";
import http from "http";
import admin from "firebase-admin";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Import middlewares
import { errorHandler } from "./middleware/errorHandler.js";
import { apiLimiter } from "./middleware/rateLimiter.js";

// Import routes
import authRoutes from "./routes/auth.routes.js";
import vendorRoutes from "./routes/vendor.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import orderRoutes from "./routes/order.routes.js";
import publicRoutes from "./routes/public.routes.js";
// import uploadRoutes from "./routes/upload.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin
if (!admin.apps.length) {
  try {
    // In this environment, we might not have a service account file.
    // We can initialize with project ID if running in a Google Cloud environment.
    admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID || 'supatz',
    });
    console.log("Firebase Admin initialized");
  } catch (error) {
    console.error("Firebase Admin initialization failed:", error);
  }
}

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const PORT = 3000;

  // Trust proxy for express-rate-limit to work correctly behind reverse proxies
  app.set('trust proxy', 1);

  // Socket.io Setup
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  app.set("io", io);

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
    
    socket.on("join", (room) => {
      socket.join(room);
      console.log(`User joined room: ${room}`);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  // Security & Utility Middlewares
  app.use(helmet({
    contentSecurityPolicy: false, // Disable CSP for Vite dev server compatibility
  }));
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/api", apiLimiter);

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "SwiftApp API is running", timestamp: new Date() });
  });

  // Route Mounting
  app.use("/api/auth", authRoutes);
  app.use("/api/vendor", vendorRoutes);
  app.use("/api/payments", paymentRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api", publicRoutes);
  // app.use("/api/upload", uploadRoutes);
  app.use("/api/admin", adminRoutes);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Error Handling
  app.use(errorHandler);

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
