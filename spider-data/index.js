const getBeibao = require("./getBeibao");
const getTianfu = require("./getTianfu");
const getWuqi = require("./getWuqi");
const { saveJSON } = require("./utils");
async function main() {
  // 获取背包数据
  const { wuqiData, roleData, beibaoData } = await getBeibao();
  saveJSON("./data/wuqi.json", wuqiData, true);
  saveJSON("./data/role-data.json", roleData, true);
  saveJSON("./data/beibao.json", beibaoData, true);
  // 获取天赋数据
  const { roleWithTianfu } = await getTianfu();
  saveJSON("./data/role-with-tianfu.json", roleWithTianfu, true);
  // 获取武器数据
  const { cailiaoData } = await getWuqi();
  saveJSON("./data/wuqi-tupo-cailiao.json", cailiaoData, true);
}
main();
