const fs = require("fs");

export function saveJSON(path, data) {
  if (!fs.existsSync(path)) {
    fs.writeFileSync(path, JSON.stringify(data));
  }
}
