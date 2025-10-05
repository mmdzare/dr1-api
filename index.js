const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const verifyDoctor = require("./api/verify-doctor");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.get("/", (req, res) => {
  res.send("✅ dr1-api is running");
});

app.get("/api/verify-doctor", verifyDoctor);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "مسیر یافت نشد" });
});

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ dr1-api is running on port ${PORT}`);
});
