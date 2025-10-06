const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/api/verify-doctor', async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'Medical code is required' });

  try {
    // مرحله ۱: گرفتن صفحه اصلی برای استخراج توکن
    const pageRes = await axios.get('https://membersearch.irimc.org/');
    const $ = cheerio.load(pageRes.data);
    const token = $('input[name="__RequestVerificationToken"]').val();

    if (!token) {
      return res.status(500).json({ error: 'Verification token not found' });
    }

    // مرحله ۲: ارسال فرم به /searchresult
    const formData = new URLSearchParams();
    formData.append('__RequestVerificationToken', token);
    formData.append('McCode', code);

    const searchRes = await axios.post(
      'https://membersearch.irimc.org/searchresult',
      formData.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cookie': pageRes.headers['set-cookie']?.join('; ') || ''
        }
      }
    );

    // مرحله ۳: پارس کردن جدول نتایج به صورت داینامیک
    const $$ = cheerio.load(searchRes.data);
    const headers = [];

    // گرفتن عنوان ستون‌ها
    $$('table.table-striped thead th').each((i, th) => {
      headers.push($$(th).text().trim());
    });

    const rows = [];
    $$('table.table-striped tbody tr').each((i, el) => {
      const cells = $$(el).find('td');
      const row = {};
      cells.each((j, td) => {
        const header = headers[j] || `col${j}`;
        const link = $$(td).find('a').attr('href');
        if (link) {
          row[header] = `https://membersearch.irimc.org${link}`;
        } else {
          row[header] = $$(td).text().trim();
        }
      });
      rows.push(row);
    });

    if (rows.length === 0) {
      return res.json({ code, message: "هیچ پزشکی با این کد پیدا نشد" });
    }

    res.json({ code, rows });

  } catch (err) {
    console.error("❌ Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ dr1-api is running on port ${PORT}`);
});
