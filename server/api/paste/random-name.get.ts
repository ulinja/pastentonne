import { access, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import randPick from "#shared/rand-pick";

type FileEnum = "ADJECTIVES" | "VERBS" | "NOUNS";

function getPathToDataFile(file: FileEnum): string {
  const pathToAssetsDir = resolve(join(process.cwd(), "server/assets/wordlists"));
  let filename: string;
  switch (file) {
    case "ADJECTIVES":
      filename = "adjectives.txt";
      break;
    case "VERBS":
      filename = "irregular-verbs-present-participle.txt";
      break;
    case "NOUNS":
      filename = "animals.txt";
      break;
  }
  return join(pathToAssetsDir, filename);
}

async function getWordsFromDataFile(file: FileEnum): Promise<string[]> {
  const pathToDataFile = getPathToDataFile(file);
  try {
    await access(pathToDataFile);
  } catch {
    throw createError({ statusCode: 500 });
  }
  const data = await readFile(pathToDataFile, { encoding: "utf8" });
  const words = data.split("\n");
  // Remove empty string from array if present
  if (words.splice(-1).includes("")) words.pop();
  return words;
}

function generateName(adjectives: string[], verbs: string[], nouns: string[]): string {
  const nameWords: string[] = [];
  for (const list of [adjectives, verbs, nouns]) {
    nameWords.push(randPick(list));
  }
  return nameWords.join("-");
}

export default defineEventHandler(async (event): Promise<string> => {
  await assertIsAuthenticated(event);

  const adjectives = await getWordsFromDataFile("ADJECTIVES");
  const verbs = await getWordsFromDataFile("VERBS");
  const nouns = await getWordsFromDataFile("NOUNS");

  const randomName = generateName(adjectives, verbs, nouns);
  // TODO: make sure name is not taken already

  return randomName;
});
