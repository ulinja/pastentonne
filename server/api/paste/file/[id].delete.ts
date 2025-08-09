export default defineEventHandler(async (event) => {
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
  let filePaste = await getFilePaste(id);
  if (filePaste === null) {
    throw createError({
      statusCode: 404,
      statusMessage: "Not found.",
    });
  }
  if (filePaste.userId !== user.id) {
    throw createError({
      statusCode: 404,
      statusMessage: "Not found.",
    });
  }

  filePaste = await deleteFilePaste(filePaste.id);
  if (filePaste === null) {
    throw createError({
      statusCode: 500,
      statusMessage: "An unknown error occurred.",
    });
  }
  return filePaste;
});
