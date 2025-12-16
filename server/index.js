import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import connectDB from "./utils/db.js";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import busRoutes from "./routes/busRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();

const app = express();

// Middleware
const allowedOrigins = (process.env.CLIENT_URLS || process.env.CLIENT_URL || "http://localhost:5173")
    .split(",")
    .map(origin => origin.trim())
    .filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        console.warn(`CORS blocked request from origin: ${origin}`);
        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
}));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.get("/", (req, res) => {
    res.json({ 
        message: "Bus Tracking API is running!",
        version: "1.0.0",
        endpoints: {
            auth: "/api/auth",
            buses: "/api/buses",
            bookings: "/api/bookings"
        }
    });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/buses", busRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);

// 404 handler - must be after all routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
        path: req.originalUrl
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false,
        message: "Something went wrong!",
        error: process.env.NODE_ENV === "development" ? err.message : "Internal server error"
    });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, async () => {
    await connectDB(); // Wait for database connection before starting server
    console.log(`🚀 Server is running at port ${PORT}`);
    console.log(`📚 API Documentation: http://localhost:${PORT}`);
});
