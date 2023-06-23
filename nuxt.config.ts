// https://nuxt.com/docs/api/configuration/nuxt-config

if (process.env.NODE_ENV === "development") {
  require("dotenv").config({ path: ".env.development.local" });
}

export default defineNuxtConfig({
  devtools: { enabled: true },
});
