/* react */
import { AiFillFolderAdd } from "react-icons/ai";
import { useFileContext } from "../hooks/useFileContext";

/* component */
import FolderList from "../components/FolderList";
import IconButton from "../components/IconButton";

/* handlers */
import { handleAddGist, handleEditGist, handleDeleteGist } from "../handlers/gistHandlers";

export default function Home() {
    const {
      gists,
      loading,
      reload
    } = useFileContext();

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">
        <a href={import.meta.env.BASE_URL} className="text-blue-500 hover:underline">Folder List</a>
      </h2>
      <div className="flex flex-wrap gap-4 justify-left">
        <IconButton onClick={() => handleAddGist(reload)} icon={AiFillFolderAdd} label="Tambah Folder" color="blue" />
      </div>

      <FolderList 
        gists={gists} 
        loading={loading} 
        handleEditGist={(id, name) => handleEditGist(id, name, reload)} 
        handleDeleteGist={(id) => handleDeleteGist(id, reload)} 
      />
    </div>
  );
}