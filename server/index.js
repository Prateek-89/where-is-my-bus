import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import connectDB from "./utils/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import busRoutes from "./routes/busRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();

const app = express();

/* ================================
   CORS CONFIGURATION (Express 5 + Node 22 Compatible)
================================ */

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://where-is-my-bus-dusky.vercel.app"
];

// Add any origins from environment variable
if (process.env.CLIENT_URLS) {
  process.env.CLIENT_URLS.split(",").forEach((url) => {
    const trimmed = url.trim();
    if (trimmed && !allowedOrigins.includes(trimmed)) {
      allowedOrigins.push(trimmed);
    }
  });
}

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, curl, server-to-server)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.error("❌ CORS blocked origin:", origin);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

/* ================================
   MIDDLEWARE ORDER (CRITICAL FOR CORS)
================================ */

// 1. CORS middleware MUST be first - handles preflight automatically
app.use(cors(corsOptions));

// 2. Manual preflight handler for all routes (Express 5 compatible)
//    DO NOT use app.options("*", ...) - causes PathError in Express 5
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    // Preflight request - respond immediately
    return res.sendStatus(200);
  }
  next();
});

// 3. Logging
app.use(morgan("dev"));

// 4. Body parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// 5. Cookie parser with secure settings for cross-origin
app.use(cookieParser());

/* ================================
   ROUTES
================================ */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚍 Bus Tracking API is running",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
    allowedOrigins: allowedOrigins
  });
});

// Health check endpoint for Render
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/buses", busRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);

/* ================================
   404 HANDLER
================================ */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl
  });
});

/* ================================
   GLOBAL ERROR HANDLER
================================ */

app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.message);

  // Handle CORS errors specifically
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "CORS: Origin not allowed"
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === "production" 
      ? "Internal Server Error" 
      : err.message
  });
});

/* ================================
   START SERVER
================================ */

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📋 Allowed origins:`, allowedOrigins);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
