import GlobalSwal from "../utils/GlobalSwal";
const Swal = GlobalSwal;

const handleGistApiError = ({ ok = false, status = 500, message = "Server Internal Error", swall = false, errorData = {} }) => {
  console.error(`fetchGists: ${status} - ${message}`);
  if (swall) Swal.fire("Error", `${status} ${message}`, "error");
  return { ok, status, message, errorData };
};

const handleGistMessage = (message, swall = false) => {
  console.info(message);
  if (swall == "success") Swal.fire("Sukses", message, "success");
  if (swall == "error") Swal.fire("Error", message, "error");
};

const handleGistErrorResponse = async (response, swall = false) => {
  const errorData = await response.json().catch(() => ({}));
  if (swall) Swal.fire("Error", `${errorData.status || 404} ${errorData.message || "Failed to fetch Gist"}`, "error");
  return handleGistApiError({
    status: errorData.status || response.status,
    message: errorData.message || "Failed to fetch Gist",
  });
};

export { handleGistApiError, handleGistMessage, handleGistErrorResponse };
