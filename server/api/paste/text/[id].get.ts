async function getTextPaste(id: string): Promise<DbTextPaste | null> {
  const result = await useDrizzle().select().from(tables.textPaste).where(eq(tables.textPaste.id, id)).limit(1);
  if (result.length > 0) return result[0];
  return null;
}

export default defineEventHandler(async (event): Promise<DbTextPaste> => {
  await assertIsAuthenticated(event);
  const { user } = await getUserSession(event);

  // TODO: consider using zod with `getValidatedRouterParams` (see https://h3.dev/examples/validate-data#validate-params)
  const id = getRouterParam(event, "id");
  if (!id)
    throw createError({
      statusCode: 400,
      statusMessage: "Must specify id.",
    });
  const textPaste = await getTextPaste(id);
  if (textPaste === null)
    throw createError({
      statusCode: 404,
      statusMessage: "Not found",
    });
  if (textPaste.userId !== user.id)
    throw createError({
      statusCode: 404,
      statusMessage: "Not found",
    });

  return textPaste;
});
