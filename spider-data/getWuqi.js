const {
  tujianApi,
  wikiEntryApi,
  parseWuqiCailiaoInfo,
} = require("./api");

const old_cailiao = require("./data/wuqi-tupo-cailiao.json");

async function fetchCailiaoInfo(content_id) {
  const page = await wikiEntryApi(content_id);
  if (!page) return null;
  return parseWuqiCailiaoInfo(page);
}

const cailiaoGetWuqi = async () => {
  const tujianData = await tujianApi();

  const remote_cailiaoList = tujianData
    .find((f) => f.name === "背包")
    .list.filter((f) => f.ext.match(/武器突破素材/));

  const cailiaoData = [];

  for (let i = 0; i < remote_cailiaoList.length; i++) {
    const item = remote_cailiaoList[i];
    const { content_id, title } = item;
    const cacheItem = old_cailiao.find((f) => f.content_id === content_id);

    let info;
    try {
      info = await fetchCailiaoInfo(content_id);
    } catch (err) {
      console.warn("材料请求失败:", content_id, title, err.message);
      info = null;
    }

    if (!info) {
      if (cacheItem?.info) {
        console.log(content_id, title, "接口无数据，使用缓存");
        cailiaoData.push(cacheItem);
      } else {
        console.log(content_id, title, "接口无数据且无缓存，跳过");
      }
      continue;
    }

    const remoteCount = info.wuqi.length;
    const cacheCount = cacheItem?.info?.wuqi?.length ?? 0;

    if (cacheItem && cacheCount === remoteCount) {
      cailiaoData.push({ ...cacheItem, info });
      console.log(
        content_id,
        title,
        "已更新",
        `${i + 1}/${remote_cailiaoList.length}`,
        `武器 ${remoteCount}`
      );
      continue;
    }

    item.info = info;
    cailiaoData.push(item);
    console.log(
      content_id,
      title,
      cacheCount ? `武器新增 ${cacheCount}→${remoteCount}` : "新建",
      `${i + 1}/${remote_cailiaoList.length}`
    );
  }

  return { cailiaoData };
};

module.exports = cailiaoGetWuqi;
