export async function pasteNameAlreadyTaken(userId: string, pasteName: string): Promise<boolean> {
  const textPasteNameTaken = await textPasteNameAlreadyTaken(userId, pasteName);
  const filePasteNameTaken = await filePasteNameAlreadyTaken(userId, pasteName);
  return textPasteNameTaken || filePasteNameTaken;
}
