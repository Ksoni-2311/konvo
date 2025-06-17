import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import messageRoutes from './routes/message.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { app, server } from './lib/soket.js';
import { connectDB } from './lib/db.js';
import path from 'path';

dotenv.config();
const __dirname = path.resolve();

// ✅ Ensure PORT is available
const PORT = process.env.PORT || 5000;

// ✅ Serving static files in production
if (process.env.NODE_ENV === "production") {
  const staticPath = path.join(__dirname, "../Frontend/dist");
  console.log("🗂️ Serving static files from:", staticPath);

  app.use(express.static(staticPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });
}

app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ✅ Mount routes with debug logs
try {
  console.log("🛣️ Mounting /api/auth...");
  app.use("/api/auth", authRoutes);
} catch (err) {
  console.error("❌ Failed to mount /api/auth:", err);
}

try {
  console.log("🛣️ Mounting /api/messages...");
  app.use("/api/messages", messageRoutes);
} catch (err) {
  console.error("❌ Failed to mount /api/messages:", err);
}

// ✅ Start server with PORT and DB check
server.listen(PORT, () => {
  console.log(`🚀 App is listening at port ${PORT}`);

  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("❌ MONGO_URI is not defined in .env");
    process.exit(1); // Stop the app if DB is misconfigured
  }

  console.log("🔗 Connecting to MongoDB...");
  connectDB();
});
