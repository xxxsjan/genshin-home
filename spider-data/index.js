const getBeibao = require("./getBeibao");
const getTianfu = require("./getTianfu");
const getWuqi = require("./getWuqi");
const { saveJSON } = require("./utils");

async function main() {
  // 获取背包数据
  const { tujian_wuqi, tujian_role, tujian_beibao } = await getBeibao();

  saveJSON("./data/tujian_wuqi.json", tujian_wuqi, true);
  saveJSON("./data/tujian_role.json", tujian_role, true);
  saveJSON("./data/tujian_beibao.json", tujian_beibao, true);

  // // 获取天赋数据
  const { roleWithTianfu } = await getTianfu();

  saveJSON("./data/role-with-tianfu.json", roleWithTianfu, true);

  // // 获取武器数据
  // const { cailiaoData } = await getWuqi();
  // saveJSON("./data/wuqi-tupo-cailiao.json", cailiaoData, true);
}

main();
