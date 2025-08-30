export default async function (): Promise<DbTextPaste[]> {
  const { loggedIn } = useUserSession();
  if (!loggedIn.value) throw new Error("Tried to fetch text pastes but user was not logged in");

  const { data, error } = await useFetch("/api/paste/text", {
    transform: (data): DbTextPaste[] => {
      return data.map((paste) => ({
        ...paste,
        createdAt: new Date(paste.createdAt),
        type: "text",
      }));
    },
  });
  if (error.value) {
    throw createError({
      statusCode: error.value.statusCode,
      statusText: error.value.statusText,
      fatal: true,
    });
  }
  if (data.value === undefined) throw new Error("No data");
  return data.value;
}
