import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { getRemoteData } from "./getRemoteData.mjs";
import { getVideoSrc } from "./getVideoSrc.mjs";
import { downloadVideo } from "./downloadVideo.mjs";
import { initDb } from "./db.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

// getRemoteData()
// getVideoSrc()
downVideo();

async function downVideo() {
  const db = await initDb();

  const dirName = db.data.videoSrc[0][0]; // 角色PV
  const data = db.data.videoSrc[0][1];

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    // const url = new URL(item.src);
    // const fileName = url.pathname.split("/").pop();
    console.log(item.title, i, data.length);

    await downloadVideo(
      item.src,
      join(__dirname, dirName, `${item.title}.mp4`)
    );
  }
}
