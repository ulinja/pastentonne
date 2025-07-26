import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  modules: ["@nuxt/eslint", "@nuxt/fonts", "@nuxt/icon", "@pinia/nuxt"],

  devServer: {
    host: "0.0.0.0",
    port: 8000,
  },
  devtools: {
    enabled: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },

  css: ["~/assets/css/tailwind.css"],

  icon: {
    mode: "svg",
    provider: "none",
    clientBundle: {
      scan: true,
    },
  },
});
