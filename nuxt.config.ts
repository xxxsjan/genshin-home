// https://nuxt.com/docs/api/configuration/nuxt-config

import { createResolver } from "@nuxt/kit";
const { resolve } = createResolver(import.meta.url);

if (process.env.NODE_ENV === "development") {
  require("dotenv").config({ path: ".env.development.local" });
}

export default defineNuxtConfig({
  devtools: { enabled: true },
  css: [
    "~/assets/css/main.css",
    resolve("./assets/scss/mixins.scss"),
  ],
});
