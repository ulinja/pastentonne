import type { H3Event, H3Error } from "h3";

interface AuthentikUser {
  sub: string;
  email: string;
  name: string;
  preferred_username: string;
}

async function userExists(
  providerName: (typeof tables.user.oauthServer.enumValues)[number],
  sub: string,
): Promise<boolean> {
  const result = await useDrizzle()
    .select()
    .from(tables.user)
    .where(and(eq(tables.user.oauthServer, providerName), eq(tables.user.oauthSub, sub)))
    .limit(1);
  return result.length > 0;
}

async function getUser(
  providerName: (typeof tables.user.oauthServer.enumValues)[number],
  sub: string,
): Promise<DbUser | null> {
  const result = await useDrizzle()
    .select()
    .from(tables.user)
    .where(and(eq(tables.user.oauthServer, providerName), eq(tables.user.oauthSub, sub)))
    .limit(1);
  if (result.length > 0) return result[0];
  return null;
}

async function createUser(user: AuthentikUser): Promise<DbUser> {
  const result = await useDrizzle()
    .insert(tables.user)
    .values({
      oauthServer: "AUTHENTIK",
      oauthSub: user.sub,
      email: user.email,
      username: user.preferred_username,
      name: user.name,
    })
    .returning();
  return result[0];
}

export default defineOAuthAuthentikEventHandler({
  async onSuccess(event: H3Event, { user, tokens }: { user: AuthentikUser; tokens: any }) {
    let dbUser = await getUser("AUTHENTIK", user.sub);
    if (dbUser === null) {
      dbUser = await createUser(user);
    } else {
      await useDrizzle()
        .update(tables.user)
        .set({
          lastLoginAt: new Date(),
        })
        .where(eq(tables.user.id, dbUser.id));
    }
    await setUserSession(event, {
      user: {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        username: dbUser.username,
      },
    });
    return sendRedirect(event, "/");
  },
  onError(event: H3Event, error: H3Error) {
    console.error("Authentik OAuth error:", error);
    return sendRedirect(event, "/");
  },
});
