export type ExportWuqiEvRow = {
  rank: number;
  name: string;
  expect: number;
  refine?: string;
  note?: string;
  icon?: string;
  isSignature?: boolean;
};

export type ExportWuqiEvOptions = {
  character: string;
  avatarUrl?: string;
  signature: string;
  scenario?: string;
  rows: ExportWuqiEvRow[];
};

/** 导出清晰度倍率：逻辑尺寸不变，像素翻倍 */
const EXPORT_SCALE = 3;

function proxyUrl(url: string) {
  if (!url) return "";
  if (url.startsWith("/api/img-proxy")) return url;
  return `/api/img-proxy?url=${encodeURIComponent(url)}`;
}

function loadImage(url: string): Promise<HTMLImageElement | null> {
  if (!url) return Promise.resolve(null);
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = proxyUrl(url);
  });
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function drawCircleImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  cx: number,
  cy: number,
  size: number
) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, size / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, cx - size / 2, cy - size / 2, size, size);
  ctx.restore();
}

/**
 * 用 Canvas 绘制期望榜 PNG（非 DOM 截图）。
 * 逻辑宽 720，实际像素按 EXPORT_SCALE 放大，避免预览/保存发糊。
 */
export async function exportWuqiEvPng(options: ExportWuqiEvOptions) {
  const width = 720;
  const pad = 28;
  const headerH = 118;
  const rowH = 58;
  const footerH = 36;
  const height = headerH + options.rows.length * rowH + footerH + pad;
  const scale = EXPORT_SCALE;

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas unsupported");

  ctx.scale(scale, scale);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // 背景
  ctx.fillStyle = "#f0ede8";
  ctx.fillRect(0, 0, width, height);

  // 顶栏
  ctx.fillStyle = "#886444";
  ctx.fillRect(0, 0, width, headerH);

  const avatar = await loadImage(options.avatarUrl || "");
  const avatarSize = 72;
  const avatarCx = pad + avatarSize / 2;
  const avatarCy = headerH / 2;
  if (avatar) {
    drawCircleImage(ctx, avatar, avatarCx, avatarCy, avatarSize);
    ctx.beginPath();
    ctx.arc(avatarCx, avatarCy, avatarSize / 2 + 2, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(240,237,232,0.55)";
    ctx.lineWidth = 3;
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.arc(avatarCx, avatarCy, avatarSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = "#d9c4a4";
    ctx.fill();
  }

  ctx.fillStyle = "#f0ede8";
  ctx.font = "700 28px Microsoft YaHei, PingFang SC, sans-serif";
  ctx.textBaseline = "middle";
  ctx.fillText(options.character, pad + avatarSize + 18, headerH / 2 - 14);

  ctx.font = "500 14px Microsoft YaHei, PingFang SC, sans-serif";
  ctx.fillStyle = "rgba(240,237,232,0.85)";
  const sub = `武器期望榜 · 基准 ${options.signature} 精1 = 100%`;
  ctx.fillText(sub, pad + avatarSize + 18, headerH / 2 + 16);

  // 榜单
  const maxExpect = Math.max(...options.rows.map((r) => r.expect), 100);
  const icons = await Promise.all(
    options.rows.map((r) => loadImage(r.icon || ""))
  );

  options.rows.forEach((row, i) => {
    const y = headerH + i * rowH;
    const x = pad;
    const w = width - pad * 2;

    ctx.fillStyle = row.isSignature
      ? "rgba(136,100,68,0.16)"
      : i % 2 === 0
        ? "rgba(136,100,68,0.06)"
        : "rgba(136,100,68,0.03)";
    roundRect(ctx, x, y + 6, w, rowH - 10, 8);
    ctx.fill();

    // 名次
    ctx.fillStyle = "#886444";
    ctx.font = "800 18px Microsoft YaHei, PingFang SC, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(row.rank), x + 22, y + rowH / 2);
    ctx.textAlign = "left";

    // 武器图标
    const icon = icons[i];
    const iconX = x + 44;
    const iconY = y + (rowH - 40) / 2;
    roundRect(ctx, iconX, iconY, 40, 40, 6);
    ctx.fillStyle = "#e5dfd4";
    ctx.fill();
    if (icon) {
      ctx.save();
      roundRect(ctx, iconX, iconY, 40, 40, 6);
      ctx.clip();
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(icon, iconX, iconY, 40, 40);
      ctx.restore();
    }

    // 名称行
    const textX = iconX + 52;
    let label = row.name;
    if (row.refine) label += ` · ${row.refine}`;
    if (row.isSignature) label += " · 专武";
    if (row.note) label += ` · ${row.note}`;

    ctx.fillStyle = "#886444";
    ctx.font = "650 15px Microsoft YaHei, PingFang SC, sans-serif";
    ctx.fillText(label, textX, y + 22, w - 160);

    // 进度条
    const barX = textX;
    const barY = y + 36;
    const barW = w - 160;
    const barH = 8;
    ctx.fillStyle = "rgba(136,100,68,0.12)";
    roundRect(ctx, barX, barY, barW, barH, 4);
    ctx.fill();
    const fillW = Math.max(4, (row.expect / maxExpect) * barW);
    ctx.fillStyle = "#886444";
    roundRect(ctx, barX, barY, fillW, barH, 4);
    ctx.fill();

    // 期望值
    ctx.font = "800 18px Microsoft YaHei, PingFang SC, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(`${row.expect.toFixed(1)}%`, x + w - 12, y + rowH / 2);
    ctx.textAlign = "left";
  });

  // 底注（统一文案，不含场景/攻略细节）
  ctx.fillStyle = "rgba(136,100,68,0.55)";
  ctx.font = "500 12px Microsoft YaHei, PingFang SC, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(
    "数据来源于网络收集，仅供参考，没有实际意义",
    width / 2,
    height - 18,
    width - pad * 2
  );
  ctx.textAlign = "left";

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), "image/png")
  );
  if (!blob) throw new Error("export failed");

  return {
    blob,
    objectUrl: URL.createObjectURL(blob),
    filename: `${options.character}-武器期望榜.png`,
  };
}

export function downloadWuqiEvPng(objectUrl: string, filename: string) {
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = filename;
  a.click();
}
