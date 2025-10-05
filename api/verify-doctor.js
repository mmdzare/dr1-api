const puppeteer = require("puppeteer");

module.exports = async function verifyDoctor(code) {
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

  await browser.close();
  return result;
};
