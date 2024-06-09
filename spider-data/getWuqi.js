const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const { tujianApi } = require("./api");

// const old_wuqi = require("./data/tujian_wuqi.json");
const old_cailiao = require("./data/wuqi-tupo-cailiao.json");
function sleep(time = 1000) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}
// 从武器突破素材网页爬取
const cailiaoGetWuqi = async () => {
  const tujianData = await tujianApi();

  const remote_cailiaoList = tujianData
    .find((f) => f.name === "背包")
    .list.filter((f) => f.ext.match(/武器突破素材/));

  const browser = await puppeteer.launch({
    headless: "new",
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 600, deviceScaleFactor: 1 });

  // await analysisCailiaoPage(page, 7038);
  // return;

  const cailiaoData = [];

  for (let i = 0; i < remote_cailiaoList.length; i++) {
    const item = remote_cailiaoList[i];
    const { content_id, title } = item;

    const cacheItem = old_cailiao.find((f) => f.content_id === content_id);

    const info = await analysisCailiaoPage(page, content_id);

    if (cacheItem?.info?.wuqi.length == info.wuqi.length) {
      cailiaoData.push(cacheItem);
      console.log(
        content_id,
        title,
        "武器没更新，跳过",
        cacheItem?.info?.wuqi.length,
        info.wuqi.length
      );
      continue;
    }

    if (cacheItem?.info?.wuqi?.length < info.wuqi.length) {
      item.info = info;
      cailiaoData.push(item);
    } else {
      console.log(
        "远端居然少了",
        cacheItem?.info?.wuqi?.length,
        info.wuqi.length,
        content_id,
        title
      );
    }
  }

  await browser.close();

  return {
    cailiaoData,
  };
};

async function analysisCailiaoPage(page, content_id) {
  const url = `https://bbs.mihoyo.com/ys/obc/content/${content_id}/detail?bbs_presentation_style=no_header`;
  console.log("url: ", url);

  await page.goto(url);

  // https://bbs.mihoyo.com/ys/obc/content/7038/detail?bbs_presentation_style=no_header

  await page.waitForSelector("table.obc-tmpl-part.obc-tmpl-materialBaseInfo");
  await sleep(2222);
  const html = await page.content();
  const $ = cheerio.load(html);
  // 当前武器材料的信息
  const _info = {
    wuqi: [], // 需要该武器材料的武器
  };
  const tableEl = $("table.obc-tmpl-part.obc-tmpl-materialBaseInfo");

  const imgSrc = $(tableEl).find("td img").attr("src");

  const name = $(tableEl)
    .find("tr:nth-child(1) td:nth-child(2)")
    .text()
    .split("\n")[1]
    .trim();

  const getWay = [];
  $(tableEl)
    .find("tr:nth-child(2) td div div p")
    .map((i, el) => {
      getWay.push($(el).text());
    });

  getWay.unshift(getWay[0].match(/（(.*?)）/)[1]);

  const describe = $(tableEl)
    .find("tr:nth-child(3) td.obc-tmpl__rich-text")
    .text();
  // 用途
  const purpose = $(tableEl).find("tr:nth-child(4) td").text();

  _info.name = name;
  _info.src = imgSrc;
  _info.getWay = getWay;
  _info.describe = describe;
  _info.purpose = purpose;

  // 三星材料 的 table会多一点 https://bbs.mihoyo.com/ys/obc/content/7040/detail?bbs_presentation_style=no_header
  // 二星的会少一点 https://bbs.mihoyo.com/ys/obc/content/7032/detail?bbs_presentation_style=no_header

  const isThreeStar = $(".swiper-pagination li").length !== 0;

  $(
    isThreeStar
      ? ".obc-tmpl-x-scroll.swiper-slide.swiper-slide-active div.obc-tmpl-x-box tbody tr"
      : ".obc-tmpl-x-scroll.swiper-slide div.obc-tmpl-x-box tbody tr"
  ).map((i, el) => {
    const _res = {
      name: $(el).find("td:nth-child(1) p span a span").text(),
      src: $(el).find("td:nth-child(1) p span a img").attr("src"),
      count: $(el).find("td:nth-child(2) p").text(),
    };

    _info.wuqi.push(_res);
  });

  return _info;
}

module.exports = cailiaoGetWuqi;

// 从武器网页爬取 突破材料
async function analysisWuqi(list) {
  const tujianData = await tujianApi();

  const remote_wuqi = tujianData
    .find((f) => f.name === "武器")
    .list.filter((f) => f.ext.match(/(四星|五星)/));

  const browser = await puppeteer.launch({
    headless: "new",
  });

  const page = await browser.newPage();

  // const breakMaterial = await analysisPage(page, 500507);
  // console.log("breakMaterial: ", breakMaterial);
  // return;

  for (let i = 0; i < remote_wuqi.length; i++) {
    const item = remote_wuqi[i];
    const { content_id, title } = item;

    const breakMaterial = await analysisPage(page, content_id);

    item.breakMaterial = breakMaterial;
  }

  await browser.close();

  return {
    cailiaoData: [],
  };
}

async function analysisPage(page, content_id) {
  // const url =
  //   "https://bbs.mihoyo.com/ys/obc/content/500507/detail?bbs_presentation_style=no_header";
  const url = `https://bbs.mihoyo.com/ys/obc/content/${content_id}/detail?bbs_presentation_style=no_header`;

  await page.goto(url);
  await page.waitForSelector(".swiper-slide.swiper-slide-active");
  const html = await page.content();
  const $ = cheerio.load(html);

  const tableEl = $("div.obc-tmpl-part--align-left table");

  // const imgSrc = $(tableEl).find("td img").attr("src");
  // const name = $(tableEl)
  //   .find("tr td.material-td")
  //   .text()
  //   .split("\n")[1]
  //   .trim();
  // const getWay = $(tableEl).find(".obc-color-td").text();
  // const describe = $(tableEl)
  //   .find(".obc-tmpl__rich-text p:nth-child(4)")
  //   .text();

  const cailiaoEl = $(`div[data-index="0"] table+table tbody tr td div`);
  let breakMaterial = [];

  cailiaoEl.map((i, el) => {
    const res = {
      src: $(el).find("a img").attr("src"),
      name: trimStr($(el).find("a span").html()),
      count: trimStr($(el).find(".obc-tmpl__icon-num").text()),
    };
    breakMaterial.push(res);
  });
  return breakMaterial;
}

function trimStr(str) {
  return str.replaceAll("\n", "").trim();
}
