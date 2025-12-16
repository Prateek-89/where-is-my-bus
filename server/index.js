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
   CORS CONFIGURATION (IMPORTANT)
================================ */

const defaultOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://where-is-my-bus-dusky.vercel.app"
];

const envOrigins = process.env.CLIENT_URLS
  ? process.env.CLIENT_URLS.split(",").map(origin => origin.trim())
  : [];

const allowedOrigins = [...new Set([...defaultOrigins, ...envOrigins])];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow server-to-server or tools like Postman
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.error("❌ CORS blocked origin:", origin);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

/* ================================
   MIDDLEWARE ORDER (VERY IMPORTANT)
================================ */

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // 🚨 REQUIRED FOR PREFLIGHT

/* ================================
   ROUTES
================================ */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚍 Bus Tracking API is running",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      buses: "/api/buses",
      bookings: "/api/bookings",
      payments: "/api/payments"
    }
  });
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

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong"
  });
});

/* ================================
   START SERVER
================================ */

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
