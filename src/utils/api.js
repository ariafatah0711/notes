export const addFileToGist = async (gistId, fileName, content) => {
  const response = await fetch("/api/gist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ gistId, fileName, content }),
  });
  return response.json();
};

export const deleteFileFromGist = async (gistId, fileName) => {
  const response = await fetch("/api/gist", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ gistId, fileName }),
  });
  return response.json();
};
