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
import fs from "fs";

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
import driverRoutes from "./routes/driver.routes.js";
// import uploadRoutes from "./routes/upload.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin
if (!admin.apps.length) {
  try {
    let projectId;
    
    // Try multiple possible paths for the config file
    const possiblePaths = [
      path.join(process.cwd(), 'firebase-applet-config.json'),
      path.join(__dirname, 'firebase-applet-config.json'),
      '/app/applet/firebase-applet-config.json',
      '/firebase-applet-config.json'
    ];

    for (const configPath of possiblePaths) {
      if (fs.existsSync(configPath)) {
        try {
          const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
          if (config.projectId) {
            projectId = config.projectId;
            console.log(`Found Project ID in ${configPath}: ${projectId}`);
            break;
          }
        } catch (e) {
          console.error(`Failed to parse ${configPath}`, e);
        }
      }
    }

    // Fallback logic: 
    // 1. Use found projectId
    // 2. If not found, check env var BUT ignore the internal one (203689465733)
    // 3. Use hardcoded default
    const internalProjectId = '203689465733';
    const envProjectId = process.env.FIREBASE_PROJECT_ID;
    
    if (!projectId) {
      if (envProjectId && envProjectId !== internalProjectId) {
        projectId = envProjectId;
      } else {
        projectId = 'gen-lang-client-0811156114';
      }
    }

    admin.initializeApp({
      projectId: projectId,
    });
    console.log(`Firebase Admin initialized for project: ${projectId}`);

    // Bootstrap Admin User
    const bootstrapAdmin = async () => {
      const adminEmail = 'amytzee@gmail.com';
      const adminPassword = 'TANZANIA';
      const adminPhone = '+255687225353';
      const phoneEmail = '255687225353@swiftapp.com';

      const createOrUpdate = async (email: string, phone?: string) => {
        try {
          try {
            await admin.auth().getUserByEmail(email);
            console.log(`User ${email} already exists`);
          } catch (e: any) {
            if (e.code === 'auth/user-not-found') {
              await admin.auth().createUser({
                email: email,
                password: adminPassword,
                phoneNumber: phone,
                displayName: 'Super Admin',
                emailVerified: true
              });
              console.log(`User ${email} created successfully`);
            } else {
              throw e;
            }
          }
        } catch (err) {
          console.error(`Error bootstrapping ${email}:`, err);
        }
      };

      await createOrUpdate(adminEmail, adminPhone);
      await createOrUpdate(phoneEmail);
    };
    bootstrapAdmin();
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
  app.use("/api/driver", driverRoutes);
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
