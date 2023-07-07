const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { getTujianData } = require("./api");

async function getTianfu() {
  const tujianData = await getTujianData();

  const roleData = tujianData.find((f) => f.name === "角色").list;

  const formatData = roleData.map((m) => {
    return {
      content_id: m.content_id,
      title: m.title,
    };
  });

  const browser = await puppeteer.launch({
    headless: "new",
  });
  const viewportOpt = { width: 1200, height: 600, deviceScaleFactor: 1 };
  const page = await browser.newPage();
  await page.setViewport(viewportOpt);

  // 详情页
  for (let i = 0; i < formatData.length; i++) {
    const item = formatData[i];
    const { content_id, title } = item;
    const url = `https://bbs.mihoyo.com/ys/obc/content/${content_id}/detail?bbs_presentation_style=no_header`;
    await page.goto(url);
    // 等元素出现
    await page.waitForSelector(".obc-tmpl__fixed-table");

    const html = await page.content();
    const $ = cheerio.load(html);

    let tianfu = $(
      `div[data-part="skill"] .obc-tmpl__scroll-x-wrapper table  .obc-tmpl__icon-text-num .obc-tmpl__icon-text`
    ).text();

    const res = tianfu.match(/(「.*?」)/)[0];
    console.log("数据获取中: ", content_id, title, res, i, formatData.length);
    item.tianfu = res;
  }
  console.log(formatData);

  await browser.close();

  return {
    roleWithTianfu: formatData,
  };
}
modules.exports = getTianfu;
