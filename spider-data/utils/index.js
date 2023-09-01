const fs = require("fs");

function saveJSON(path, data, rewrite = false) {
  if (rewrite) {
    fs.writeFileSync(path, JSON.stringify(data));
    return;
  }
  if (!fs.existsSync(path)) {
    fs.writeFileSync(path, JSON.stringify(data));
  }
}

module.exports = {
  saveJSON,
};
