export const parseFolder = (data) => {
  let folderName = null;
  try {
    const parsed = JSON.parse(data.description);
    folderName = parsed.folderName || null;
  } catch (err) {
    folderName = null;
  }
  return folderName;
};
