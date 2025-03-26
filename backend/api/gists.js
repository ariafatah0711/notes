import { handleGet } from "../handlers/getGists.js";
import { handlePost } from "../handlers/postGist.js";
import { handlePatch } from "../handlers/patchGist.js";
import { handleDelete } from "../handlers/deleteGist.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    switch (req.method) {
      case "GET":
        return await handleGet(req, res);
      case "POST":
        return await handlePost(req, res);
      case "PATCH":
        return await handlePatch(req, res);
      case "DELETE":
        return await handleDelete(req, res);
      default:
        return res.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (error) {
    return handleError(res, error);
  }
}
