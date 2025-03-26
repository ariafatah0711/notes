import { apiDomain } from "../config";
import GlobalSwal from "../utils/GlobalSwal";
const Swal = GlobalSwal;

const handleApiError = ({ ok = false, status = 500, message = "Server Internal Error", swall = false, errorData = {} }) => {
  console.error(`fetchGists: ${status} - ${message}`);
  if (swall) Swal.fire("Error", `${status} ${message}`, "error");
  return { ok, status, message, errorData };
};

const handleApiMessage = (message, swall = false) => {
  console.info(message);
  if (swall == "success") Swal.fire("Sukses", message, "success");
  if (swall == "error") Swal.fire("Sukses", message, "error");
};

const handleErrorResponse = async (response, swall = false) => {
  const errorData = await response.json().catch(() => ({}));
  if (swall) Swal.fire("Error", `${errorData.status || 404} ${errorData.message || "Failed to fetch Gist"}`, "error");
  return handleApiError({
    status: errorData.status || response.status,
    message: errorData.message || "Failed to fetch Gist",
  });
};

export const fetchGists = async () => {
  try {
    const response = await fetch(`${apiDomain}/gists`);

    if (!response.ok) return handleErrorResponse(response);

    handleApiMessage(`fetch (Success): GET ${apiDomain}/gists`);
    return response.json();
  } catch (error) {
    return handleApiError({ status: 500, message: "Server Internal Error" });
  }
};

export const fetchGist = async (id) => {
  try {
    const response = await fetch(`${apiDomain}/gists/${id}`);

    if (!response.ok) return handleErrorResponse(response, true);

    handleApiMessage(`fetch (Success): GET ${apiDomain}/gists/${id}`);
    return response.json();
  } catch (error) {
    return handleApiError({ status: 500, message: "Server Internal Error", swall: true });
  }
};

export const createGist = async (folderName) => {
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

    if (!response.ok) return handleErrorResponse(response, true);

    const data = await response.json();

    handleApiMessage(`fetch (Success): POST ${apiDomain}/gists \ncreateFolder: ${folderName}`);
    handleApiMessage(`berhasil menambah folder`, "success");
    return data.id;
  } catch (error) {
    return handleApiError({ status: 500, message: "Server Internal Error", swall: true });
  }
};

export const updateFolderGist = async (id, folderName, files) => {
  try {
    const payload = { id, folderName, files };
    const response = await fetch(`${apiDomain}/gists`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) return handleErrorResponse(response);

    handleApiMessage(`fetch (Success): POST ${apiDomain}/gists \nupdateFolder: ${folderName}`);
    handleApiMessage(`berhasil mengganti nama`, "success");
    return response.json();
  } catch (error) {
    return handleApiError(500, "Server Internal Error", true);
  }
};

export const deleteGist = async (id) => {
  try {
    // return await fetch(`${apiDomain}/gists/${id}`, { method: "DELETE" });
    const response = await fetch(`${apiDomain}/gists/${id}`, { method: "DELETE" });

    if (!response.ok) return handleErrorResponse(response, true);

    handleApiMessage(`fetch (Success): POST ${apiDomain}/gists/${id} \ndeleteFolder: ${id}`);
    // handleApiMessage(`berhasil menghapus folder`, "success");
    return response;
  } catch (error) {
    return handleApiError(500, "Server Internal Error", true);
  }
};

export const updateGist = async (id, files) => {
  try {
    const payload = { files };
    const response = await fetch(`${apiDomain}/gists/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) return handleErrorResponse(response, true);

    handleApiMessage(`fetch (Success): POST ${apiDomain}/gists/${id} \nupdateFile: ${files}`);
    handleApiMessage(`berhasil mengedit file`, "success");
    return response.json();
  } catch (error) {
    return handleApiError(500, "Server Internal Error", true);
  }
};
