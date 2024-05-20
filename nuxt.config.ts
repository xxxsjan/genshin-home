import { createResolver } from "@nuxt/kit";
const { resolve } = createResolver(import.meta.url);
// import ElementPlus from 'unplugin-element-plus/vite'

if (process.env.NODE_ENV === "development") {
  require("dotenv").config({ path: ".env.development.local" });
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ["~/assets/css/main.css", resolve("./assets/scss/mixins.scss")],
  modules: ["@element-plus/nuxt"],
  vite: {
    plugins: [
      // ElementPlus()
    ],
  },
});
