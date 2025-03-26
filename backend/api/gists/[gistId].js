import { handleGet } from "../../handlers/getGists.js";
import { handlePatchOrDelete } from "../../handlers/patchOrDeleteGist.js";
import { handleError } from "../../utils/errorHandler.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();

  const { gistId } = req.query;

  try {
    if (req.method === "GET") {
      return await handleGet(req, res, gistId);
    } else if (["PATCH", "DELETE"].includes(req.method)) {
      return await handlePatchOrDelete(req, res, gistId);
    } else {
      return res.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (error) {
    return handleError(res, error);
  }
}
