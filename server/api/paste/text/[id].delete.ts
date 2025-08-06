export default defineEventHandler(async (event): Promise<DbTextPaste> => {
  await assertIsAuthenticated(event);
  const { user } = await getUserSession(event);

  // TODO: consider using zod with `getValidatedRouterParams` (see https://h3.dev/examples/validate-data#validate-params)
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Must specify id.",
    });
  }
  let textPaste = await getTextPaste(id);
  if (textPaste === null) {
    throw createError({
      statusCode: 404,
      statusMessage: "Not found.",
    });
  }
  if (textPaste.userId !== user.id) {
    throw createError({
      statusCode: 404,
      statusMessage: "Not found.",
    });
  }

  textPaste = await deleteTextPaste(textPaste.id);
  if (textPaste === null) {
    throw createError({
      statusCode: 500,
      statusMessage: "An unknown error occurred.",
    });
  }
  return textPaste;
});
