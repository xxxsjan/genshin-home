const axios = require("axios");

const LIST_URL =
  "https://act-api-takumi-static.mihoyo.com/common/blackboard/ys_obc/v1/home/content/list";

const WIKI_ENTRY_URL =
  "https://api-takumi.mihoyo.com/hoyowiki/genshin/wapi/entry_page";

const defaultHeaders = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Referer: "https://www.miyoushe.com/",
  "x-rpc-language": "zh-cn",
};

/** 图鉴分类列表（角色 / 武器 / 背包…） */
function tujianApi() {
  return axios
    .get(LIST_URL, {
      params: { app_sn: "ys_obc", channel_id: 189 },
      headers: defaultHeaders,
    })
    .then((res) => res.data.data.list[0].children);
}

/**
 * Hoyowiki 词条详情（新角色 / 新材料也能拿到）
 * @returns {Promise<object|null>} page 对象
 */
async function wikiEntryApi(entry_page_id) {
  const res = await axios.get(WIKI_ENTRY_URL, {
    params: { entry_page_id },
    headers: defaultHeaders,
  });
  if (res.data?.retcode !== 0 || !res.data?.data?.page) {
    return null;
  }
  return res.data.data.page;
}

function stripHtml(html) {
  return (html || "")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** 解析组件 data 字段（接口里常是 JSON 字符串） */
function parseComponentData(comp) {
  if (!comp?.data) return null;
  return typeof comp.data === "string" ? JSON.parse(comp.data) : comp.data;
}

function findComponent(page, component_id) {
  for (const mod of page?.modules || []) {
    const hit = (mod.components || []).find(
      (c) => c.component_id === component_id
    );
    if (hit) return hit;
  }
  return null;
}

/**
 * 从角色词条解析天赋书，如「勤劳」
 */
function parseRoleTianfu(page) {
  const comp = findComponent(page, "role_talent");
  const data = parseComponentData(comp);
  if (!data) return null;
  const raw = JSON.stringify(data);
  const teaching = raw.match(/「[^」]+」的教导/);
  if (teaching) return teaching[0].match(/「[^」]+」/)[0];
  return null;
}

/**
 * 从材料词条解析武器突破 info（兼容前端字段）
 */
function parseWuqiCailiaoInfo(page) {
  const base = parseComponentData(findComponent(page, "material_base_info"));
  if (!base) return null;

  const tableData = parseComponentData(findComponent(page, "multi_table"));
  // 不同条目 tab 名不统一：多数「武器突破」，部分旧条目「突破武器」
  const weaponTable = (tableData?.tables || []).find((t) =>
    /武器突破|突破武器/.test(t.tab_name || "")
  );

  const proceedHtml = base.materials?.value || "";
  const proceedText = stripHtml(proceedHtml);
  const dayMatch = proceedText.match(/（([^）]+)）/);

  const purposeAttr = (base.attr || []).find((a) => a.key === "用途");
  const purposeHtml = Array.isArray(purposeAttr?.value)
    ? purposeAttr.value.join("")
    : purposeAttr?.value || "";

  const wuqi = (weaponTable?.row || [])
    .map((row) => {
      const html = row[0] || "";
      return {
        name: html.match(/data-entry-name="([^"]+)"/)?.[1] || "",
        src: html.match(/data-entry-img="([^"]+)"/)?.[1] || "",
        count: stripHtml(row[1] || ""),
      };
    })
    .filter((w) => w.name);

  return {
    imgSrc: base.img,
    name: `名称：${base.name}`,
    getWay: [dayMatch?.[1] || "", proceedText, proceedHtml],
    describe: purposeHtml ? `用途：${stripHtml(purposeHtml)}` : "",
    wuqi,
  };
}

module.exports = {
  tujianApi,
  wikiEntryApi,
  stripHtml,
  parseRoleTianfu,
  parseWuqiCailiaoInfo,
};
