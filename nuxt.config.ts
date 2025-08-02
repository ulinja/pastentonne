import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  modules: [
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@pinia/nuxt",
    "shadcn-nuxt",
    "@sidebase/nuxt-auth",
  ],

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
    dataDir: "./.data",
    authOrigin: "",
    authSecret: "",
    authentikClientId: "",
    authentikClientSecret: "",
    authentikIssuer: "",
  },

  css: ["~/assets/css/tailwind.css"],

  shadcn: {
    prefix: "",
    componentDir: "./app/components/ui",
  },

  auth: {
    isEnabled: true,
    originEnvKey: "NUXT_AUTH_ORIGIN",
    globalAppMiddleware: true,
    provider: {
      type: "authjs",
      trustHost: false,
      defaultProvider: "authentik",
      addDefaultCallbackUrl: true,
    },
  },

  icon: {
    mode: "svg",
    provider: "none",
    clientBundle: {
      scan: true,
    },
  },
});
