// https://nuxt.com/docs/api/configuration/nuxt-config

require("dotenv").config({ path: ".env.development.local" });

console.log(process.env.NODE_ENV, process.env.KV_REST_API_TOKEN);

export default defineNuxtConfig({
  devtools: { enabled: true },
});
