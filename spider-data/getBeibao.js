const fs = require("fs");
const { tujianApi } = require("./api");

async function getBeibao() {
  const tujianData = await tujianApi();

  const tujian_beibao = tujianData.find((f) => f.name === "背包").list;

  const tujian_role = tujianData.find((f) => f.name === "角色").list;

  const tujian_wuqi = tujianData
    .find((f) => f.name === "武器")
    .list.filter((f) => f.ext.match(/五星|四星/));

  console.log(
    `最新数据：背包：${tujian_beibao.length}角色：${tujian_role.length}武器：${tujian_wuqi.length}`
  );

  const localFilePath = "./data/tujian_beibao.json";
  fs.access(localFilePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.log(localFilePath, " 数据不存在");
      return;
    }
    console.log(
      `本地数据：背包：${require(localFilePath).length}角色：${
        require(localFilePath).length
      }武器：${require(localFilePath).length}`
    );
  });

  return {
    tujian_wuqi,
    tujian_role,
    tujian_beibao,
  };
}

module.exports = getBeibao;
