import fs from "fs";
import path from "path";
import axios from "axios";
import chalk from "chalk";

import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = dirname(fileURLToPath(import.meta.url));
/**
 *
 * @param {string} url
 * @param {string} filePath
 * @returns
 */
export async function downloadVideo(url, filePath) {
  const dirPath = path.dirname(filePath);
  fs.mkdirSync(dirPath, { recursive: true });

  try {
    const response = await axios({
      url,
      method: "GET",
      responseType: "stream",
    });

    const { data, headers } = response;
    const totalLength = headers["content-length"];
    const writer = fs.createWriteStream(filePath);

    let downloadedLength = 0;
    const progressBarWidth = 50;

    data.on("data", (chunk) => {
      downloadedLength += chunk.length;
      const percentage = Math.floor((downloadedLength / totalLength) * 100);
      const filledBarLength = Math.floor((percentage / 100) * progressBarWidth);
      const emptyBarLength = progressBarWidth - filledBarLength;
      const progressBar =
        chalk.green("█".repeat(filledBarLength)) +
        chalk.gray("░".repeat(emptyBarLength));

      process.stdout.clearLine();
      process.stdout.cursorTo(0);
      process.stdout.write(
        `下载中: [${progressBar}] ${percentage}% (${formatBytes(
          downloadedLength
        )} / ${formatBytes(totalLength)})`
      );
    });

    return new Promise((resolve, reject) => {
      writer.on("finish", () => {
        process.stdout.write("\n");
        console.log(`视频下载完成: ${filePath}`);
        resolve();
      });

      writer.on("error", (err) => {
        console.error("\n下载出错:", err);
        reject(err);
      });

      data.pipe(writer);
    });
  } catch (error) {
    console.error("\n下载出错:", error);
    throw error;
  }
}

/**
 * 格式化文件大小
 * @param {number} bytes 文件大小（字节）
 * @returns {string} 格式化后的文件大小
 */
function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + " " + sizes[i];
}

// 使用示例
// const videoUrl =
//   "https://act-upload.mihoyo.com/sr-wiki/2024/05/24/279865110/64d07450c4b8f4035f3b1f4ed5e8e3df_58689633095289043.mp4"; // 替换为实际视频链接
// const outputPath = "./videoxxx.mp4"; // 替换为保存路径

// downloadVideo(videoUrl, outputPath)
//   .then(() => {
//     console.log("下载完成");
//   })
//   .catch((err) => {
//     console.error("下载出错:", err);
//   });
function createDirIfNotExists(name) {
  const dirPath = path.resolve(__dirname, name);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`文件夹创建成功: ${dirPath}`);
  } else {
    console.log(`文件夹已存在: ${dirPath}`);
  }
}
