import { v7 as uuid7 } from "uuid";
import { relations } from "drizzle-orm";
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
    index("user_oauth_server_idx").on(table.oauthServer),
    index("user_oauth_sub_idx").on(table.oauthSub),
  ],
);
export const userRelations = relations(user, ({ many }) => ({
  textPastes: many(textPaste),
  filePastes: many(filePaste),
}));

export const textPaste = sqliteTable(
  "text_paste",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => uuid7()),
    userId: text("user_id").references(() => user.id, { onDelete: "cascade" }).notNull(),
    name: text("name").notNull(),
    content: text("content").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).defaultNow().notNull(),
  },
  (table) => [
    unique("text_paste_user_id_name_unique").on(table.userId, table.name),
    index("text_paste_user_id_idx").on(table.userId),
    index("text_paste_name_idx").on(table.name),
    index("text_paste_created_at_idx").on(table.createdAt),
  ],
);
export const textPasteRelations = relations(textPaste, ({one}) => ({
  user: one(user, {
    fields: [textPaste.userId],
    references: [user.id],
  }),
}));

export const filePaste = sqliteTable(
  "file_paste",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => uuid7()),
    userId: text("user_id").references(() => user.id, { onDelete: "cascade" }).notNull(),
    name: text("name").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).defaultNow().notNull(),
  },
  (table) => [
    unique("file_paste_user_id_name_unique").on(table.userId, table.name),
    index("file_paste_user_id_idx").on(table.userId),
    index("file_paste_name_idx").on(table.name),
    index("file_paste_created_at_idx").on(table.createdAt),
  ],
);
export const filePasteRelations = relations(filePaste, ({one, many }) => ({
  user: one(user, {
    fields: [filePaste.userId],
    references: [user.id],
  }),
  files: many(file),
}));

export const file = sqliteTable(
  "file",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => uuid7()),
    filePasteId: text("file_paste_id").references(() => filePaste.id, { onDelete: "cascade" }).notNull(),
    name: text("name").notNull(),
  },
  (table) => [
    unique("file_file_paste_id_name_unique").on(table.filePasteId, table.name),
    index("file_file_paste_id_idx").on(table.filePasteId),
    index("file_name_idx").on(table.name),
  ],
);
export const fileRelations = relations(file, ({one}) => ({
  filePaste: one(filePaste, {
    fields: [file.filePasteId],
    references: [filePaste.id],
  }),
}));
