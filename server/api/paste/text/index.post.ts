export default defineEventHandler(async (event): Promise<DbTextPaste> => {
  await assertIsAuthenticated(event);
  const { user } = await getUserSession(event);

  // TODO: consider using zod with `readValidatedBody` (see https://unjs.io/blog/2023-08-15-h3-towards-the-edge-of-the-web#runtime-type-safe-request-utils)
  const body = await readBody(event);
  // TODO validate body data types
  const name: string = body.name;
  const content: string = body.content;

  if (name.length === 0)
    throw createError({
      statusCode: 400,
      statusMessage: "name cannot be empty",
    });
  if (content.length === 0)
    throw createError({
      statusCode: 400,
      statusMessage: "content cannot be empty",
    });
  if (await pasteNameAlreadyTaken(user.id, name)) {
    throw createError({
      statusCode: 400,
      statusMessage: "name is already taken.",
    });
  }

  return createTextPaste(user.id, name, content);
});
