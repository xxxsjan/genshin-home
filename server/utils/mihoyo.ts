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

export type TujianItem = {
  content_id: number;
  title: string;
  ext: string;
  icon: string;
  bbs_url?: string;
  article_user_name?: string;
  article_time?: string;
  avatar_url?: string;
  summary?: string;
  alias_name?: string;
  corner_mark?: string;
};

export type RoleTianfu = {
  content_id: number;
  title: string;
  tianfu?: string;
  /** 已请求过 wiki（即便没有天赋），避免预告角色每次都重试 */
  checkedAt?: string;
};

export type WuqiCailiao = TujianItem & {
  info: {
    imgSrc: string;
    name: string;
    getWay: string[];
    describe: string;
    wuqi: { name: string; src: string; count: string }[];
  };
  checkedAt?: string;
};

type WikiPage = {
  name?: string;
  modules?: {
    name?: string;
    components?: { component_id?: string; data?: string | object }[];
  }[];
};

export async function fetchTujianList() {
  const res: any = await $fetch(LIST_URL, {
    params: { app_sn: "ys_obc", channel_id: 189 },
    headers: defaultHeaders,
  });
  return res.data.list[0].children as {
    name: string;
    list: TujianItem[];
  }[];
}

export async function fetchWikiEntry(
  entry_page_id: number
): Promise<WikiPage | null> {
  try {
    const res: any = await $fetch(WIKI_ENTRY_URL, {
      params: { entry_page_id },
      headers: defaultHeaders,
    });
    if (res?.retcode !== 0 || !res?.data?.page) return null;
    return res.data.page as WikiPage;
  } catch {
    return null;
  }
}

function stripHtml(html: string) {
  return (html || "")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseComponentData(comp?: { data?: string | object }) {
  if (!comp?.data) return null;
  return typeof comp.data === "string" ? JSON.parse(comp.data) : comp.data;
}

function findComponent(page: WikiPage | null, component_id: string) {
  for (const mod of page?.modules || []) {
    const hit = (mod.components || []).find(
      (c) => c.component_id === component_id
    );
    if (hit) return hit;
  }
  return null;
}

/** 从角色词条解析天赋书，如「勤劳」 */
export function parseRoleTianfu(page: WikiPage | null): string | null {
  const data = parseComponentData(findComponent(page, "role_talent"));
  if (!data) return null;
  const teaching = JSON.stringify(data).match(/「[^」]+」的教导/);
  if (teaching) return teaching[0].match(/「[^」]+」/)?.[0] || null;
  return null;
}

/** 从材料词条解析武器突破 info */
export function parseWuqiCailiaoInfo(
  page: WikiPage | null
): WuqiCailiao["info"] | null {
  const base: any = parseComponentData(
    findComponent(page, "material_base_info")
  );
  if (!base) return null;

  const tableData: any = parseComponentData(
    findComponent(page, "multi_table")
  );
  const weaponTable = (tableData?.tables || []).find((t: any) =>
    /武器突破|突破武器/.test(t.tab_name || "")
  );

  const proceedHtml = base.materials?.value || "";
  const proceedText = stripHtml(proceedHtml);
  const dayMatch = proceedText.match(/（([^）]+)）/);

  const purposeAttr = (base.attr || []).find((a: any) => a.key === "用途");
  const purposeHtml = Array.isArray(purposeAttr?.value)
    ? purposeAttr.value.join("")
    : purposeAttr?.value || "";

  const wuqi = (weaponTable?.row || [])
    .map((row: string[]) => {
      const html = row[0] || "";
      return {
        name: html.match(/data-entry-name="([^"]+)"/)?.[1] || "",
        src: html.match(/data-entry-img="([^"]+)"/)?.[1] || "",
        count: stripHtml(row[1] || ""),
      };
    })
    .filter((w: { name: string }) => w.name);

  return {
    imgSrc: base.img,
    name: `名称：${base.name}`,
    getWay: [dayMatch?.[1] || "", proceedText, proceedHtml],
    describe: purposeHtml ? `用途：${stripHtml(purposeHtml)}` : "",
    wuqi,
  };
}

/** 并发池 */
export async function mapPool<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const i = cursor++;
      results[i] = await fn(items[i], i);
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => worker())
  );
  return results;
}
