import { syncGenshinData, readGenshinData } from "../utils/genshin-data";

/**
 * 原神素材聚合数据
 * GET /api/genshin-data
 * GET /api/genshin-data?sync=0  只读缓存，不打米哈游
 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const skipSync = query.sync === "0" || query.sync === "false";

  if (skipSync) {
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
