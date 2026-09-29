import { readGenshinData } from "../utils/genshin-data";

/** 兼容旧前端：只读本地 seed */
export default defineEventHandler(() => {
  const cached = readGenshinData();
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
