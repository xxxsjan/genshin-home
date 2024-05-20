const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { tujianApi } = require("./api");

const oldTianfu = require("./data/role-with-tianfu.json");

function isDataExist(content_id) {
  return oldTianfu.find((f) => f.content_id === content_id);
}

async function getTianfu() {
  const tujianData = await tujianApi();

  const roleData = tujianData.find((f) => f.name === "角色").list;

  const formatData = roleData.map((m) => ({
    content_id: m.content_id,
    title: m.title,
  }));

  const browser = await puppeteer.launch({
    headless: "new",
    // headless: false,
  });
  const viewportOpt = { width: 1200, height: 600, deviceScaleFactor: 1 };
  const page = await browser.newPage();
  await page.setViewport(viewportOpt);

  // 详情页
  for (let i = 0; i < formatData.length; i++) {
    const item = formatData[i];
    const { content_id, title } = item;
    const _oldData = isDataExist(content_id);
    if (!!_oldData) {
      console.log("天赋数据 使用缓存", title,  _oldData.tianfu);
      item.tianfu = _oldData.tianfu;
      continue;
    }

    const url = `https://bbs.mihoyo.com/ys/obc/content/${content_id}/detail?bbs_presentation_style=no_header`;
    await page.goto(url);
    // 等元素出现
    await page.waitForSelector(".obc-tmpl__scroll-x-box");

    const html = await page.content();
    const $ = cheerio.load(html);

    let tianfu = $(
      `.obc-tmpl__scroll-td.goto-diff-wrap .custom-entry-wrapper .entry-material-box.entry-material-small .name`
    ).text();

    const res = tianfu.match(/(「.*?」)/)[0];
    console.log(
      "天赋数据获取中: ",
      content_id,
      title,
      res,
      i,
      formatData.length
    );
    item.tianfu = res;
  }
  // console.log(formatData, formatData.length);

  await browser.close();

  return {
    roleWithTianfu: formatData,
  };
}
module.exports = getTianfu;
