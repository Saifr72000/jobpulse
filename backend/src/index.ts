import "dotenv/config"; // Must be FIRST - loads env vars before other imports
import express, { type Request, type Response, type NextFunction } from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import userRoutes from "./routes/user.routes.js";
import authRoutes  from "./routes/auth.routes.js";
import {authenticateUser} from "./middlewares/auth.middleware.js";
import {requestValidator} from "./middlewares/requestValidator.middleware.js";

const app = express();

//middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);
app.use(express.json()); // To parse JSON request bodies
app.use(cookieParser());
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "unsafe-none" },
    crossOriginEmbedderPolicy: false,
  })
);
/* app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests, please try again later" },
})); */

/* ROUTES */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
//need to add ratelimit middleware afterwards for all routes

const MONGO_URI =
  process.env.MONGO_DB_URL || "mongodb+srv://saif_db_user:bZvQrVLdS6XQOIcb@jobpulse-cluster.fstw20s.mongodb.net/";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // 5 seconds timeout
    });
    console.log("Connected to MongoDB!");
    console.log("MongoDB URI:", MONGO_URI);
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1); // Exit process on failure
  }
};

// Connect to the database
await connectDB();

// Simple Test Route
app.get("/", (req: Request, res: Response) => {
  res.send(" Server is running, and MongoDB is connected!");
});

const PORT = 2000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});