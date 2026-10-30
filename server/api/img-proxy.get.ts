const ALLOWED_HOSTS = new Set([
  "act-upload.mihoyo.com",
  "upload-bbs.mihoyo.com",
  "bbs.mihoyo.com",
  "webstatic.mihoyo.com",
  "img-static.mihoyo.com",
  "static.nanoka.cc",
]);

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const raw = typeof query.url === "string" ? query.url : "";
  if (!raw) {
    throw createError({ statusCode: 400, statusMessage: "missing url" });
  }

  let target: URL;
  try {
    target = new URL(raw);
  } catch {
    throw createError({ statusCode: 400, statusMessage: "invalid url" });
  }

  if (target.protocol !== "https:" && target.protocol !== "http:") {
    throw createError({ statusCode: 400, statusMessage: "invalid protocol" });
  }
  if (!ALLOWED_HOSTS.has(target.hostname)) {
    throw createError({ statusCode: 403, statusMessage: "host not allowed" });
  }

  const upstream = await fetch(target.toString(), {
    headers: {
      Referer: "https://bbs.mihoyo.com/",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });

  if (!upstream.ok) {
    throw createError({
      statusCode: 502,
      statusMessage: `upstream ${upstream.status}`,
    });
  }

  const contentType = upstream.headers.get("content-type") || "image/png";
  const buf = Buffer.from(await upstream.arrayBuffer());
  setHeader(event, "Content-Type", contentType);
  setHeader(event, "Cache-Control", "public, max-age=86400");
  return buf;
});
