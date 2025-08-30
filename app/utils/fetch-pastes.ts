export default async function() {
  const { data, error } = await useFetch(`/api/paste`, {
    transform: (data) => {
      return data.map((paste) => ({
        ...paste,
        createdAt: new Date(paste.createdAt),
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
