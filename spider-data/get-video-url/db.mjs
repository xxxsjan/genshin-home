import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbFilePath = join(__dirname, "video-data.json");
const adapter = new JSONFile(dbFilePath);
const defaultData = { list: [], count: [] };

let db;
export async function initDb() {
  if (db) {
    await db.read();
    return db;
  }
  db = new Low(adapter, defaultData);
  await db.read();
  return db;
}
