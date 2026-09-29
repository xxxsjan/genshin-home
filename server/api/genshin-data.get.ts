import { readGenshinData } from "../utils/genshin-data";

/**
 * 原神素材聚合数据（本地 seed，无远端同步）
 * GET /api/genshin-data
 */
export default defineEventHandler(() => {
  return readGenshinData();
});
