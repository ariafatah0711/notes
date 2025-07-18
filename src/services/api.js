import { handleGistApiError, handleGistMessage, handleGistErrorResponse } from "../handlers/apiHandlers";
import { getActiveAccount } from "../utils/auth";

// GITHUB Gist API endpoint
const GIST_API = "https://api.github.com/gists";
// alert(token);

// Helper untuk ambil token dari akun aktif
function getGithubToken() {
  const acc = getActiveAccount();
  // Custom: token, Default/API/Local: api
  if (!acc) return "";
  if (acc.type === "github") return acc.token;
  if (acc.type === "api" || acc.type === "local") return acc.api;
  return "";
}

// Helper untuk membuat URL dengan query param acak
function withNoCache(url) {
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}t=${Date.now()}`;
}

export const fetchGists = async () => {
  try {
    const response = await fetch(withNoCache(GIST_API), {
      headers: {
        Authorization: `token ${getGithubToken()}`,
      },
    });
    if (!response.ok) return handleGistErrorResponse(response);
    handleGistMessage(`fetch (Success): GET ${GIST_API}`);
    return response.json();
  } catch (error) {
    return handleGistApiError({ status: 500, message: "Server Internal Error" });
  }
};

export const fetchGist = async (id) => {
  try {
    const response = await fetch(withNoCache(`${GIST_API}/${id}`), {
      headers: {
        Authorization: `token ${getGithubToken()}`,
      },
    });
    if (!response.ok) return handleGistErrorResponse(response, true);
    handleGistMessage(`fetch (Success): GET ${GIST_API}/${id}`);
    return response.json();
  } catch (error) {
    return handleGistApiError({ status: 500, message: "Server Internal Error", swall: true });
  }
};

export const createGist = async (folderName) => {
  if (!navigator.onLine) return handleGistApiError({ status: 404, message: "Tidak ada koneksi internet.", swall: true });
  try {
    // Cek duplikat folderName (opsional, bisa fetchGists dulu dan cek di FE)
    // Format description harus JSON string agar bisa di-parse FE
    const payload = {
      public: true,
      files: { ".placeholder": { content: "_" } },
      description: JSON.stringify({ folderName }),
    };
    const response = await fetch(withNoCache(GIST_API), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${getGithubToken()}`,
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) return handleGistErrorResponse(response, true);
    const data = await response.json();
    handleGistMessage(`fetch (Success): POST ${GIST_API} \ncreateFolder: ${folderName}`);
    handleGistMessage(`berhasil menambah folder`, "success");
    return data.id;
  } catch (error) {
    return handleGistApiError({ status: 500, message: "Server Internal Error", swall: true });
  }
};

export const updateFolderGist = async (id, folderName, files) => {
  if (!navigator.onLine) return handleGistApiError({ status: 404, message: "Tidak ada koneksi internet.", swall: true });
  try {
    // PATCH description dan files
    const payload = {
      description: JSON.stringify({ folderName }),
      files,
    };
    const response = await fetch(withNoCache(`${GIST_API}/${id}`), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${getGithubToken()}`,
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) return handleGistErrorResponse(response);
    handleGistMessage(`fetch (Success): PATCH ${GIST_API}/${id} \nupdateFolder: ${folderName}`);
    handleGistMessage(`berhasil mengganti nama`, "success");
    return response.json();
  } catch (error) {
    return handleGistApiError({ status: 500, message: "Server Internal Error", swall: true });
  }
};

export const deleteGist = async (id) => {
  if (!navigator.onLine) return handleGistApiError({ status: 404, message: "Tidak ada koneksi internet.", swall: true });
  try {
    const response = await fetch(withNoCache(`${GIST_API}/${id}`), {
      method: "DELETE",
      headers: {
        Authorization: `token ${getGithubToken()}`,
      },
    });
    handleGistMessage(`fetch (Success): DELETE ${GIST_API}/${id} \ndeleteFolder: ${id}`);
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
    const response = await fetch(withNoCache(`${GIST_API}/${id}`), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${getGithubToken()}`,
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) return handleGistErrorResponse(response, true);
    handleGistMessage(`fetch (Success): PATCH ${GIST_API}/${id} \nupdateFile: ${Object.keys(files)}`);
    handleGistMessage(`berhasil mengedit file`, "success");
    return response.json();
  } catch (error) {
    return handleGistApiError({ status: 500, message: "Server Internal Error", swall: true });
  }
};
