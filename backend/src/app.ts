import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { swaggerOptions } from "./config/swagger.js";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import companyRoutes from "./routes/company.routes.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";
import mediaRoutes from "./routes/media.routes.js";
import folderRoutes from "./routes/folder.routes.js";
import webhookRoutes from "./routes/webhook.routes.js";
import creativeRoutes from "./routes/creative.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import reportingRoutes from "./routes/reporting.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import snapchatMockRoutes from "./routes/snapchatMock.routes.js";
import linkedinMockRoutes from "./routes/linkedinMock.routes.js";

const app = express();

// Swagger docs
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Stripe webhook — must be mounted BEFORE express.json() so Stripe receives the raw body
app.use("/api/webhooks", webhookRoutes);

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3002",
      "https://jobpulse-smoky.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "unsafe-none" },
    crossOriginEmbedderPolicy: false,
  }),
);

// Global rate limiter — applied to all API routes
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 429, error: "Too many requests." },
});

// Strict limiter for auth endpoints — brute-force protection
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 429, error: "Too many attempts." },
});

/* ROUTES */
app.use("/api/auth" /* , authLimiter */, authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/creatives", creativeRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/reporting", reportingRoutes);
app.use("/api/dashboard", dashboardRoutes);
// Snapchat-shaped mock stats (DB-backed); point SNAPCHAT_API_BASE here when SNAPCHAT_USE_MOCK=true
app.use("/api/mock/snapchat", snapchatMockRoutes);
// LinkedIn-shaped mock adAnalytics (DB-backed); point LINKEDIN_API_BASE to http://localhost:<PORT>/rest when LINKEDIN_USE_MOCK=true
app.use("/rest", linkedinMockRoutes);

// Health check
app.get("/", (req: Request, res: Response) => {
  res.send("Server is running!");
});

export default app;
