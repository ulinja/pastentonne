export default defineEventHandler(async (event) => {
  const { user } = await getUserSession(event);
  if (!user) throw createError({
    status: 401,
    statusMessage: "Unauthenticated.",
  });
});
