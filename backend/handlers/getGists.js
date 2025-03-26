import { GITHUB_API, headers } from "../utils/apiConfig.js";
import { parseFolder } from "../utils/parse.js";

export const handleGet = async (req, res, gistId) => {
  const url = gistId ? `${GITHUB_API}/${gistId}` : GITHUB_API;

  const response = await fetch(url, { headers });

  if (!response.ok) {
    return res.status(response.status).send(await response.text());
  }

  const data = await response.json();

  if (gistId) {
    if (data.files) {
      data.files = Object.fromEntries(Object.entries(data.files).filter(([fileName]) => fileName !== ".placeholder"));
    }

    const folderName = parseFolder(data);
    return res.status(200).json({ ...data, folderName });
  }

  // Jika semua Gists
  const gistsWithFolder = data.map((gist) => ({
    ...gist,
    folderName: parseFolder(gist),
  }));

  return res.status(200).json(gistsWithFolder);
};
