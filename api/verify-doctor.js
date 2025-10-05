const fetch = require("node-fetch");
const cheerio = require("cheerio");

module.exports = async (req, res) => {
  const code = req.query.code;
  if (!code || !/^\d{4,8}$/.test(code)) {
    return res.status(400).json({ error: "کد نظام پزشکی نامعتبر است" });
  }

  try {
    const url = `https://membersearch.irimc.org/searchresult?MedicalSystemNo=${encodeURIComponent(code)}`;
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    const html = await response.text();
    const $ = cheerio.load(html);
    const row = $("table tbody tr").first();
    const tds = row.find("td");

    if (tds.length < 6) {
      return res.status(404).json({ error: "پزشک یافت نشد" });
    }

    const result = {
      firstName: tds.eq(0).text().trim(),
      lastName: tds.eq(1).text().trim(),
      medicalCode: tds.eq(2).text().trim(),
      field: tds.eq(3).text().trim(),
      city: tds.eq(4).text().trim(),
      membershipType: tds.eq(5).text().trim(),
    };

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: "خطا در اعتبارسنجی پزشک" });
  }
};
