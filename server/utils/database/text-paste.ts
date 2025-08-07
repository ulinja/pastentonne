export async function getTextPaste(id: string): Promise<DbTextPaste | null> {
  const result = await useDrizzle().select().from(tables.textPaste).where(eq(tables.textPaste.id, id)).limit(1);
  if (result.length > 0) return result[0];
  return null;
}

export async function getTextPastesForUser(userId: string): Promise<DbTextPaste[]> {
  const result = await useDrizzle().select().from(tables.textPaste).where(eq(tables.textPaste.userId, userId));
  return result;
}

export async function deleteTextPaste(id: string): Promise<DbTextPaste | null> {
  const result = await useDrizzle().delete(tables.textPaste).where(eq(tables.textPaste.id, id)).returning();
  if (result.length > 0) return result[0];
  return null;
}

export async function createTextPaste(userId: string, name: string, content: string): Promise<DbTextPaste> {
  const result = await useDrizzle()
    .insert(tables.textPaste)
    .values({
      userId: userId,
      name: name,
      content: content,
    })
    .returning();
  return result[0];
}

export async function textPasteNameAlreadyTaken(userId: string, pasteName: string): Promise<boolean> {
  const result = await useDrizzle()
    .select()
    .from(tables.textPaste)
    .where(and(eq(tables.textPaste.userId, userId), eq(tables.textPaste.name, pasteName)))
    .limit(1);
  return result.length > 0;
}
