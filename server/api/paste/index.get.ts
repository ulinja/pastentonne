import { getTextPastesForUser } from "~~/server/utils/database/text-paste";
import { getFilePastesForUser } from "~~/server/utils/database/file-paste";

export default defineEventHandler(async (event) => {
  await assertIsAuthenticated(event);
  const { user } = await getUserSession(event);

  const textPastes = await getTextPastesForUser(user.id);
  const filePastes = await getFilePastesForUser(user.id);
  const textPastesAnnotated = textPastes.map((textPaste) => ({ "type": "text" as const, ...textPaste }));
  const filePastesAnnotated = filePastes.map((filePaste) => ({ "type": "file" as const, ...filePaste }));
  return [...textPastesAnnotated, ...filePastesAnnotated];
});
