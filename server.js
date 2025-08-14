// server.js
require("dotenv").config();
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const app = express();

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

// Validate required env vars
if (!MONGO_URI) {
  console.error("MONGO_URI not set in .env");
  process.exit(1);
}

// Connect to MongoDB
const dbUri = MONGO_URI.replace("<PASSWORD>", process.env.MONGO_PASSWORD || "");
mongoose
  .connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((e) => {
    console.error("MongoDB connection error:", e);
    process.exit(1);
  });

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: ["http://localhost:5173"], // update to real frontend origin(s) in production
  })
);
app.use(express.json({ limit: "10kb" }));
app.use(morgan("combined"));

// Rate limiter
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30,
});
app.use(limiter);

// Serve React build (static files)
const clientBuildPath = path.join(__dirname, "survey-app/dist");
app.use(express.static(clientBuildPath));

// Example health endpoint
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// API routes
const consentRouter = require("./routes/consent");
app.use("/api/consent", consentRouter);

// Catch-all: serve React app for non-API routes
app.get("*", (req, res, next) => {
  // If request is for an API route, forward to next (which will return 404)
  if (req.originalUrl.startsWith("/api/")) {
    return next();
  }

  // For all other routes, serve index.html from the build
  res.sendFile(path.join(clientBuildPath, "index.html"), (err) => {
    if (err) {
      next(err);
    }
  });
});

// Simple 404 handler for API routes and other not-found errors
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// Simple error handler (customize as needed)
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || "Internal Server Error",
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));