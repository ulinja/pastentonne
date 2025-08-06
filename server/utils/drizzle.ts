import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "../database/schema";

export { sql, eq, and, or, count } from "drizzle-orm";

export const tables = schema;

export function useDrizzle() {
  return drizzle({
    schema,
    casing: "snake_case",
    connection: {
      source: `${useRuntimeConfig().dataDir}/pastentonne.db`,
    },
  });
}

export type DbUser      = typeof schema.user.$inferSelect;
export type DbTextPaste = typeof schema.textPaste.$inferSelect;
export type DbFilePaste = typeof schema.filePaste.$inferSelect;
export type DbFile      = typeof schema.file.$inferSelect;
