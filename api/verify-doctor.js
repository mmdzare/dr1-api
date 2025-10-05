const { chromium } = require("playwright");

module.exports = async function verifyDoctor(code) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto("https://membersearch.irimc.org", { waitUntil: "domcontentloaded" });

  await page.fill("#txtCode", code);
  await page.click("#btnSearch");
  await page.waitForSelector("#resultTable", { timeout: 10000 });

  const result = await page.evaluate(() => {
    const table = document.querySelector("#resultTable");
    return table ? table.innerText : null;
  });

  await browser.close();
  return result;
};
