import { isLoggedIn } from "../utils/auth";
import { createGist, deleteGist, updateFolderGist } from "../services/api";
import GlobalSwal from "../utils/GlobalSwal";

const handleApiMessage = (message, swall = false) => {
  console.info(message);
  if (swall == "success") Swal.fire("Sukses", message, "success");
  if (swall == "error") Swal.fire("Sukses", message, "error");
};

const Swal = GlobalSwal;

export const handleAddGist = async (reload) => {
  if (!isLoggedIn()) return Swal.fire("Error", "Harus login dulu!", "error");

  const { value: folderName } = await Swal.fire({
    title: "Nama folder baru:",
    input: "text",
    showCancelButton: true,
  });

  if (!folderName) return;

  const res = await createGist(folderName);
  if (!res) return Swal.fire("Error", "Folder sudah ada", "error");

  reload();
};

export const handleEditGist = async (id, oldName, reload) => {
  if (!isLoggedIn()) return Swal.fire("Error", "Harus login dulu!", "error");

  const { value: newName } = await Swal.fire({
    title: "Edit nama folder:",
    input: "text",
    // inputValue: oldName,
    inputValue: "",
    showCancelButton: true,
  });

  if (!newName || newName === oldName) return;

  const res = await updateFolderGist(id, newName);
  if (res.ok == false) return Swal.fire("Error", "Folder sudah ada", "error");

  reload();
};

export const handleDeleteGist = async (id, reload) => {
  if (!isLoggedIn()) return Swal.fire("Error", "Harus login dulu!", "error");

  const result = await Swal.fire({
    title: "Hapus Folder?",
    text: "Folder ini akan dihapus secara permanen!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Hapus",
  });

  if (result.isConfirmed) {
    await deleteGist(id);
    handleApiMessage(`berhasil menghapus folder`, "success");
    reload();
  }
};
