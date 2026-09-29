import { getGenshinHomeBundle } from "~/utils/genshin-seed";

/**
 * 只读本地 seed（spider-data/data）。
 * 线上不做米哈游同步 / KV，避免 Vercel 超时与限流。
 * 更新数据：本地执行 `pnpm update:data` 后提交 JSON。
 */
export function readGenshinData(): GenshinHomeBundle {
  return getGenshinHomeBundle();
}
