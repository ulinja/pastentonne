async function pasteNameAlreadyTaken(userId: string, pasteName: string): Promise<boolean> {
  const result = await useDrizzle().select().from(tables.textPaste).where(
    and(
      eq(tables.textPaste.userId, userId),
      eq(tables.textPaste.name, pasteName),
    )
  ).limit(1);
  return result.length > 0;
}

async function createTextPaste(userId: string, name: string, content: string): Promise<DbTextPaste> {
  const result = await useDrizzle().insert(tables.textPaste).values({
    userId: userId,
    name: name,
    content: content,
  }).returning();
  return result[0];
}

export default defineEventHandler(async (event): Promise<DbTextPaste> => {
  await assertIsAuthenticated(event);
  const { user } = await getUserSession(event);

  // TODO: consider using zod with `readValidatedBody` (see https://unjs.io/blog/2023-08-15-h3-towards-the-edge-of-the-web#runtime-type-safe-request-utils)
  const body = await readBody(event);
  // TODO validate body data types
  const name: string = body.name;
  const content: string = body.content;

  if (name.length === 0) throw createError({
    status: 400,
    statusMessage: "name cannot be empty",
  });
  if (content.length === 0) throw createError({
    status: 400,
    statusMessage: "content cannot be empty",
  });
  if (await pasteNameAlreadyTaken(user.id, name)) throw createError({
    status: 400,
    statusMessage: "name is already taken."
  });

  return createTextPaste(user.id, name, content);
});
