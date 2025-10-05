const express = require("express");
const verifyDoctor = require("./api/verify-doctor");

const app = express();
const port = process.env.PORT || 10000;

app.get("/api/verify-doctor", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send("❌ لطفاً کد نظام پزشکی را وارد کنید");

  try {
    const result = await verifyDoctor(code);
    if (result) {
      res.status(200).send(`✅ معتبره:\n${result}`);
    } else {
      res.status(404).send("❌ نامعتبر یا پیدا نشد");
    }
  } catch (err) {
    console.error("❌ خطا در Puppeteer:", err.message);
    res.status(500).send("❌ خطا در اعتبارسنجی");
  }
});

app.listen(port, () => {
  console.log(`✅ dr1-api is running on port ${port}`);
});
