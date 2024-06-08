import axios from "axios";
import { initDb } from "./db.mjs";

const db = await initDb();

export async function getRemoteData() {
  const res = await axios.get(
    "https://api-static.mihoyo.com/common/blackboard/sr_wiki/v1/home/content/list?app_sn=sr_wiki&channel_id=21"
  );

  const list = res.data.data.list;
  const count = list
    .find((f) => f.name === "影音回廊")
    ?.children.map((c) => {
      return [c.name, c.list.length];
    });

  const hadChanged = count.toString() !== db.data.count.toString();

  if (hadChanged) {
    db.data.list = list;
    db.data.count = count;
    const category = getCategory(list);
    db.data.category = category;
    await db.write();
  } else {
    console.log("数据未更新，本地不保存", count.toString());
  }
}

function getCategoryText(str) {
  const text = JSON.parse(str)?.c_27.filter.text;

  const category = JSON.parse(text)[0].split("/")[1];
  return category;
}

function getCategory(list) {
  const gameVideo = list[0].children.find((f) => f.name === "游戏视频").list;
  const categoryMap = new Map();
  gameVideo.forEach((m) => {
    const category = getCategoryText(m.ext);
    if (categoryMap.has(category)) {
      categoryMap.get(category).push(m);
    } else {
      categoryMap.set(category, [m]);
    }
  });
  const category = Array.from(categoryMap.entries());
  return category;
}
