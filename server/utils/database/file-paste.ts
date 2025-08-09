import path from "node:path";
import {
  access,
  constants,
  glob,
  mkdir,
  rm,
  writeFile,
} from "node:fs/promises";

export interface UploadedFile {
  filename: string;
  type: string;
  data: Buffer<ArrayBufferLike>;
}

function assertFilenamesAreUnique(files: UploadedFile[]): void {
  const filenames = files.map((file) => file.filename);
  if (new Set(filenames).size !== filenames.length) {
    throw new Error("Files array contains duplicate file names");
  }
}

async function assertDirectoryExists(pathToDirectory: string): Promise<void> {
  try {
    await access(pathToDirectory, constants.R_OK | constants.W_OK);
  } catch {
    throw new Error(`Data directory does not exist or is not readable/writable: ${pathToDirectory}`);
  }
}

async function getUserFileStorageDirectoryPath(userId: string): Promise<string> {
  const dataDir = useRuntimeConfig().dataDir;
  await assertDirectoryExists(dataDir);
  return path.join(dataDir, "files", userId);
}

async function getFileStoragePath(userId:string, fileId: string): Promise<string> {
  const userFileStorageDirectoryPath = await getUserFileStorageDirectoryPath(userId);
  return path.join(userFileStorageDirectoryPath, fileId);
}

async function createUserFileStorageDirectory(userId: string) {
  const pathToDir = await getUserFileStorageDirectoryPath(userId);
  await mkdir(pathToDir, { recursive: true, mode: 0o755 });
}

async function removeUserFileStorageDirectory(userId: string) {
  const pathToDir = await getUserFileStorageDirectoryPath(userId);
  await rm(pathToDir, { recursive: true, force: true });
}

async function removeUserFileStorageDirectoryIfEmpty(userId: string) {
  const pathToDir = await getUserFileStorageDirectoryPath(userId);
  const dirContents = [];
  for await (const entry of glob(`${pathToDir}/*`)) dirContents.push(entry);
  if (dirContents.length === 0) {
    await removeUserFileStorageDirectory(userId);
  }
}

export async function getFilePaste(id: string) {
  const result = await useDrizzle().query.filePaste.findFirst({
    where: eq(tables.filePaste.id, id),
    with: {
      files: {
        columns: {
          filePasteId: false,
        },
      },
    }
  });
  return result ?? null;
}

export async function getFilePastesForUser(userId: string) {
  return await useDrizzle().query.filePaste.findMany({
    where: eq(tables.filePaste.userId, userId),
    with: {
      files: {
        columns: {
          filePasteId: false,
        },
      },
    }
  });
}

export async function deleteFilePaste(id: string) {
  const filePaste = await useDrizzle().query.filePaste.findFirst({
    where: eq(tables.filePaste.id, id),
    with: {
      files: true,
      user: true,
    },
  });
  if (!filePaste) throw new Error(`Failed to find FilePaste with ID ${id}`);
  const { user, ...deletedFilePaste } = filePaste;
  for (const file of filePaste.files) {
    await rm(await getFileStoragePath(user.id, file.id));
    // Row deletion handled by cascading delete
  }
  await useDrizzle().delete(tables.filePaste).where(eq(tables.filePaste.id, id));
  await removeUserFileStorageDirectoryIfEmpty(user.id);
  return deletedFilePaste;
}

export async function createFilePaste(userId: string, name: string, files: UploadedFile[]) {
  assertFilenamesAreUnique(files);
  if (files.length === 0) throw new Error("Tried to create a FilePaste with no files.");
  await createUserFileStorageDirectory(userId);

  const filePaste = (await useDrizzle()
    .insert(tables.filePaste)
    .values({
      userId: userId,
      name: name,
    })
    .returning()).at(0);
  if (!filePaste) throw new Error("Failed while writing to file_paste table");

  for (const file of files) {
    const dbFile = (await useDrizzle()
      .insert(tables.file)
      .values({
        filePasteId: filePaste.id,
        name: file.filename,
        mimeType: file.type,
      })
      .returning()).at(0);
    if (!dbFile) throw new Error("Failed while writing to file table");
    const fileStoragePath = await getFileStoragePath(userId, dbFile?.id);
    await writeFile(fileStoragePath, file.data, { mode: 0o644 });
  }

  // Return the DbFilePaste with DbFiles included
  const aggregated = await getFilePaste(filePaste.id);
  if (aggregated === null) throw new Error("Failed to retrieve file_paste and relations");
  return aggregated;
}

export async function filePasteNameAlreadyTaken(userId: string, pasteName: string): Promise<boolean> {
  const result = await useDrizzle()
    .select()
    .from(tables.filePaste)
    .where(and(eq(tables.filePaste.userId, userId), eq(tables.filePaste.name, pasteName)))
    .limit(1);
  return result.length > 0;
}
