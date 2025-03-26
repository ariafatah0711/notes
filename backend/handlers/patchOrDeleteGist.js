import { GITHUB_API, headers } from "../utils/apiConfig.js";

export const handlePatchOrDelete = async (req, res, gistId) => {
  const response = await fetch(`${GITHUB_API}/${gistId}`, {
    method: req.method,
    headers,
    body: JSON.stringify(req.body),
  });

  if (req.method === "DELETE") {
    return res.status(response.status).end();
  }

  const data = await response.json();
  return res.status(response.status).json(data);
};
