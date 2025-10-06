#!/bin/bash

echo "📦 ساخت پوشه پروژه..."
mkdir -p dr1-api && cd dr1-api

echo "📄 ساخت فایل index.js..."
cat <<'EOL' > index.js
const express = require("express");
const { chromium } = require("playwright");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/api/verify-doctor", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).json({ error: "پارامتر code الزامی است" });

  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto("https://membersearch.irimc.org/", { waitUntil: "networkidle" });
    await page.waitForSelector("#McCode", { timeout: 10000 });
    await page.fill("#McCode", code);
    await page.click('button[type="submit"]');
    await page.waitForSelector("#resultTable", { timeout: 10000 });

    const result = await page.evaluate(() => {
      const cells = document.querySelectorAll("#resultTable td");
      return {
        valid: true,
        name: cells[1]?.innerText.trim(),
        specialty: cells[2]?.innerText.trim(),
        city: cells[3]?.innerText.trim(),
        status: cells[4]?.innerText.trim()
      };
    });

    await browser.close();
    res.json(result);
  } catch (err) {
    res.json({
      valid: false,
      error: "خطا در دریافت اطلاعات",
      details: err.message
    });
  }
});

app.get("/", (req, res) => {
  res.send("✅ DR1 API با Playwright آماده است");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
EOL

echo "📄 ساخت فایل package.json..."
cat <<'EOL' > package.json
{
  "name": "dr1-api",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "postinstall": "npx playwright install"
  },
  "dependencies": {
    "express": "^4.18.2",
    "playwright": "^1.43.0"
  }
}
EOL

echo "📦 نصب پکیج‌ها..."
npm install

echo "🚀 اجرای سرور..."
npm start
