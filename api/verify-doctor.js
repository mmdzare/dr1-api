const axios = require("axios");

module.exports = async function verifyDoctor(code) {
  try {
    const res = await axios.get("https://membersearch.irimc.org", {
      params: { code },
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    if (res.data.includes("نتیجه‌ای یافت نشد")) {
      return null;
    }

    return "✅ معتبره یا پاسخ دریافت شد";
  } catch (err) {
    throw new Error("❌ خطا در اتصال یا دریافت داده");
  }
};
