import { v7 as uuid7 } from "uuid";
import { sqliteTable, text, integer, unique, index } from "drizzle-orm/sqlite-core";

export const user = sqliteTable(
  "user",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => uuid7()),
    oauthServer: text("oauth_server", { enum: ["AUTHENTIK"] })
      .notNull()
      .default("AUTHENTIK"),
    oauthSub: text("oauth_sub").notNull(),
    email: text("email").notNull(),
    username: text("username").notNull(),
    name: text("name").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).defaultNow().notNull(),
    lastLoginAt: integer("last_login_at", { mode: "timestamp_ms" }).defaultNow().notNull(),
  },
  (table) => [
    unique("user_oauth_server_oauth_sub_unique").on(table.oauthServer, table.oauthSub),
    index("oauth_server_idx").on(table.oauthServer),
    index("oauth_sub_idx").on(table.oauthSub),
  ],
);
