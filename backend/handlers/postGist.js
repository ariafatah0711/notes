import { GITHUB_API, headers } from "../utils/apiConfig.js";
import { parseFolder } from "../utils/parse.js";

export const handlePost = async (req, res) => {
  const { folderName, ...gistBody } = req.body;
  const existingGistsRes = await fetch(GITHUB_API, { headers });
  const existingGists = await existingGistsRes.json();

  const isDuplicate = existingGists.some((gist) => parseFolder(gist) === folderName);
  if (isDuplicate) {
    return res.status(409).json({ error: "Folder name already exists" });
  }

  const postBody = { ...gistBody, description: JSON.stringify({ folderName }) };

  const response = await fetch(GITHUB_API, {
    method: "POST",
    headers,
    body: JSON.stringify(postBody),
  });

  const data = await response.json();
  return res.status(response.status).json(data);
};
