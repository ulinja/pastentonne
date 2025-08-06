export default defineNuxtRouteMiddleware((to, from) => {
  const { loggedIn } = useUserSession();
  if (!loggedIn.value)
    abortNavigation(
      createError({
        statusCode: 401,
        statusMessage: "You must be logged in to view this page.",
      }),
    );
});
