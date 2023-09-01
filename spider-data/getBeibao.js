const fs = require("fs");
const { getTujianData } = require("./api");

async function getBeibao() {
  const tujianData = await getTujianData();

  const beibaoData = tujianData.find((f) => f.name === "背包").list;

  const roleData = tujianData.find((f) => f.name === "角色").list;

  const wuqiData = tujianData
    .find((f) => f.name === "武器")
    .list.filter((f) => f.ext.match(/五星|四星/));

  console.log(
    `最新数据：背包：${beibaoData.length}角色：${roleData.length}武器：${wuqiData.length}`
  );

  console.log(
    `本地数据：背包：${require("./data/beibao.json").length}角色：${
      require("./data/role-data.json").length
    }武器：${require("./data/wuqi.json").length}`
  );

  return {
    wuqiData,
    roleData,
    beibaoData,
  };
 
}

module.exports = getBeibao;
