import { readGenshinData, syncGenshinData } from "../utils/genshin-data";

/**
 * 兼容旧前端：对比远端列表数量与缓存
 * 新页面已走 /api/genshin-data 自动增量同步，一般不再需要弹窗提醒
 */
export default defineEventHandler(async () => {
  try {
    const remote = await syncGenshinData();
    return {
      newData: {
        role: remote.meta.roleCount,
        wuqi: remote.meta.wuqiCount,
      },
      cacheData: {
        role: remote.roleWithTianfu.length,
        wuqi: remote.tujian_wuqi.length,
      },
      checkRes: true,
      synced: remote.synced,
      updatedAt: remote.updatedAt,
    };
  } catch {
    const cached = await readGenshinData();
    return {
      newData: cached.meta,
      cacheData: {
        role: cached.roleWithTianfu.length,
        wuqi: cached.tujian_wuqi.length,
      },
      checkRes: true,
      synced: cached.synced,
      updatedAt: cached.updatedAt,
    };
  }
});
