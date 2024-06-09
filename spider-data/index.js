const getBeibao = require("./getBeibao");
const { getTianfu } = require("./getTianfu");
const wuqiGetCailiao = require("./getWuqi");
const { saveJSON } = require("./utils");

async function main() {
  // 获取背包数据
  // const { tujian_wuqi, tujian_role, tujian_beibao } = await getBeibao();

  // saveJSON("./data/tujian_wuqi.json", tujian_wuqi, true);
  // saveJSON("./data/tujian_role.json", tujian_role, true);
  // saveJSON("./data/tujian_beibao.json", tujian_beibao, true);

  console.log("1 背包数据已缓存");

  console.log("2 开始 获取 天赋 数据");

  // const { roleWithTianfu } = await getTianfu();

  // saveJSON("./data/role-with-tianfu.json", roleWithTianfu, true);

  console.log("3 天赋 数据已保存");

  console.log("4 开始 获取 武器 数据");

  const { cailiaoData } = await wuqiGetCailiao();

  saveJSON("./data/wuqi-tupo-cailiao.json", cailiaoData, true);
  console.log("5 武器 数据已保存");
}

main();
