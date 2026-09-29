import { readGenshinData } from "../utils/genshin-data";

/**
 * 兼容旧前端：只读缓存对比（不再在请求内打米哈游，避免 Vercel 超时）
 */
export default defineEventHandler(async () => {
  const cached = await readGenshinData();
  return {
    newData: {
      role: cached.meta.roleCount,
      wuqi: cached.meta.wuqiCount,
    },
    cacheData: {
      role: cached.roleWithTianfu.length,
      wuqi: cached.tujian_wuqi.length,
    },
    checkRes: true,
    synced: cached.synced,
    updatedAt: cached.updatedAt,
  };
});
