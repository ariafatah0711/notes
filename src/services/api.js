import { apiDomain } from "../config";

export const fetchGists = async () => {
  console.log("fetchGist");
  const response = await fetch(`${apiDomain}/gists`);
  return response.ok ? response.json() : { status: response.status, error: "Failed to fetch Gist" };
  // return response.json();
};

// export const fetchGists = async () => {
//   try {
//     const response = await fetch(`${apiDomain}/gists`);

//     if (!response.ok) {
//       if (response.status === 403) {
//         return { error: true, status: 403, message: "Access forbidden. Please check your authentication or API rate limit." };
//       }
//       return { error: true, status: response.status, message: `Error: ${response.status}` };
//     }

//     const data = await response.json();
//     return { error: false, data };
//   } catch (error) {
//     console.error("Failed to fetch gists:", error.message);
//     return { error: true, status: 500, message: error.message };
//   }
// };

export const fetchGist = async (id) => {
  console.log(`fetchGist ${id}`);
  const response = await fetch(`${apiDomain}/gists/${id}`);
  return response.ok ? response.json() : { status: response.status, error: "Failed to fetch Gist" };
  // return response.json();
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
