import cors from "cors";
import express from "express";
import morgan from "morgan";
import fs from "node:fs";
import path from "node:path";
import swaggerUi from "swagger-ui-express";
import YAML from "yaml";

import classRoutes from "./modules/classes/class.routes.js";
import studentRoutes from "./modules/students/student.routes.js";

const app = express();

// Swagger YAML configuration
const swaggerDocument = YAML.parse(
  fs.readFileSync(path.resolve("src/docs/swagger.yaml"), "utf8"),
);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
  }),
);

app.use(express.json({ limit: "1mb" }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API Routes
app.use("/api/v1/students", studentRoutes);
app.use("/api/v1/classes", classRoutes);

// Health Check
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Gradev API is running.",
    timestamp: new Date().toISOString(),
  });
});

export default app;
