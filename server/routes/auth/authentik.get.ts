export default defineOAuthAuthentikEventHandler({
  async onSuccess(event, { user, tokens }) {
    // TODO: handle user.sub user ID string unique to authentik users:
    // - create db entries and subdirectories
    await setUserSession(event, {
      user: {
        id: user.sub,
        email: user.email,
        name: user.name,
        username: user.preferred_username,
      },
    });
    return sendRedirect(event, "/");
  },
  onError(event, error) {
    console.error("Authentik OAuth error:", error);
    return sendRedirect(event, "/");
  },
});
