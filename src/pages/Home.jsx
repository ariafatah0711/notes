/* react */
import { AiFillFolderAdd } from "react-icons/ai";
import { useFileContext } from "../hooks/useFileContext";
import { useEffect } from "react";

/* component */
import FolderList from "../components/FolderList";
import IconButton from "../components/IconButton";
import Breadcrumb from "../components/Breadcrumb";

/* handlers */
import { handleAddGist, handleEditGist, handleDeleteGist } from "../handlers/gistHandlers";

export default function Home() {
  const {
    gists,
    loading,
    navigate,
    reload
  } = useFileContext();

  // console.log(gists)

  useEffect(() => {
    const handleKeyDown = (e) => e.key === "n" && (e.preventDefault(), handleAddGist(reload));
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [reload]);

  return (
    <div className="main-content max-w-5xl mx-auto px-4">
      <Breadcrumb navigate={navigate} />
      <div className="flex flex-wrap gap-4 justify-left pb-4">
        <IconButton onClick={() => handleAddGist(reload)} icon={AiFillFolderAdd} label="Tambah Folder" color="blue" size="md" />
      </div>

      {gists?.ok == false ? (
        <div className="flex flex-col m-2">
          <p className="text-gray-500">{gists.status} {gists.message}</p>
        </div>
      ) : (
        <FolderList
          gists={gists}
          loading={loading}
          navigate={navigate}
          handleEditGist={(id, name) => handleEditGist(id, name, reload)}
          handleDeleteGist={(id) => handleDeleteGist(id, reload)}
        />
      )}
    </div>
  );
}