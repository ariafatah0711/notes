import GlobalSwal from "../utils/GlobalSwal";
import { isLoggedIn, getActiveAccount, getActiveAccountIndex, isWriteModeForUser } from "../utils/auth";
import { defaultAccounts } from "../config";
import { fetchGist, updateGist } from "../services/api";
import { handleGistMessage } from "./apiHandlers";

const Swal = GlobalSwal;

function canWrite() {
  const acc = getActiveAccount();
  if (!acc) return false;
  // Cari default account yang cocok dengan username
  const defaultAcc = defaultAccounts.find((a) => a.name === acc.name);
  if (!defaultAcc) return false;
  return acc.password === defaultAcc.password;
}

export const handleAddFile = async ({ currentGist, updateGist, navigate, reload }) => {
  if (!isLoggedIn()) return Swal.fire("Error", "Harus login dulu!", "error");
  if (!isWriteModeForUser(getActiveAccountIndex(), getActiveAccount().password))
    return Swal.fire("Error", "Aktifkan Write Mode dulu!", "error");
  if (!canWrite()) return Swal.fire("Error", "Password salah, tidak bisa write!", "error");

  const { value: fileName } = await Swal.fire({
    title: "Nama file baru:",
    input: "text",
    showCancelButton: true,
  });

  if (!fileName) return;
  if (currentGist.files[fileName]) {
    return Swal.fire("Error", `File dengan nama "${fileName}" sudah ada!`, "error");
  }

  try {
    // PATCH ke Gist API, payload: { files: { [fileName]: { content: "_" } } }
    const res = await updateGist(currentGist.id, { [fileName]: { content: "_" } });
    if (res?.message || res?.error) return handleGistMessage(res.message || res.error, "error");
    handleGistMessage(`File ${fileName} berhasil dibuat!`, "success");
    // Delay sebelum reload agar file baru muncul di Gist API (propagasi kadang lambat)
    setTimeout(() => reload(), 1500);
  } catch (error) {
    console.error("Error:", error);
    handleGistMessage(error.message || "Terjadi kesalahan saat menambahkan file.", "error");
  }
};

export const handleSave = async (content, { currentGist, currentFile, setFileContent, reload }) => {
  if (!isLoggedIn()) return Swal.fire("Error", "Harus login dulu!", "error");
  if (!isWriteModeForUser(getActiveAccountIndex(), getActiveAccount().password))
    return Swal.fire("Error", "Aktifkan Write Mode dulu!", "error");
  if (!canWrite()) return Swal.fire("Error", "Password salah, tidak bisa write!", "error");
  if (!content.trim()) return Swal.fire("Error", "Konten file tidak boleh kosong!", "error");
  try {
    // PATCH ke Gist API, payload: { files: { [currentFile]: { content } } }
    const res = await updateGist(currentGist.id, { [currentFile]: { content } });
    if (res?.message || res?.error) return handleGistMessage(res.message || res.error, "error");
    handleGistMessage(`File berhasil disimpan!`, "success");
    const gist = await fetchGist(currentGist.id);
    setFileContent(gist.files[currentFile]?.content || "");
    reload();
  } catch (error) {
    console.error("Error:", error);
    handleGistMessage(error.message || "Terjadi kesalahan saat menyimpan file.", "error");
  }
};

export const handleEdit = async (oldName, { id, navigate, reload }) => {
  if (!isLoggedIn()) return Swal.fire("Error", "Harus login dulu!", "error");
  if (!isWriteModeForUser(getActiveAccountIndex(), getActiveAccount().password))
    return Swal.fire("Error", "Aktifkan Write Mode dulu!", "error");
  if (!canWrite()) return Swal.fire("Error", "Password salah, tidak bisa write!", "error");
  const { value: newName } = await Swal.fire({
    title: "Edit nama file:",
    input: "text",
    inputValue: "",
    showCancelButton: true,
  });
  if (!newName || newName === oldName) return;
  try {
    const gist = await fetchGist(id);
    if (!gist.files[oldName]) throw new Error("File lama tidak ditemukan!");
    if (gist.files[newName]) throw new Error(`File dengan nama "${newName}" sudah ada. Gunakan nama lain.`);
    // PATCH ke Gist API: rename file = tambahkan file baru, hapus file lama
    const res = await updateGist(id, {
      [newName]: { content: gist.files[oldName].content },
      [oldName]: null,
    });
    if (res?.message || res?.error) return handleGistMessage(res.message || res.error, "error");
    navigate(`#${newName}`, { replace: true });
    reload();
  } catch (error) {
    console.error("Error:", error);
    handleGistMessage(error.message || "Terjadi kesalahan saat rename file.", "error");
  }
};

