import type { MultiPartData } from "h3";
import type { UploadedFile } from "~~/server/utils/database/file-paste";

function getNameFromMultiPartData(multiPartData: MultiPartData[]): string {
  const nameData = multiPartData.filter((data) => data.name === "name").at(0);
  if (nameData === undefined) {
    throw createError({
      statusCode: 400,
      statusMessage: "name not provided",
    });
  }
  if (nameData.type || nameData.filename) {
    throw createError({
      statusCode: 400,
      statusMessage: "value for name must be a string",
    });
  }
  // TODO: validate as sensible string rather than accepting random binary data
  const name = nameData.data.toString("utf-8");
  if (name.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "name cannot be empty",
    });
  }
  return name;
}

function getUploadedFilesFromMultiPartData(multiPartData: MultiPartData[]): UploadedFile[] {
  const fileData = multiPartData.filter((data) => data.name === "files");
  return fileData.map(({ name, ...uploadedFile }) => uploadedFile as UploadedFile);
}

export default defineEventHandler(async (event) => {
  await assertIsAuthenticated(event);
  const { user } = await getUserSession(event);

  const multipartData = await readMultipartFormData(event);
  if (multipartData === undefined) {
    throw createError({
      statusCode: 400,
      statusMessage: "invalid multipart/form-data",
    });
  }

  const pasteName = getNameFromMultiPartData(multipartData);
  if (await pasteNameAlreadyTaken(user.id, pasteName)) {
    throw createError({
      statusCode: 400,
      statusMessage: "name is already taken.",
    });
  }

  const uploadedFiles = getUploadedFilesFromMultiPartData(multipartData);
  if (uploadedFiles.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "no files were attached",
    });
  }

  return await createFilePaste(user.id, pasteName, uploadedFiles);
});
