require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const app = express();

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MONGODB_URI not set in .env");
  process.exit(1);
}

// Database connection
const DB = process.env.MONGO_URI.replace('<PASSWORD>', process.env.MONGO_PASSWORD);

mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDB"))
  .catch((e) => {
    console.error("MongoDB connection error:", e);
    process.exit(1);
  });

app.use(helmet());
app.use(cors({
  origin: ["http://localhost:5173"] // update to your frontend origin(s)
}));
app.use(express.json({ limit: "10kb" }));
app.use(morgan("combined"));

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30
});
app.use(limiter);

// Public endpoints (if any)
app.get('/', (req, res) => res.send('Consent API'));

// ...existing code...
// routes
const consentRouter = require('./routes/consent');
app.use("/api/consent", consentRouter);
// ...existing code...

app.get("/", (req, res) => res.send("Consent API"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));