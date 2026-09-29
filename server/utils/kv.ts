import { createClient, type VercelKV } from "@vercel/kv";

let client: VercelKV | null | undefined;

/** 有环境变量时用 Vercel KV，否则返回 null（走内存 / 本地 JSON 兜底） */
export function getKv(): VercelKV | null {
  if (client !== undefined) return client;
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) {
    client = null;
    return client;
  }
  client = createClient({ url, token });
  return client;
}
