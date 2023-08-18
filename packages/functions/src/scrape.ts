import { ApiHandler } from "sst/node/api";
import chromium from "chrome-aws-lambda";
import puppeteer from "puppeteer";

export const scrape = ApiHandler(async (_evt) => {
  let result = null;
  let browser = null;
  try {
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();
    await page.goto("https://www.nytimes.com/");

    result = await page.title();
    await browser.close();

    return {
      statusCode: 200,
      body: JSON.stringify({
        result: result,
      }),
    };
  } catch (error: any) {
    throw new Error(error);
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: error?.message,
      }),
    };
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
});
