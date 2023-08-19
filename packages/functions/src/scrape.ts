import { ApiHandler } from "sst/node/api";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

const YOUR_LOCAL_CHROMIUM_PATH =
  "C:\\Users\\daniu\\my_repos\\sstapp\\packages\\functions\\tmp\\localChromium\\chromium\\win64-1185480\\chrome-win\\chrome.exe";

export const scrape = ApiHandler(async (_evt) => {
  let result = null;
  let browser = null;
  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: process.env.IS_LOCAL
        ? YOUR_LOCAL_CHROMIUM_PATH
        : await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.goto("https://www.google.com/"); // problem

    result = await page.title();
    await browser.close();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: result,
      }),
    };
  } catch (error: any) {
    if (browser !== null) {
      await browser.close();
    }
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: true,
        message: error?.message,
      }),
    };
  }
});
