const axios = require("axios");

// 图鉴数据接口
function getTujianData() {
  let url =
    "https://api-static.mihoyo.com/common/blackboard/ys_obc/v1/home/content/list?app_sn=ys_obc&channel_id=189";
  return axios.get(url).then((res) => {
    return res.data.data.list[0].children;
  });
}

module.exports = {
  getTujianData,
};