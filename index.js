const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const verifyDoctor = require("./api/verify-doctor");

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// تست زنده بودن سرور
app.get("/", (req, res) => {
  res.send("✅ dr1-api is running");
});

// مسیر اعتبارسنجی پزشک
app.get("/api/verify-doctor", verifyDoctor);

// هندلر 404 برای مسیرهای نامعتبر
app.use((req, res) => {
  res.status(404).json({ error: "مسیر یافت نشد" });
});

// اجرای سرور
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ dr1-api is running on port ${PORT}`);
});
