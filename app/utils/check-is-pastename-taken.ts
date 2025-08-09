export default async function (name: string): Promise<boolean> {
  return await $fetch("/api/paste/check-is-name-taken", {
    query: {
      pasteName: name,
    },
  });
}
