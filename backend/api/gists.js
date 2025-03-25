// import { parseFolder } from "./util/parse";
import { parseFolder } from "./util/parse.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();

  const GITHUB_API = "https://api.github.com/gists";
  const headers = {
    Authorization: `token ${process.env.GITHUB_TOKEN}`,
    "Content-Type": "application/json",
  };

  let response;
  let data;
  let url;

  try {
    const existingGistsRes = await fetch(GITHUB_API, { headers });

    /* debug error response */
    // if (existingGistsRes.ok) {
    if (!existingGistsRes.ok) {
      const errorMessage = await existingGistsRes.json().catch(() => ({}));
      return res.status(existingGistsRes.status).json({
        status: existingGistsRes.status,
        error: errorMessage?.message || "Failed to fetch Gist",
      });
    }

    const existingGists = await existingGistsRes.json();

    switch (req.method) {
      case "GET":
        const gistsWithFolder = existingGists.map((gist) => {
          const folderName = parseFolder(gist);
          return { ...gist, folderName };
        });

        return res.status(200).json(gistsWithFolder);

      case "POST":
        const { folderName, ...gistBody } = req.body;

        const isDuplicate = existingGists.some((gist) => parseFolder(gist) === folderName);
        if (isDuplicate) {
          return res.status(409).json({ error: "Folder name already exists" });
        }

        const postBody = {
          ...gistBody,
          description: JSON.stringify({ folderName }),
        };

        response = await fetch(GITHUB_API, {
          method: "POST",
          headers,
          body: JSON.stringify(postBody),
        });

        data = await response.json();
        return res.status(response.status).json(data);

      case "PATCH":
        const { id, folderName: newFolderName } = req.body;
        url = `${GITHUB_API}/${id}`;

        const isDuplicatePatch = existingGists.some((gist) => parseFolder(gist) === newFolderName && gist.id !== id);
        if (isDuplicatePatch) {
          return res.status(409).json({ error: "Folder name already exists" });
        }

        const oldGistRes = await fetch(url, { headers });
        if (!oldGistRes.ok) {
          return res.status(oldGistRes.status).json({ error: "Gist not found" });
        }
        const oldGist = await oldGistRes.json();

        const patchBody = {
          description: JSON.stringify({ folderName: newFolderName }),
          files: oldGist.files,
        };

        response = await fetch(url, {
          method: "PATCH",
          headers,
          body: JSON.stringify(patchBody),
        });

        data = await response.json();
        return res.status(response.status).json(data);

      case "DELETE":
        const { id: deleteId } = req.body;
        url = `${GITHUB_API}/${deleteId}`;

        response = await fetch(url, {
          method: "DELETE",
          headers,
        });

        return res.status(response.status).json({ message: "Gist deleted" });

      default:
        return res.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
