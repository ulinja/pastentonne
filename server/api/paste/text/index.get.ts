import { getTextPastesForUser } from "~~/server/utils/database/text-paste";

export default defineEventHandler(async (event): Promise<DbTextPaste[]> => {
  await assertIsAuthenticated(event);
  const { user } = await getUserSession(event);

  // TODO: consider using zod with `getValidatedRouterParams` (see https://h3.dev/examples/validate-data#validate-params)
  return getTextPastesForUser(user.id);
});
