// const express = require('express');
// const app = express();
const fs = require('fs');
const got = require('got');
const cheerio = require('cheerio');
const { downloadImg } = require('./utils');
function parseHtml(content) {
  const _charList = content.match(/charList:\[(.*?)\],mod3Index/g)[0];
  const charList = _charList.match(/\{title:(.*?),location:(.*?)\}/g).map((it) => {
    return {
      title: [...it.matchAll(/title:"(.*?)",/g)][0][1],
      icon: [...it.matchAll(/icon:"(.*?)",/g)][0][1].replaceAll('\\u002F', '/'),
      cover1: [...it.matchAll(/cover1:"(.*?)",/g)][0][1].replaceAll('\\u002F', '/'),
      cover2: [...it.matchAll(/cover2:"(.*?)",/g)][0][1].replaceAll('\\u002F', '/'),
      name: [...it.matchAll(/name:"(.*?)",/g)][0][1].replaceAll('\\u002F', '/'),
      attr: [...it.matchAll(/attr:"(.*?)",/g)][0][1].replaceAll('\\u002F', '/'),
      intro: [...it.matchAll(/intro:"(.*?)",/g)][0][1].replaceAll('\\u002F', '/'),
      sen: [...it.matchAll(/sen:"(.*?)",/g)][0][1].replaceAll('\\u002F', '/'),
    };
  });
  const _cityList = content.match(/cityList:\[(.*?)g,+(.*?)\],/g)[0];
  const cityList = _cityList.match(/\{contentId:(.*?)town:(.*?)\}/g).map((it) => {
    let d = '';
    return {
      contentId: [...it.matchAll(/contentId:"(.*?)",/g)][0][1],
      title: [...it.matchAll(/title:"(.*?)",/g)][0][1].replaceAll('\\u002F', '/'),
      key: [...it.matchAll(/key:"(.*?)",/g)][0][1],
      home: eval('(' + [...it.matchAll(/home:(.*?),char:\{/g)][0][1] + ')'),
      // char: eval('(' + [...it.matchAll(/\},char:(.*?),char2:/g)][0][1].replaceAll('\\u002F', '/') + ')'),
    };
  });
  //   console.log(charList);
  return {
    charList,
    // cityList,
  };
}
/**
 *
 * @param {'mondstadt', 'liyue', 'inazuma', 'sumeru'} city
 * @returns
 */
async function viewSite(city = 'mondstadt') {
  const response = await got(`https://ys.mihoyo.com/main/character/${city}?char=0`);
  let $ = cheerio.load(response.body); //获取网址的DOM结构
  // let result = $('script').html(); //想抓取的部位
  fs.writeFileSync(`./genshin_data/${city}.html`, $.html());
  return parseHtml($.html());
}

function downImg() {
  const data = require('./genshin_data/images_url.json');
  const allUrl = Object.entries(data).reduce((pre, cur) => {
    return [...pre, ...cur[1].charList];
  }, []);
  allUrl.map((it) => {
    const file_path = `./genshin_data/img/${it.title}.png`;
    downloadImg(file_path, it.icon);
  });
}

async function getImageUrl() {
  const cacheFilePath = './genshin_data/cache/images_url.json';
  if (fs.existsSync(cacheFilePath)) {
    const data = require(cacheFilePath);
    console.log('使用缓存', { ...data, cache: true });
  } else {
    console.log('重新请求');
    let citys = ['mondstadt', 'liyue', 'inazuma', 'sumeru'];
    const _res = await Promise.all(citys.map((city) => viewSite(city)));
    //   console.log(_res);
    let res = {};
    for (let i in _res) {
      res[citys[i]] = _res[i];
    }
    fs.writeFileSync(cacheFilePath, JSON.stringify(res));
  }
}
getImageUrl();
