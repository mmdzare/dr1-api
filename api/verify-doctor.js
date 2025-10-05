const express = require("express");
const puppeteer = require("puppeteer");
const router = express.Router();

router.get("/", async (req, res) => {
  const code = req.query.code?.trim();

  const isValidCode = /^\d{4,8}$/.test(code);
  if (!code || !isValidCode) {
    return res.status(400).json({ error: "کد نظام پزشکی نامعتبر است" });
  }

  let browser;

  try {
    browser = await puppeteer.launch({ executablePath: "/opt/render/.cache/puppeteer/chrome/linux-141.0.7390.54/chrome-linux64/chrome",
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();
    await page.goto("https://membersearch.irimc.org/", {
      waitUntil: "networkidle2",
      timeout: 15000
    });

    await page.type("#txtMedicalSystemNo", code);
    await page.click("#btnSearch");
    await page.waitForSelector("table tbody tr", { timeout: 5000 });

    const result = await page.evaluate(() => {
      const row = document.querySelector("table tbody tr");
      if (!row) return null;

      const tds = row.querySelectorAll("td");
      if (tds.length < 6) return null;

      return {
        firstName: tds[0].innerText.trim(),
        lastName: tds[1].innerText.trim(),
        medicalCode: tds[2].innerText.trim(),
        field: tds[3].innerText.trim(),
        city: tds[4].innerText.trim(),
        membershipType: tds[5].innerText.trim(),
        verified: true,
        profileUrl: "https://membersearch.irimc.org/"
      };
    });

    if (!result) {
      return res.status(404).json({
        error: `هیچ پزشک با کد ${code} یافت نشد یا اطلاعات ناقص است`
      });
    }

    return res.status(200).json(result);
  } catch (err) {
    console.error("❌ خطا در Puppeteer:", err);
    return res.status(500).json({
      error: "خطا در اعتبارسنجی پزشک یا اتصال به سایت رسمی"
    });
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch (closeErr) {
        console.warn("⚠️ خطا در بستن مرورگر:", closeErr);
      }
    }
  }
});

module.exports = router;
