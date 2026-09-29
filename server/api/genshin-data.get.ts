import { syncGenshinData, readGenshinData } from "../utils/genshin-data";

/**
 * 原神素材聚合数据
 * GET /api/genshin-data          只读缓存（默认，避免 Vercel SSR 超时）
 * GET /api/genshin-data?sync=1   增量同步米哈游后返回
 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const doSync = query.sync === "1" || query.sync === "true";

  if (!doSync) {
    return await readGenshinData();
  }

  try {
    return await syncGenshinData();
  } catch (err: any) {
    console.error("[genshin-data] sync failed, fallback cache:", err);
    const fallback = await readGenshinData();
    return {
      ...fallback,
      error: err?.message || "sync failed",
    };
  }
});
