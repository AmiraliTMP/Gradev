import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import fs from "node:fs";
import path from "node:path";
import swaggerUi from "swagger-ui-express";
import YAML from "yaml";

import errorMiddleware from "./middlewares/error.middleware.js";

import assessmentRoutes from "./modules/assessments/assessment.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import classRoutes from "./modules/classes/class.routes.js";
import studentRoutes from "./modules/students/student.routes.js";

const app = express();

// --------------------------------------------------
// Swagger YAML Configuration
// --------------------------------------------------

app.get("/api-docs.json", (req, res) => {
  console.log("Swagger JSON endpoint accessed");

  res.status(200).json(swaggerDocument);
});

const swaggerDocument = YAML.parse(
  fs.readFileSync(path.resolve("src/docs/swagger.yaml"), "utf8"),
);

// --------------------------------------------------
// CORS Configuration
// --------------------------------------------------

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

// --------------------------------------------------
// Request Parsers
// --------------------------------------------------

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

// --------------------------------------------------
// HTTP Request Logger
// --------------------------------------------------

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// --------------------------------------------------
// Swagger Documentation
// --------------------------------------------------

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// --------------------------------------------------
// API Routes
// --------------------------------------------------

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/students", studentRoutes);
app.use("/api/v1/classes", classRoutes);
app.use("/api/v1/assessments", assessmentRoutes);

// --------------------------------------------------
// Health Check
// --------------------------------------------------

app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Gradev API is running.",
    timestamp: new Date().toISOString(),
  });
});

// --------------------------------------------------
// Centralized Error Handler
// --------------------------------------------------

app.use(errorMiddleware);

export default app;
