import GlobalSwal from "../utils/GlobalSwal";
import { isLoggedIn } from "../utils/auth";
import { fetchGist, updateGist } from "../services/api";

const Swal = GlobalSwal;

export const handleAddFile = async ({ currentGist, updateGist, navigate, reload }) => {
  if (!isLoggedIn()) return Swal.fire("Error", "Harus login dulu!", "error");

  const { value: fileName } = await Swal.fire({
    title: "Nama file baru:",
    input: "text",
    showCancelButton: true,
  });

  if (!fileName) return;
  if (currentGist.files[fileName]) {
    return Swal.fire("Error", `File dengan nama "${fileName}" sudah ada!`, "error");
  }

  await updateGist(currentGist.id, { [fileName]: { content: "_" } });
  Swal.fire("Sukses", `File ${fileName} berhasil dibuat!`, "success");
  // navigate(`#${encodeURIComponent(fileName)}`, { replace: true });
  reload();
};

export const handleSave = async (content, { currentGist, currentFile, setFileContent, reload }) => {
  if (!isLoggedIn()) return Swal.fire("Error", "Harus login dulu!", "error");

  if (!content.trim()) return Swal.fire("Error", "Konten file tidak boleh kosong!", "error");
  await updateGist(currentGist.id, { [currentFile]: { content } });
  Swal.fire("Sukses", "File berhasil disimpan!", "success");
  // navigate(`#${currentFile}`, { replace: true });

  const gist = await fetchGist(currentGist.id);
  setFileContent(gist.files[currentFile]?.content || "");
  reload();
};

export const handleEdit = async (oldName, { id, navigate, reload }) => {
  if (!isLoggedIn()) return Swal.fire("Error", "Harus login dulu!", "error");

  console.log(id, oldName);

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

    await updateGist(id, {
      [newName]: { content: gist.files[oldName].content },
      [oldName]: null,
    });

    navigate(`#${newName}`, { replace: true });
    reload();
  } catch (error) {
    console.error("Error:", error);
    Swal.fire("Error", error.message, "error");
  }
};

export const handleAddBatchFiles = async ({ currentGist, reload }) => {
  if (!isLoggedIn()) return Swal.fire("Error", "Harus login dulu!", "error");

  const { value: fileNames } = await Swal.fire({
    html: `
      <p class="text-lg text-gray-800 text-center font-semibold">Masukkan nama file <br> (pisahkan dengan koma atau spasi):</p>
    `,
    input: "text",
    showCancelButton: true,
  });

  if (!fileNames) return;

  const files = fileNames.split(/[\s,]+/);

  const existingFiles = Object.keys(currentGist.files);
  const newFiles = files.filter((fileName) => !existingFiles.includes(fileName));

  if (newFiles.length === 0) {
    return Swal.fire("Error", "Semua file sudah ada!", "error");
  }

  try {
    const updates = {};
    newFiles.forEach((fileName) => {
      updates[fileName] = { content: "_" };
    });
    await updateGist(currentGist.id, updates);
    Swal.fire("Sukses", `${newFiles.join(", ")} berhasil dibuat!`, "success");
    reload();
  } catch (error) {
    console.error("Error:", error);
    Swal.fire("Error", "Terjadi kesalahan saat menambahkan file.", "error");
  }
};

export const handleDeleteFile = async ({ currentGist, currentFile, setCurrentFile, navigate, reload }) => {
  if (!isLoggedIn()) return Swal.fire("Error", "Harus login dulu!", "error");
  const result = await Swal.fire({
    title: "Hapus file?",
    text: "File ini akan dihapus secara permanen!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Hapus",
  });
  if (result.isConfirmed) {
    await updateGist(currentGist.id, { [currentFile]: null });
    setCurrentFile("");
    navigate(".", { replace: true });
    reload();
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
  if (!localStorage.getItem("token")) return Swal.fire("Error", "Harus login dulu!", "error");
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
      await updateGist(currentGist.id, updates);
      setSelectedFiles([]);
      Swal.fire("Sukses", "File berhasil dihapus!", "success");
      reload();
    } catch (error) {
      console.error("Error:", error);
      Swal.fire("Error", "Terjadi kesalahan saat menghapus file.", "error");
    }
  }
};
