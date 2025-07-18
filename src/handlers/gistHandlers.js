import { isLoggedIn, isWriteModeForUser, getActiveAccount, getActiveAccountIndex } from "../utils/auth";
import { createGist, deleteGist, fetchGists, updateFolderGist } from "../services/api";
import GlobalSwal from "../utils/GlobalSwal";

const Swal = GlobalSwal;

export const handleAddGist = async (reload) => {
  if (!isLoggedIn()) return Swal.fire("Error", "Harus login dulu!", "error");
  if (!isWriteModeForUser(getActiveAccountIndex(), getActiveAccount().password))
    return Swal.fire("Error", "Aktifkan Write Mode dulu!", "error");

  const { value: folderName } = await Swal.fire({
    title: "Nama folder baru:",
    input: "text",
    showCancelButton: true,
  });

  if (!folderName) return;

  // Cek duplikat folderName di frontend
  const gists = await fetchGists();
  const exists = (Array.isArray(gists) ? gists : []).some((gist) => {
    let name = null;
    try {
      name = JSON.parse(gist.description)?.folderName;
    } catch {}
    return name === folderName;
  });
  if (exists) return Swal.fire("Error", "Folder sudah ada", "error");

  const res = await createGist(folderName);
  if (res?.message || res?.error) return Swal.fire("Error", res.message || res.error, "error");

  reload();
};

export const handleEditGist = async (id, oldName, reload) => {
  if (!isLoggedIn()) return Swal.fire("Error", "Harus login dulu!", "error");
  if (!isWriteModeForUser(getActiveAccountIndex(), getActiveAccount().password))
    return Swal.fire("Error", "Aktifkan Write Mode dulu!", "error");

  const { value: newName } = await Swal.fire({
    title: "Edit nama folder:",
    input: "text",
    // inputValue: oldName,
    inputValue: "",
    showCancelButton: true,
  });

  if (!newName || newName === oldName) return;

  const folder = await fetchGists();
  const res = await updateFolderGist(id, newName);

  const folderExists = folder.some((item) => {
    const folderName = JSON.parse(item.description)?.folderName; // Ambil folderName dari deskripsi (dalam format JSON)
    return folderName === newName; // Cek jika folderName sudah ada yang sama dengan newName
  });

  console.log(folderExists);
  if (folderExists) {
    return Swal.fire("Error", "Folder dengan nama ini sudah ada", "error");
  }

  reload();
};

export const handleDeleteGist = async (id, reload) => {
  if (!isLoggedIn()) return Swal.fire("Error", "Harus login dulu!", "error");
  if (!isWriteModeForUser(getActiveAccountIndex(), getActiveAccount().password))
    return Swal.fire("Error", "Aktifkan Write Mode dulu!", "error");

  const result = await Swal.fire({
    title: "Hapus Folder?",
    text: "Folder ini akan dihapus secara permanen!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Hapus",
  });

  if (result.isConfirmed) {
    await deleteGist(id);
    reload();
  }
};
