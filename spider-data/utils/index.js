const { constants } = require("buffer");
const fs = require("fs");

function saveJSON(path, data, focusWrite = false) {
  if (focusWrite) {
    fs.writeFileSync(path, JSON.stringify(data));
    return;
  }
  fs.access(path, fs.constants.F_OK, (err) => {
    if (err) {
      fs.writeFileSync(path, JSON.stringify(data));
    }
  });
}

module.exports = {
  saveJSON,
};
