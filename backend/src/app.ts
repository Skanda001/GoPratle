import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { env } from "./config/env.js";
import requirementRoutes from "./routes/requirementRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { notFoundHandler } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

// ---------------------------------------------------------------------------
// Security
// ---------------------------------------------------------------------------
app.set("trust proxy", 1);
app.use(helmet());
app.disable("x-powered-by");

// CORS — supports comma-separated FRONTEND_URL list
const allowedOrigins = env.FRONTEND_URL.split(",").map((o) => o.trim());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., curl, Supertest)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin ${origin} not allowed`));
      }
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Idempotency-Key", "Authorization"],
  })
);

// ---------------------------------------------------------------------------
// Parsing
// ---------------------------------------------------------------------------
app.use(express.json({ limit: "100kb" }));

// ---------------------------------------------------------------------------
// Logging (skip in test to keep output clean)
// ---------------------------------------------------------------------------
if (env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
app.use("/api/auth", authRoutes);
app.use("/api", requirementRoutes);

// ---------------------------------------------------------------------------
// Not found + Error handlers (must be last)
// ---------------------------------------------------------------------------
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
