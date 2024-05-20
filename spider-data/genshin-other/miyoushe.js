const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

// 爬米游社
// https://bbs.mihoyo.com/ys/obc/channel/map/189/25?bbs_presentation_style=no_header
// 这个页面的导航数据及子数据 https://api-static.mihoyo.com/common/blackboard/ys_obc/v1/home/map?app_sn=ys_obc

function jueseData() {
  // 图鉴接口 https://api-static.mihoyo.com/common/blackboard/ys_obc/v1/home/content/list?app_sn=ys_obc&channel_id=189
  requestJson(
    "https://api-static.mihoyo.com/common/blackboard/ys_obc/v1/home/content/list?app_sn=ys_obc&channel_id=189"
  ).then((res) => {
    const list = res.data.list[0].children.find((f) => f.name == "角色").list;
    const data = list.map(async (item) => {
      const tf = await getTianfu(item.content_id);
    });
  });
}

function getTianfu(id) {
  if (!id) return;
  return requestJson(
    `https://api-static.mihoyo.com/common/blackboard/ys_obc/v1/content/info?app_sn=ys_obc&content_id=${id}`
  ).then((res) => {
    const find = res.data.content.contents.find(
      (f) => f.name.indexOf("天赋") > -1
    );
    if (find) {
      const mat = find.text.match(/「(.*?)」的教导/);
      return mat ? mat[1] : "";
    }
    // res.data.content.contents.map((item) => {
    //   const filePath = path.resolve(__dirname, "./" + item.name + ".html");
    //   !fs.existsSync(filePath) &&
    //     fs.writeFileSync(filePath, outputHtml(item.text));
    // });
  });
}

function outputHtml(innerText) {
  return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
    </head>
    <body>
      ${innerText}
    </body>
    </html>
`;
}

function requestJson(url) {
  return fetch(url).then((res) => res.json());
}

function getWuqiData() {
  requestJson(
    "https://api-static.mihoyo.com/common/blackboard/ys_obc/v1/home/content/list?app_sn=ys_obc&channel_id=189"
  ).then((res) => {
    const list = res.data.list[0].children.find((f) => f.name == "武器").list;
    // console.log("list: ", list);
    const allTask = list.map(async ({ content_id }) => {
      const api = `https://api-static.mihoyo.com/common/blackboard/ys_obc/v1/content/info?app_sn=ys_obc&content_id=${content_id}`;
      const res = await requestJson(api);
      const text = res.data.content.contents[0].text;
      const title = res.data.content.title;
      const mat = text.match(/obc-tmpl__icon-text"\>(.*?)\<\/span\>/);
      return mat ? { tupo: mat[1], ...res.data.content } : res.data.content;
    });

    Promise.all(allTask).then((res) => {
      console.log(res);
    });
  });
}
getWuqiData();
