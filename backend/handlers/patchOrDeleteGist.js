import { GITHUB_API, headers } from "../utils/apiConfig.js";

export const handlePatchOrDelete = async (req, res, gistId) => {
  const response = await fetch(`${GITHUB_API}/${gistId}`, {
    method: req.method,
    headers,
    body: JSON.stringify(req.body),
  });

  if (!response.ok) {
    const errorMessage = await response.json().catch(() => ({ error: "Unknown Error" }));
    return res.status(response.status).json(errorMessage);
  }

  if (req.method === "DELETE") {
    return res.status(response.status).json({ message: "Gist deleted successfully" });
  }

  const data = await response.json();
  return res.status(response.status).json(data);
};
