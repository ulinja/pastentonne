export default async function () {
  const { loggedIn } = useUserSession();
  if (!loggedIn.value) throw new Error("Tried to fetch text pastes but user was not logged in");

  const { data, error } = await useFetch("/api/paste/file", {
    transform: (data): DbFilePaste[] => {
      return data.map((paste) => ({
        ...paste,
        createdAt: new Date(paste.createdAt),
        type: "file",
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
  return data.value;
}
