const getBeibao = require("./getBeibao");
const getTianfu = require("./getTianfu");
const getWuqi = require("./getWuqi");
const { saveJSON } = require("./utils");

// 获取背包数据
const { wuqiData, roleData, beibaoData } = await getBeibao();
saveJSON("./data/wuqi.json", wuqiData);
saveJSON("./data/role-data.json", roleData);
saveJSON("./data/beibao.json", beibaoData);
// 获取天赋数据
const { roleWithTianfu } = await getTianfu();
saveJSON("./data/role-with-tianfu.json", roleWithTianfu);
// 获取武器数据
const { cailiaoData } = await getWuqi();
saveJSON("./data/wuqi-tupo-cailiao.json", cailiaoData);
