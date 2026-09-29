const getBeibao = require("./getBeibao");
const { getTianfu } = require("./getTianfu");
const wuqiGetCailiao = require("./getWuqi");
const { saveJSON } = require("./utils");

/**
 * 一键更新本地图鉴缓存
 *
 * 用法（在 spider-data 目录，或根目录 pnpm update:data）：
 *   node index.js           # 全量：背包 + 天赋 + 武器材料
 *   node index.js beibao    # 只更新图鉴列表
 *   node index.js tianfu    # 只更新角色天赋
 *   node index.js wuqi      # 只更新武器突破材料
 */
async function main() {
  const step = process.argv[2] || "all";
  const runBeibao = step === "all" || step === "beibao";
  const runTianfu = step === "all" || step === "tianfu";
  const runWuqi = step === "all" || step === "wuqi";

  console.log(`\n=== genshin-home 数据更新 (${step}) ===\n`);

  if (runBeibao) {
    console.log("[1/3] 拉取背包 / 角色 / 武器图鉴列表...");
    const { tujian_wuqi, tujian_role, tujian_beibao } = await getBeibao();
    saveJSON("./data/tujian_wuqi.json", tujian_wuqi, true);
    saveJSON("./data/tujian_role.json", tujian_role, true);
    saveJSON("./data/tujian_beibao.json", tujian_beibao, true);
    console.log(
      `  已保存：角色 ${tujian_role.length} / 武器 ${tujian_wuqi.length} / 背包 ${tujian_beibao.length}`
    );
  }

  if (runTianfu) {
    console.log("[2/3] 拉取角色天赋（米游社 content/info，有缓存的跳过）...");
    const { roleWithTianfu } = await getTianfu();
    saveJSON("./data/role-with-tianfu.json", roleWithTianfu, true);
    console.log(`  已保存：角色天赋 ${roleWithTianfu.length}`);
  }

  if (runWuqi) {
    console.log("[3/3] 拉取武器突破材料（米游社 content/info）...");
    const { cailiaoData } = await wuqiGetCailiao();
    saveJSON("./data/wuqi-tupo-cailiao.json", cailiaoData, true);
    console.log(`  已保存：武器材料 ${cailiaoData.length}`);
  }

  console.log("\n=== 更新完成。请把 spider-data/data 的变更提交并重新部署 ===\n");
}

main().catch((err) => {
  console.error("\n更新失败:", err);
  process.exit(1);
});
