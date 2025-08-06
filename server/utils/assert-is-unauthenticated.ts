export default defineEventHandler(async (event) => {
  const { user } = await getUserSession(event);
  if (user)
    throw createError({
      status: 400,
      statusMessage: "This enpoint permits unauthenticated requests only.",
    });
});
