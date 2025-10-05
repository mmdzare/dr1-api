const puppeteer = require("puppeteer");

async function verifyDoctor(code) {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();
  await page.goto("https://membersearch.irimc.org", { waitUntil: "domcontentloaded" });

  await page.type("#txtCode", code);
  await page.click("#btnSearch");
  await page.waitForSelector("#resultTable", { timeout: 10000 });

  const result = await page.evaluate(() => {
    const table = document.querySelector("#resultTable");
    return table ? table.innerText : null;
  });

  if (result) {
    console.log(`✅ معتبره | کد: ${code}\n${result}`);
  } else {
    console.log(`❌ نامعتبر یا پیدا نشد | کد: ${code}`);
  }

  await browser.close();
}

const code = process.argv[2];
if (!code) {
  console.error("❌ لطفاً کد نظام پزشکی را وارد کنید");
  process.exit(1);
}

verifyDoctor(code);
