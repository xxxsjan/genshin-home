import seedRole from "~/spider-data/data/tujian_role.json";
import seedWuqi from "~/spider-data/data/tujian_wuqi.json";
import seedBeibao from "~/spider-data/data/tujian_beibao.json";
import seedRoleTianfu from "~/spider-data/data/role-with-tianfu.json";
import seedWuqiCailiao from "~/spider-data/data/wuqi-tupo-cailiao.json";
import { getKv } from "./kv";
import {
  fetchTujianList,
  fetchWikiEntry,
  mapPool,
  parseRoleTianfu,
  parseWuqiCailiaoInfo,
  type RoleTianfu,
  type TujianItem,
  type WuqiCailiao,
} from "./mihoyo";

export const GENSHIN_DATA_KEY = "genshin:home:data";

/** 控制在 Vercel Hobby(~10s) 内可完成：少拉几条，由前端分轮续跑 */
const MAX_FETCH_PER_REQUEST = 8;
const WIKI_CONCURRENCY = 4;
/** 没拿到天赋的词条，多久后再试一次（预告→正式） */
const RETRY_AFTER_MS = 7 * 24 * 3600 * 1000;

function shouldRetry(checkedAt?: string) {
  if (!checkedAt) return true;
  return Date.now() - new Date(checkedAt).getTime() > RETRY_AFTER_MS;
}

export type GenshinHomeData = {
  updatedAt: string;
  meta: {
    roleCount: number;
    wuqiCount: number;
    beibaoCount: number;
    cailiaoCount: number;
  };
  tujian_role: TujianItem[];
  tujian_wuqi: TujianItem[];
  tujian_beibao: TujianItem[];
  roleWithTianfu: RoleTianfu[];
  wuqiTupoCailiao: WuqiCailiao[];
};

export type GenshinDataResponse = GenshinHomeData & {
  source: "kv" | "memory" | "seed";
  synced: {
    roleTianfu: number;
    wuqiCailiao: number;
    pendingRole: number;
    pendingCailiao: number;
  };
};

/** 进程内缓存：无 KV / 同实例热请求 */
let memoryCache: GenshinHomeData | null = null;
let syncing: Promise<GenshinDataResponse> | null = null;

function buildSeed(): GenshinHomeData {
  return {
    updatedAt: new Date(0).toISOString(),
    meta: {
      roleCount: seedRole.length,
      wuqiCount: seedWuqi.length,
      beibaoCount: seedBeibao.length,
      cailiaoCount: seedWuqiCailiao.length,
    },
    tujian_role: seedRole as TujianItem[],
    tujian_wuqi: seedWuqi as TujianItem[],
    tujian_beibao: seedBeibao as TujianItem[],
    roleWithTianfu: seedRoleTianfu as RoleTianfu[],
    wuqiTupoCailiao: seedWuqiCailiao as WuqiCailiao[],
  };
}

async function loadCache(): Promise<{
  data: GenshinHomeData;
  source: GenshinDataResponse["source"];
}> {
  if (memoryCache) return { data: memoryCache, source: "memory" };

  const kv = getKv();
  if (kv) {
    try {
      const cached = await kv.get<GenshinHomeData>(GENSHIN_DATA_KEY);
      if (cached?.tujian_role?.length) {
        memoryCache = cached;
        return { data: cached, source: "kv" };
      }
    } catch (err) {
      console.warn("[genshin-data] KV read failed:", err);
    }
  }

  const seed = buildSeed();
  memoryCache = seed;
  return { data: seed, source: "seed" };
}

async function saveCache(data: GenshinHomeData) {
  memoryCache = data;
  const kv = getKv();
  if (!kv) return;
  try {
    await kv.set(GENSHIN_DATA_KEY, data);
  } catch (err) {
    console.warn("[genshin-data] KV write failed:", err);
  }
}

function pickLists(children: { name: string; list: TujianItem[] }[]) {
  const tujian_beibao = children.find((f) => f.name === "背包")?.list || [];
  const tujian_role = children.find((f) => f.name === "角色")?.list || [];
  const tujian_wuqi = (
    children.find((f) => f.name === "武器")?.list || []
  ).filter((f) => f.ext.match(/五星|四星/));
  const cailiaoList = tujian_beibao.filter((f) =>
    f.ext.match(/武器突破素材/)
  );
  return { tujian_beibao, tujian_role, tujian_wuqi, cailiaoList };
}

