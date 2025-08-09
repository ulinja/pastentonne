export default defineEventHandler(async (event): Promise<boolean> => {
  await assertIsAuthenticated(event);
  const { user } = await getUserSession(event);

  // TODO: consider using zod with `getValidatedQuery` (see https://unjs.io/blog/2023-08-15-h3-towards-the-edge-of-the-web#runtime-type-safe-request-utils)
  const query = getQuery(event);
  const pasteName = query.pasteName;
  if (typeof(pasteName) !== "string" || pasteName.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "query parameter 'pasteName' not specified",
    });
  }

  return await pasteNameAlreadyTaken(user.id, pasteName);
});
