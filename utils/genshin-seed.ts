import seedRole from "~/spider-data/data/tujian_role.json";
import seedWuqi from "~/spider-data/data/tujian_wuqi.json";
import seedBeibao from "~/spider-data/data/tujian_beibao.json";
import seedRoleTianfu from "~/spider-data/data/role-with-tianfu.json";
import seedWuqiCailiao from "~/spider-data/data/wuqi-tupo-cailiao.json";

/**
 * 构建部署用的静态图鉴包。
 * 数据由本地 `pnpm update:data` 爬取并提交到 spider-data/data，线上不再请求米哈游。
 */
export function getGenshinHomeBundle(): GenshinHomeBundle {
  const tujian_role = seedRole as TujianItem[];
  const tujian_wuqi = seedWuqi as TujianItem[];
  const tujian_beibao = seedBeibao as TujianItem[];
  const roleWithTianfu = seedRoleTianfu as RoleTianfu[];
  const wuqiTupoCailiao = seedWuqiCailiao as WuqiTupoCailiaoItem[];

  return {
    updatedAt: new Date(0).toISOString(),
    meta: {
      roleCount: tujian_role.length,
      wuqiCount: tujian_wuqi.length,
      beibaoCount: tujian_beibao.length,
      cailiaoCount: wuqiTupoCailiao.length,
    },
    tujian_role,
    tujian_wuqi,
    tujian_beibao,
    roleWithTianfu,
    wuqiTupoCailiao,
    source: "seed",
    synced: {
      roleTianfu: 0,
      wuqiCailiao: 0,
      pendingRole: roleWithTianfu.filter((r) => !r.tianfu).length,
      pendingCailiao: 0,
    },
  };
}