export const handleAddBatchFiles = async ({ currentGist, reload }) => {
  if (!isLoggedIn()) return Swal.fire("Error", "Harus login dulu!", "error");
  if (!isWriteModeForUser(getActiveAccountIndex(), getActiveAccount().password))
    return Swal.fire("Error", "Aktifkan Write Mode dulu!", "error");
  if (!canWrite()) return Swal.fire("Error", "Password salah, tidak bisa write!", "error");
  const { value: fileNames } = await Swal.fire({
    html: `<p class="text-lg text-gray-800 text-center font-semibold">Masukkan nama file <br> (pisahkan dengan koma atau spasi):</p>`,
    input: "text",
    showCancelButton: true,
  });
  if (!fileNames) return;
  const files = fileNames.split(/[\s,]+/);
  const existingFiles = Object.keys(currentGist.files);
  const newFiles = files.filter((fileName) => !existingFiles.includes(fileName));
  if (newFiles.length === 0) {
    return handleGistMessage(`Semua file sudah ada!`, "error");
  }
  try {
    const updates = {};
    newFiles.forEach((fileName) => {
      updates[fileName] = { content: "_" };
    });
    const res = await updateGist(currentGist.id, updates);
    if (res?.message || res?.error) return handleGistMessage(res.message || res.error, "error");
    handleGistMessage(`${newFiles.join(", ")} berhasil dibuat!`, "success");
    reload();
  } catch (error) {
    console.error("Error:", error);
    handleGistMessage("Terjadi kesalahan saat menambahkan file.", "error");
  }
};

export const handleDeleteFile = async ({ currentGist, currentFile, setCurrentFile, navigate, reload }) => {
  if (!isLoggedIn()) return Swal.fire("Error", "Harus login dulu!", "error");
  if (!isWriteModeForUser(getActiveAccountIndex(), getActiveAccount().password))
    return Swal.fire("Error", "Aktifkan Write Mode dulu!", "error");
  if (!canWrite()) return Swal.fire("Error", "Password salah, tidak bisa write!", "error");
  const result = await Swal.fire({
    title: "Hapus file?",
    text: "File ini akan dihapus secara permanen!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Hapus",
  });
  if (result.isConfirmed) {
    try {
      // PATCH ke Gist API, payload: { files: { [currentFile]: null } }
      const res = await updateGist(currentGist.id, { [currentFile]: null });
      if (res?.message || res?.error) return handleGistMessage(res.message || res.error, "error");
      handleGistMessage(`File ${currentFile} berhasil dihapus!`, "success");
      setCurrentFile("");
      navigate(".", { replace: true });
      reload();
    } catch (error) {
      console.error("Error:", error);
      handleGistMessage(error.message || "Terjadi kesalahan saat menghapus file.", "error");
    }
  }
};

export const handleSelectFile = (fileName, setSelectedFiles) => {
  setSelectedFiles((prevSelectedFiles) => {
    if (prevSelectedFiles.includes(fileName)) {
      return prevSelectedFiles.filter((file) => file !== fileName);
    }
    return [...prevSelectedFiles, fileName];
  });
};

export const handleDeleteSelectedFiles = async ({ selectedFiles, currentGist, setSelectedFiles, reload }) => {
  if (!isLoggedIn()) return Swal.fire("Error", "Harus login dulu!", "error");
  if (!isWriteModeForUser(getActiveAccountIndex(), getActiveAccount().password))
    return Swal.fire("Error", "Aktifkan Write Mode dulu!", "error");
  if (!canWrite()) return Swal.fire("Error", "Password salah, tidak bisa write!", "error");
  if (selectedFiles.length === 0) return Swal.fire("Error", "Harus pilih file dulu!", "error");
  const result = await Swal.fire({
    title: "Hapus file terpilih?",
    text: "File yang dipilih akan dihapus secara permanen!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Hapus",
  });
  if (result.isConfirmed) {
    try {
      const updates = {};
      selectedFiles.forEach((fileName) => (updates[fileName] = null));
      const res = await updateGist(currentGist.id, updates);
      if (res?.message || res?.error) return handleGistMessage(res.message || res.error, "error");
      setSelectedFiles([]);
      handleGistMessage(`File berhasil dihapus!`, "success");
      reload();
    } catch (error) {
      console.error("Error:", error);
      Swal.fire("Error", "Terjadi kesalahan saat menghapus file.", "error");
    }
  }
};
