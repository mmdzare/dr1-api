const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

// Routes
const verifyDoctorRoute = require("./api/verify-doctor");

// Global Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Health Check
app.get("/", (req, res) => {
  res.status(200).send("✅ dr1-api is running");
});

// API Routes
app.use("/api/verify-doctor", verifyDoctorRoute);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "مسیر یافت نشد" });
});

// Server Init
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ dr1-api is running on port ${PORT}`);
});
