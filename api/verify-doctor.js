const axios = require("axios");
const cheerio = require("cheerio");

module.exports = async function (req, res) {
  // فعال‌سازی CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // هندل کردن preflight
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "روش درخواست مجاز نیست" });

  const { code } = req.query;
  if (!code || !/^\d{4,8}$/.test(code)) {
    return res.status(400).json({ error: "کد نظام پزشکی نامعتبر است" });
  }

  const url = `https://membersearch.irimc.org/searchresult?MedicalSystemNo=${encodeURIComponent(code)}`;

  try {
    const response = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      timeout: 15000,
    });

    const html = response.data;
    if (!html || typeof html !== "string") {
      return res.status(502).json({ error: "پاسخ نامعتبر از سرور مقصد" });
    }

    const $ = cheerio.load(html);
    const rows = $("table tbody tr");
    const results = [];

    rows.each((_, row) => {
      const tds = $(row).find("td");
      if (tds.length >= 6) {
        results.push({
          firstName: tds.eq(0).text().trim(),
          lastName: tds.eq(1).text().trim(),
          medicalCode: tds.eq(2).text().trim(),
          field: tds.eq(3).text().trim(),
          city: tds.eq(4).text().trim(),
          membershipType: tds.eq(5).text().trim(),
          profileUrl: tds.eq(6).find("a").attr("href") || null,
        });
      }
    });

    if (results.length === 0) {
      return res.status(404).json({ error: "هیچ نتیجه‌ای پیدا نشد" });
    }

    return res.status(200).json(results.length === 1 ? results[0] : results);

  } catch (err) {
    const status = err.response?.status || 500;
    const message = err.response?.statusText || err.message || "خطای ناشناخته";

    return res.status(status).json({
      error: "خطا در ارتباط با سایت نظام پزشکی",
      details: message,
    });
  }
};
