import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { connectDB } from './lib/db.js';
import path from 'path';

import authRoutes from './routes/auth.routes.js';
import messageRoutes from './routes/message.routes.js';
import { app, server } from './lib/soket.js';

dotenv.config();

const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

console.log("Starting server...");

// Middleware setup
app.use(cookieParser());
console.log("cookieParser middleware added.");

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
console.log("CORS middleware added.");

app.use(express.json({ limit: "10mb" }));
console.log("express.json middleware added with 10mb limit.");

app.use(express.urlencoded({ extended: true, limit: "10mb" }));
console.log("express.urlencoded middleware added with 10mb limit.");

// Route mounting with try-catch for debugging
try {
  console.log("Mounting /api/auth routes...");
  app.use("/api/auth", authRoutes);
  console.log("Mounted /api/auth routes successfully.");
} catch (err) {
  console.error("Error mounting /api/auth routes:", err);
}

try {
  console.log("Mounting /api/messages routes...");
  app.use("/api/messages", messageRoutes);
  console.log("Mounted /api/messages routes successfully.");
} catch (err) {
  console.error("Error mounting /api/messages routes:", err);
}

// Serve static files in production mode
if (process.env.NODE_ENV === "production") {
  const staticPath = path.join(__dirname, "../Frontend/dist");
  console.log("Production mode detected. Serving static files from:", staticPath);

  try {
    app.use(express.static(staticPath));
    console.log("Static middleware added.");

    app.get("*", (req, res) => {
      res.sendFile(path.join(staticPath, "index.html"));
    });
    console.log("Catch-all route for SPA added.");
  } catch (err) {
    console.error("Error setting up static middleware or catch-all route:", err);
  }
}

// Start server and connect DB
server.listen(PORT, () => {
  console.log(`App is listening at port ${PORT}`);
  connectDB()
    .then(() => console.log("Database connected successfully."))
    .catch((err) => console.error("Database connection error:", err));
});
