import roleJSON from "~/spider-data/data/role-with-tianfu.json";
import wuqiJSON from "~/spider-data/data/wuqi.json";

// http://localhost:3000/api/check
export default defineEventHandler(async (event) => {
  const url =
    "https://api-static.mihoyo.com/common/blackboard/ys_obc/v1/home/content/list?app_sn=ys_obc&channel_id=189";

  const res: any = await $fetch(url);
  const tujianData = res.data.list[0].children;
  console.log(res);
  const beibaoData = tujianData.find((f) => f.name === "背包").list;

  const roleData = tujianData.find((f) => f.name === "角色").list;

  const wuqiData = tujianData
    .find((f) => f.name === "武器")
    .list.filter((f) => f.ext.match(/五星|四星/));

  console.log(
    `最新数据：背包：${beibaoData.length}角色：${roleData.length}武器：${wuqiData.length}`
  );
  const cacheData = {
    role: roleJSON.length,
    wuqi: wuqiJSON.length,
  };

  console.log(`本地数据： 角色：${cacheData.role}武器：${cacheData.wuqi}`);
  const newData = { wuqi: wuqiData.length, role: roleData.length };
  const checkRes =
    newData.wuqi === cacheData.wuqi && newData.role === cacheData.role;

  return {
    newData,
    cacheData,
    checkRes,
  };
});
