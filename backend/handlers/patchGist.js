import { GITHUB_API, headers } from "../utils/apiConfig.js";
import { parseFolder } from "../utils/parse.js";

export const handlePatch = async (req, res) => {
  const { id, folderName: newFolderName } = req.body;
  const url = `${GITHUB_API}/${id}`;

  const existingGistsRes = await fetch(GITHUB_API, { headers });
  const existingGists = await existingGistsRes.json();

  const isDuplicate = existingGists.some((gist) => parseFolder(gist) === newFolderName && gist.id !== id);
  if (isDuplicate) {
    return res.status(409).json({ error: "Folder name already exists" });
  }

  const oldGistRes = await fetch(url, { headers });
  if (!oldGistRes.ok) return res.status(oldGistRes.status).json({ error: "Gist not found" });

  const oldGist = await oldGistRes.json();

  const patchBody = { description: JSON.stringify({ folderName: newFolderName }), files: oldGist.files };

  const response = await fetch(url, { method: "PATCH", headers, body: JSON.stringify(patchBody) });
  const data = await response.json();

  return res.status(response.status).json(data);
};