async function fillMissingRoleTianfu(
  roles: TujianItem[],
  cached: RoleTianfu[]
) {
  const byId = new Map(cached.map((r) => [r.content_id, { ...r }]));
  const need = roles.filter((r) => {
    const hit = byId.get(r.content_id);
    if (hit?.tianfu) return false;
    return shouldRetry(hit?.checkedAt);
  });
  const batch = need.slice(0, MAX_FETCH_PER_REQUEST);
  const now = new Date().toISOString();

  await mapPool(batch, WIKI_CONCURRENCY, async (role) => {
    const page = await fetchWikiEntry(role.content_id);
    const tianfu = parseRoleTianfu(page) || undefined;
    byId.set(role.content_id, {
      content_id: role.content_id,
      title: role.title,
      checkedAt: now,
      ...(tianfu ? { tianfu } : {}),
    });
  });

  for (const role of roles) {
    const hit = byId.get(role.content_id);
    if (!hit) {
      byId.set(role.content_id, {
        content_id: role.content_id,
        title: role.title,
      });
    } else {
      hit.title = role.title;
    }
  }

  const roleWithTianfu = roles.map(
    (r) =>
      byId.get(r.content_id) || {
        content_id: r.content_id,
        title: r.title,
      }
  );
  const pendingRole = roles.filter((r) => !byId.get(r.content_id)?.tianfu)
    .length;

  return {
    roleWithTianfu,
    synced: batch.length,
    pendingRole,
  };
}

async function fillMissingWuqiCailiao(
  cailiaoList: TujianItem[],
  cached: WuqiCailiao[]
) {
  const byId = new Map(cached.map((c) => [c.content_id, { ...c }]));
  const need = cailiaoList.filter((c) => {
    const hit = byId.get(c.content_id);
    if (hit?.info?.wuqi?.length) return false;
    return shouldRetry(hit?.checkedAt);
  });
  const batch = need.slice(0, MAX_FETCH_PER_REQUEST);
  const now = new Date().toISOString();

  await mapPool(batch, WIKI_CONCURRENCY, async (item) => {
    const page = await fetchWikiEntry(item.content_id);
    const info = parseWuqiCailiaoInfo(page);
    const prev = byId.get(item.content_id);
    byId.set(item.content_id, {
      ...item,
      checkedAt: now,
      info: info || prev?.info,
    } as WuqiCailiao);
  });

  const wuqiTupoCailiao = cailiaoList
    .map((item) => {
      const hit = byId.get(item.content_id);
      if (!hit?.info?.wuqi?.length) return null;
      return {
        ...item,
        info: hit.info,
        checkedAt: hit.checkedAt,
      } as WuqiCailiao;
    })
    .filter(Boolean) as WuqiCailiao[];

  const pendingCailiao = cailiaoList.filter(
    (c) => !byId.get(c.content_id)?.info?.wuqi?.length
  ).length;

  return {
    wuqiTupoCailiao,
    synced: batch.length,
    pendingCailiao,
  };
}

/**
 * 拉取列表 + 增量补全详情，写入 KV / 内存
 */
export async function syncGenshinData(): Promise<GenshinDataResponse> {
  if (syncing) return syncing;

  syncing = (async () => {
    const { data: cached } = await loadCache();
    const children = await fetchTujianList();
    const { tujian_beibao, tujian_role, tujian_wuqi, cailiaoList } =
      pickLists(children);

    const roleResult = await fillMissingRoleTianfu(
      tujian_role,
      cached.roleWithTianfu
    );
    const cailiaoResult = await fillMissingWuqiCailiao(
      cailiaoList,
      cached.wuqiTupoCailiao
    );

    const next: GenshinHomeData = {
      updatedAt: new Date().toISOString(),
      meta: {
        roleCount: tujian_role.length,
        wuqiCount: tujian_wuqi.length,
        beibaoCount: tujian_beibao.length,
        cailiaoCount: cailiaoList.length,
      },
      tujian_role,
      tujian_wuqi,
      tujian_beibao,
      roleWithTianfu: roleResult.roleWithTianfu,
      wuqiTupoCailiao: cailiaoResult.wuqiTupoCailiao,
    };

    await saveCache(next);

    return {
      ...next,
      source: getKv() ? "kv" : "memory",
      synced: {
        roleTianfu: roleResult.synced,
        wuqiCailiao: cailiaoResult.synced,
        pendingRole: roleResult.pendingRole,
        pendingCailiao: cailiaoResult.pendingCailiao,
      },
    };
  })().finally(() => {
    syncing = null;
  });

  return syncing;
}

/** 只读缓存（不打远端列表）；没有则 seed */
export async function readGenshinData(): Promise<GenshinDataResponse> {
  const { data, source } = await loadCache();
  return {
    ...data,
    source,
    synced: {
      roleTianfu: 0,
      wuqiCailiao: 0,
      pendingRole: data.roleWithTianfu.filter((r) => !r.tianfu).length,
      pendingCailiao: Math.max(
        0,
        data.meta.cailiaoCount - data.wuqiTupoCailiao.length
      ),
    },
  };
}
