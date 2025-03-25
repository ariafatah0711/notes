import { apiDomain } from "../config";

export const fetchGists = async () => {
  const response = await fetch(`${apiDomain}/gists`);
  return response.json();
};

export const fetchGist = async (id) => {
  const response = await fetch(`${apiDomain}/gists/${id}`);
  return response.json();
};

export const createGist = async (folderName) => {
  const payload = {
    public: true,
    files: { ".placeholder": { content: "_" } },
    folderName,
  };
  const response = await fetch(`${apiDomain}/gists`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();

  return data.id;
};

export const updateFolderGist = async (id, folderName, files) => {
  const payload = { id, folderName, files };
  const response = await fetch(`${apiDomain}/gists`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  // if (!response.ok) throw new Error("Failed to update gist");
  if (!response.ok) return;

  return response.json();
};

export const updateGist = async (id, files) => {
  const payload = { files };
  const response = await fetch(`${apiDomain}/gists/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  // if (!response.ok) throw new Error("Failed to update gist");
  if (!response.ok) return;
  return response.json();
};

export const deleteGist = async (id) => {
  return fetch(`${apiDomain}/gists/${id}`, { method: "DELETE" });
};
