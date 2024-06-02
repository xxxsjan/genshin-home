import { createResolver } from "@nuxt/kit";
const { resolve } = createResolver(import.meta.url);
// import ElementPlus from 'unplugin-element-plus/vite'
import daisyui from "daisyui";
if (process.env.NODE_ENV === "development") {
  // load env variables from .env.development.local
  require("dotenv").config({ path: ".env.development.local" });
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    // "@element-plus/nuxt",
    "@nuxtjs/tailwindcss",
  ],

  css: [
    "~/assets/css/main.css",
    //  resolve("./assets/scss/mixins.scss")
  ],
  vite: {
    plugins: [],
  },
  // https://tailwindcss.nuxtjs.org/getting-started/installation#tailwind-files
  tailwindcss: {
    // Options
    config: {
      plugins: [daisyui],
    },
  },
});
