import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  modules: ["@nuxt/eslint", "@nuxt/fonts", "@nuxt/icon", "@pinia/nuxt", "shadcn-nuxt", "nuxt-auth-utils"],

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

  runtimeConfig: {
    dataDir: "",
    oauth: {
      authentik: {
        clientId: "",
        clientSecret: "",
        domain: "",
        redirectURL: "",
      },
    },
  },

  css: ["~/assets/css/tailwind.css"],

  shadcn: {
    prefix: "",
    componentDir: "./app/components/ui",
  },

  icon: {
    mode: "svg",
    provider: "none",
    clientBundle: {
      scan: true,
    },
  },
});
