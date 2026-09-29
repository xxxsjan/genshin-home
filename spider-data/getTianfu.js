const { tujianApi, wikiEntryApi, parseRoleTianfu } = require("./api");

const oldTianfu = require("./data/role-with-tianfu.json");

function cachedTianfu(content_id) {
  const hit = oldTianfu.find((f) => f.content_id === content_id);
  // 只有真正拿到天赋才复用；预告角色下次继续请求
  return hit?.tianfu ? hit : null;
}

async function fetchTianfu(content_id) {
  const page = await wikiEntryApi(content_id);
  if (!page) return null;
  return parseRoleTianfu(page);
}

async function getTianfu() {
  const tujianData = await tujianApi();
  const roleData = tujianData.find((f) => f.name === "角色").list;
  const formatData = [];

  for (let i = 0; i < roleData.length; i++) {
    const { content_id, title } = roleData[i];
    const item = { content_id, title };

    const cached = cachedTianfu(content_id);
    if (cached) {
      console.log("天赋数据 使用缓存", title, cached.tianfu);
      item.tianfu = cached.tianfu;
      formatData.push(item);
      continue;
    }

    try {
      const tianfu = await fetchTianfu(content_id);
      if (tianfu) {
        item.tianfu = tianfu;
        console.log(
          "天赋数据获取中:",
          content_id,
          title,
          tianfu,
          `${i + 1}/${roleData.length}`
        );
      } else {
        console.log(
          "天赋数据暂无（详情未上线或预告）:",
          content_id,
          title,
          `${i + 1}/${roleData.length}`
        );
      }
    } catch (err) {
      console.warn("天赋请求失败:", content_id, title, err.message);
    }

    formatData.push(item);
  }

  return { roleWithTianfu: formatData };
}

module.exports = {
  getTianfu,
};
