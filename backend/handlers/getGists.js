import { GITHUB_API, headers } from "../utils/apiConfig.js";
import { parseFolder } from "../utils/parse.js";

export const handleGet = async (req, res) => {
  const existingGistsRes = await fetch(GITHUB_API, { headers });

  if (!existingGistsRes.ok) {
    return res.status(existingGistsRes.status).send(await existingGistsRes.text());
  }

  const existingGists = await existingGistsRes.json();
  const gistsWithFolder = existingGists.map((gist) => ({
    ...gist,
    folderName: parseFolder(gist),
  }));

  return res.status(200).json(gistsWithFolder);
};
