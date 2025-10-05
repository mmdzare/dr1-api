const express = require("express");
const cors = require("cors");
const morgan = require("morgan"); // لاگ‌گیری درخواست‌ها
const verifyDoctor = require("./api/verify-doctor");

const app = express();

// فعال‌سازی CORS برای ارتباط با فرانت
app.use(cors());

// فعال‌سازی دریافت JSON از body
app.use(express.json());

// لاگ‌گیری برای دیباگ راحت‌تر
app.use(morgan("dev"));

// مسیر اعتبارسنجی پزشک‌ها
app.post("/api/verify-doctor", verifyDoctor);

// هندل کردن مسیرهای اشتباه
app.use((req, res) => {
  res.status(404).json({ error: "مسیر یافت نشد" });
});

// اجرای سرور
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ dr1-api is running on port ${PORT}`);
});
