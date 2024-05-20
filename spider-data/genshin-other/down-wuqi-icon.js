const axios = require("axios");
const { existPath } = require("../utils/index.js");
const fs = require("fs");
const path = require("path");

async function downImg() {
  if (!existPath("./genshin_data/tujian.json")) {
    let url =
      "https://api-static.mihoyo.com/common/blackboard/ys_obc/v1/home/content/list?app_sn=ys_obc&channel_id=189";
    const res = await axios.get(url);

    const tujianData = res.data.data.list[0].children;

    const _list = tujianData
      .filter((f) => f.name === "武器")[0]
      .list.filter((it) => it.ext.indexOf("武器星级/五星") > -1);

    _list.map((item, index) => {
      const outputPath = path.resolve(
        __dirname,
        "./genshin_data/img/wuqi/" + item.title + ".png"
      );
      // downloadImg(outputPath, item.icon);
      // console.log(item.title, item.icon, index, _list.length);
    });
    console.log("下载完成");
  }
}
downImg();
