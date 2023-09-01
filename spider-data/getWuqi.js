const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const { getTujianData } = require("./api");

const getWuqi = async () => {
  const tujianData = await getTujianData();

  const cailiaoData = tujianData
    .find((f) => f.name === "背包")
    .list.filter((f) => f.ext.match(/武器突破素材/));
  const browser = await puppeteer.launch({
    headless: "new",
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 600, deviceScaleFactor: 1 });

  await analysisCailiao(page, cailiaoData);

  await browser.close();
  return {
    cailiaoData,
  };
};

// 从武器突破素材网页爬取
async function analysisCailiao(page, list) {
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    const { content_id, title } = item;
    console.log("content_id, title: ", content_id, title, i, list.length);

    const url = `https://bbs.mihoyo.com/ys/obc/content/${content_id}/detail?bbs_presentation_style=no_header`;
    await page.goto(url);
    await page.waitForSelector(".obc-tmpl__part");
    const html = await page.content();
    const $ = cheerio.load(html);
    let elements = $(`div[data-tmpl="material"] table tbody tr`);

    // 当前武器材料的信息
    const _info = {};
    elements.map((i, el) => {
      switch (i) {
        case 0:
          //<td rowspan="2" class="h3">
          //  <img alt="" src="https://uploadstatic.mihoyo.com/ys-obc/2021/07/23/15568211/839957ca90527eee0b38c3ca8e7bb3ab_9146402107541629952.png">
          // </td>
          //<td>
          //   <label>名称：</label>
          //   今昔剧画之一角
          //</td>
          _info.imgSrc = $(el).find("td img").attr("src");
          _info.name = $(el)
            .find("td:nth-child(2)")
            .text()
            .trim()
            .replace(/\s+/g, " ");
          break;
        case 1:
          // <td>
          //   <label>获得方式：</label>
          //   <ul>
          //     <li>
          //       <p style="white-space: pre-wrap;">【<a href="/ys/obc/content/2293/detail" data-type="obc-content" target="_blank">砂流之庭</a>（周三/六/日）】炼武秘境：流沙之葬Ⅲ/Ⅳ
          //       </p>
          //     </li>
          //     <li>
          //       <p style="white-space: pre-wrap;">炼金合成</p>
          //     </li>
          //   </ul>
          // </td>
          const _text = $(el).find("td ul li p").text();
          const _html = $(el).find("td ul li p").html();
          _info.getWay = [
            _text.match(/（(.*?)）/)[1],
            _text,
            _html,
            $(el).find("td ul li:nth-child(2) p").text(),
          ];

          break;
        case 2:
          // <td colspan="2" class="obc-tmpl__rich-text">
          //   <p style="white-space: pre-wrap;">描述：赋予武器突破之力的材料。</p>
          //   <p style="white-space: pre-wrap;">　　　在鬼族失落的子守奉公子守歌中，鬼人「虎千代」是一位翩翩少年，拥有优雅勇健的身姿与华丽的容貌。他原本是将军麾下的爱将，曾忠心追随她深入漆黑 的渊薮，击退邪秽之物，为血脉日渐稀薄的鬼族争取功绩。</p>
          //   <p style="white-space: pre-wrap;">　　　纵使如今这样的歌谣已经无人传唱了，以另一种形象流传下来的有角鬼面形象仍然有着非凡的力量。</p>
          // </td>
          _info.describe = $(el).find("td").text();
          break;
        case 3:
          // <td colspan="2" class="obc-tmpl__rich-text">
          //   <p style="white-space: pre-wrap;">用途：武器突破素材</p>
          //   <p style="white-space: pre-wrap;">
          //     　　　 【炼金】
          //     <a href="/ys/obc/content/2374/detail" data-type="a" target="_blank">
          //       今昔剧画之鬼人
          //     </a>
          //   </p>
          // </td>;
          _info.describe = $(el).find("td").text();
          break;
        default:
          break;
      }
    });

    // 需要该武器材料的武器
    _info.wuqi = [];
    $(
      'div[data-tmpl="illustration"] ul[data-target="main.data"] li[data-index="0"] div.obc-tmpl__scroll-x-box tbody tr'
    ).map((i, el) => {
      // <td class="obc-tmpl__fixed-td obc-tmpl-illustration__first-col">
      //   <a href="/ys/obc/content/4201/detail" target="_blank">
      //     <img alt="" src="https://uploadstatic.mihoyo.com/ys-obc/2022/08/12/183046623/680747c67b82c468a6f7d52729d55ab2_8381162963590893436.png" class="obc-tmpl__icon">
      //     <br>
      //     <span>笼钓瓶一心</span>
      //   </a>
      //</td>
      console.log($(el).find("td span").html());
      const _res = {
        name: $(el).find("td span").html(),
        src: $(el).find("td a img").attr("src"),
        count: $(el).find("td:nth-child(2)").text(),
        // 特殊情况 https://bbs.mihoyo.com/ys/obc/content/2371/detail?bbs_presentation_style=no_header

        // <td class="obc-tmpl__scroll-td obc-tmpl-illustration__first-col">
        // <span target="_blank">
        // <img alt="" src="https://uploadstatic.mihoyo.com/ys-obc/2022/08/12/183046623/680747c67b82c468a6f7d52729d55ab2_1410109543333312055.png" class="obc-tmpl__icon"><br>
        // <span>笼钓瓶一心</span>
        // </span></td>、
        //  拿不到 href
        // content_id: $(el)
        //   .find("td a")
        //   .attr("href")
        //   .match(/content\/(\d+)\/detail/)[1],
      };
      console.log(_res);
      _info.wuqi.push(_res);
    });

    item.info = _info;
  }
}
// 从武器网页爬取
async function analysisWuqi() {
  for (let i = 0; i < weaponData.length; i++) {
    const item = weaponData[i];
    const { content_id, title } = item;

    const url = `https://bbs.mihoyo.com/ys/obc/content/${content_id}/detail?bbs_presentation_style=no_header`;
    await page.goto(url);
    await page.waitForSelector(".obc-tmpl__switch-item");
    const html = await page.content();
    const $ = cheerio.load(html);

    let elements = $(`tr td .obc-tmpl__icon-text-num`);
    console.log("content_id, title: ", content_id, title);

    let breakMaterial = [];
    elements.map((i, el) => {
      if (i < 4) {
        const res = {
          src: $(el).find("a img").attr("src"),
          name: $(el).find("a span").html(),
          count: $(el).find(".obc-tmpl__icon-num").text(),
        };
        breakMaterial.push(res);
      }
    });
    item.breakMaterial = breakMaterial;
  }
}

module.exports = getWuqi;
