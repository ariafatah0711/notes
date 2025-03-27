import { apiDomain } from "../config";
import { handleGistApiError, handleGistMessage, handleGistErrorResponse } from "../handlers/apiHandlers";

export const fetchGists = async () => {
  try {
    const response = await fetch(`${apiDomain}/gists`);

    if (!response.ok) return handleGistErrorResponse(response);

    handleGistMessage(`fetch (Success): GET ${apiDomain}/gists`);
    return response.json();
  } catch (error) {
    return handleGistApiError({ status: 500, message: "Server Internal Error" });
  }
};

export const fetchGist = async (id) => {
  try {
    const response = await fetch(`${apiDomain}/gists/${id}`);

    if (!response.ok) return handleGistErrorResponse(response, true);

    handleGistMessage(`fetch (Success): GET ${apiDomain}/gists/${id}`);
    return response.json();
  } catch (error) {
    return handleGistApiError({ status: 500, message: "Server Internal Error", swall: true });
  }
};

export const createGist = async (folderName) => {
  if (!navigator.onLine) return handleGistApiError({ status: 404, message: "Tidak ada koneksi internet.", swall: true });

  try {
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

    if (!response.ok) return handleGistErrorResponse(response, true);

    const data = await response.json();

    handleGistMessage(`fetch (Success): POST ${apiDomain}/gists \ncreateFolder: ${folderName}`);
    handleGistMessage(`berhasil menambah folder`, "success");
    return data.id;
  } catch (error) {
    return handleGistApiError({ status: 500, message: "Server Internal Error", swall: true });
  }
};

export const updateFolderGist = async (id, folderName, files) => {
  if (!navigator.onLine) return handleGistApiError({ status: 404, message: "Tidak ada koneksi internet.", swall: true });

  try {
    const payload = { id, folderName, files };
    const response = await fetch(`${apiDomain}/gists`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) return handleGistErrorResponse(response);

    handleGistMessage(`fetch (Success): POST ${apiDomain}/gists \nupdateFolder: ${folderName}`);
    handleGistMessage(`berhasil mengganti nama`, "success");
    return response.json();
  } catch (error) {
    return handleGistApiError({ status: 500, message: "Server Internal Error", swall: true });
  }
};

export const deleteGist = async (id) => {
  if (!navigator.onLine) return handleGistApiError({ status: 404, message: "Tidak ada koneksi internet.", swall: true });

  try {
    // return await fetch(`${apiDomain}/gists/${id}`, { method: "DELETE" });
    const response = await fetch(`${apiDomain}/gists/${id}`, { method: "DELETE" });

    handleGistMessage(`fetch (Success): POST ${apiDomain}/gists/${id} \ndeleteFolder: ${id}`);
    console.log(response);
    if (response.ok === true) {
      handleGistMessage(`berhasil menghapus folder`, "success");
    } else if (response.status === 404) {
      throw new Error("error");
    } else {
      handleGistMessage(`gagal menghapus folder`, "error");
    }
  } catch (error) {
    return handleGistApiError({ status: 500, message: "Server Internal Error", swall: true });
  }
};

export const updateGist = async (id, files) => {
  if (!navigator.onLine) return handleGistApiError({ status: 404, message: "Tidak ada koneksi internet.", swall: true });

  try {
    const payload = { files };
    const response = await fetch(`${apiDomain}/gists/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    console.log(response);

    if (!response.ok) return handleGistErrorResponse(response, true);

    handleGistMessage(`fetch (Success): POST ${apiDomain}/gists/${id} \nupdateFile: ${files}`);
    handleGistMessage(`berhasil mengedit file`, "success");
    return response.json();
  } catch (error) {
    return handleGistApiError({ status: 500, message: "Server Internal Error", swall: true });
  }
};
