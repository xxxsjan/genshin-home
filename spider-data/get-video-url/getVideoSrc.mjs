import puppeteer from "puppeteer";
import { initDb } from "./db.mjs";

export async function getVideoSrc() {
  const db = await initDb();
  const pv = db.data.category
    .find((f) => f[0] === "角色PV")[1]
    .map(({ title, content_id }) => ({ title, content_id }));
  const browser = await puppeteer.launch({
    headless: "new",
    // headless: false,
  });
  const viewportOpt = { width: 1280, height: 720, deviceScaleFactor: 1 };
  const page = await browser.newPage();
  await page.setViewport(viewportOpt);

  const _pv = pv.slice();

  for (const item of _pv) {
    const { title, content_id } = item;
    const src = await getVideoUrl(page, content_id);
    item.src = src;
    console.log(title, src);
  }

  db.data.videoSrc = [["角色PV", _pv]];
  await db.write();
}

async function getVideoUrl(page, content_id) {
  await page.goto(
    `https://bbs.mihoyo.com/sr/wiki/content/${content_id}/detail?bbs_presentation_style=no_header`
  );

  const videoEl = await page.waitForSelector(".detail__content video");

  const src = await videoEl.evaluate((el) => el.getAttribute("src"));

  return src;
}
