import { NuxtAuthHandler } from '#auth'
import AuthentikProvider from "next-auth/providers/authentik";

export default NuxtAuthHandler({
  secret: useRuntimeConfig().authSecret,
  providers: [
    AuthentikProvider.default({
      clientId: useRuntimeConfig().authentikClientId,
      clientSecret: useRuntimeConfig().authentikClientSecret,
      issuer: useRuntimeConfig().authentikIssuer,
    }),
  ],
});
