import { GITHUB_API, headers, fakeheaders } from "../utils/apiConfig.js";

export const handleDelete = async (req, res) => {
  const { id: deleteId } = req.body;
  const url = `${GITHUB_API}/${deleteId}`;

  const response = await fetch(url, { method: "DELETE", headers });
  // const response = await fetch(url, { method: "DELETE", fakeheaders });
  return res.status(response.status).json({ message: "Gist deleted" });
};
