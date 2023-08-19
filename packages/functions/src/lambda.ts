import { ApiHandler } from "sst/node/api";
import puppeteer from "puppeteer-core";
import chromium from '@sparticuz/chromium';



const YOUR_LOCAL_CHROMIUM_PATH = "F:\sst\tmp\localchromium\chromium\win64-1185505\chrome-win\chrome.exe";



export const handler = ApiHandler(async (_evt)=>{
  let result = null;
  let browser =  null;

try {
  browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport : chromium.defaultViewport,
    executablePath: process.env.IS_LOCAL 
    ? YOUR_LOCAL_CHROMIUM_PATH 
    : await chromium.executablePath(),
    headless: chromium.headless,
  })

const page = await browser.newPage();
await page.goto("https://www.nytimes.com/");

result = await page.title();
await browser.close();

return {
  statusCode: 200,
  body: JSON.stringify({message : result,})
}

} catch(error:any) {
  if(browser !== null){
    await browser.close();
  }
  return {
    statusCode:400,
    body: JSON.stringify({
      error:true,
      message:error?.message,
    })
  }
}
})































// for fetching the database data

// import { ApiHandler } from "sst/node/api";

import { MongoClient } from "mongodb";
let cachedDb:any = null;

async function connectToDatabase(){
  if(cachedDb) return cachedDb

const client = await MongoClient.connect(process.env.MONGODB_URI!);

cachedDb = await client.db("socialmedia");
return cachedDb;
}
export const handler1 = ApiHandler(async (_evt) => {
  const db = await connectToDatabase();
  const users = await db.collection("users").find({}).toArray();
  return {
    statusCode: 200,
    body: JSON.stringify(users,null,2),
  };
});


// `Hello world. The time is ${new Date().toISOString()}`
