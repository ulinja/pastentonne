import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  schema: "./server/database/schema.ts",
  out: "./server/database/migrations",
  dbCredentials: {
    url: process.env.NUXT_DATA_DIR ? `${process.env.NUXT_DATA_DIR}/pastentonne.db` : "./data/pastentonne.db",
  },
});
