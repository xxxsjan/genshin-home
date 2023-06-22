import { createClient } from "@vercel/kv";

export default defineEventHandler(async (event) => {
  const users = createClient({
    url: process.env.KV_REST_API_URL as string,
    token: process.env.KV_REST_API_TOKEN as string,
  });

  const user = await users.hgetall("user:me");
  return user;
});
