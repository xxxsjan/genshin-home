const { constants } = require("buffer");
const fs = require("fs");
/**
 *
 * @param {*} path 文件路径
 * @param {*} data 文本内容
 * @param {*} focusWrite 是否强制覆盖
 * @returns undefined
 */
function saveJSON(path, data, focusWrite = false) {
  if (focusWrite) {
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
    return;
  }
  fs.access(path, fs.constants.F_OK, (err) => {
    if (err) {
      fs.writeFileSync(path, JSON.stringify(data, null, 2));
    }
  });
}

module.exports = {
  saveJSON,
};
