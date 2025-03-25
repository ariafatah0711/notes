/* react */
import { useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { AiOutlineFileText, AiOutlineAppstoreAdd, AiOutlineDelete } from "react-icons/ai";
import { useFileContext } from "../hooks/useFileContext";
import { fetchGist, updateGist } from "../services/api";

/* component */
import FileList from "../components/FileList";
import SearchBar from "../components/SearchBar";
import Editor from "../components/Editor";
import IconButton from "../components/IconButton";

/* handlers */
import { handlePreview } from "../handlers/previewHandlers";
import {
   handleDeleteFile,
   handleDeleteSelectedFiles,
   handleSelectFile,
   handleAddBatchFiles,
   handleAddFile,
   handleEdit,
   handleSave
} from "../handlers/fileActions";

export default function FolderPage() {
  const {
    gists,
    filteredFiles,
    currentGist,
    folderName,
    currentFile,
    fileContent,
    selectedFiles,
    location,
    setFilteredFiles,
    setCurrentGist,
    setCurrentFile,
    setFileContent,
    setSelectedFiles,
    navigate,
    reload,
  } = useFileContext();

  useEffect(() => {
    setFilteredFiles(Object.keys(currentGist?.files || {}));
  }, [currentGist]);

  useEffect(() => {
    if (gists?.length) {
      const foundGist = gists.find((g) => g.folderName === folderName);
      setCurrentGist(foundGist || null);
    }
  }, [gists, folderName]);

  useEffect(() => {
    if (currentGist && location.hash) {
      const fileName = decodeURIComponent(location.hash.substring(1));
      if (fileName && currentGist.files[fileName]) {
        handleLoadFile(fileName);
      } else {
        setCurrentFile("");
        setFileContent("");
      }
    }
  }, [currentGist, location.hash]);

  useEffect(() => {
    if (currentFile && currentGist && currentGist.files[currentFile]) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [currentFile, currentGist]);

  const handleLoadFile = useCallback(async (fileName) => {
    if (fileName === currentFile) return;
    const gist = await fetchGist(currentGist.id);
    setCurrentFile(fileName);
    setFileContent(gist.files[fileName]?.content || "");
    navigate(`#${encodeURIComponent(fileName)}`, { replace: true });
  }, [currentFile, currentGist, navigate]);

  return currentGist ? (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <a href={import.meta.env.BASE_URL}
          className="text-blue-500 font-medium hover:underline inline-block truncate overflow-hidden whitespace-nowrap">{folderName}
        </a>
      </h2>

      {currentFile && currentGist && currentGist.files[currentFile] ? (
        <div className="w-full fixed inset-0 bg-gray-500 bg-opacity-50 flex z-50">
          <div className="relative bg-white w-full p-4 shadow-lg">
            <Editor
              folderName={folderName}
              gistId={currentGist.id}
              fileName={currentFile}
              content={fileContent}
              onSave={(content) => handleSave(content, { currentGist, currentFile, setFileContent })}
              onPreview={(value) => handlePreview(value)}
              onClose={() => {
                setCurrentFile("");
                navigate(".", { replace: true });
              }}
              onEdit={(fileName) => {
                const id = currentGist?.id;
                handleEdit( fileName, {id, navigate, reload });
              }}
               onDeleteFile={() => handleDeleteFile({ currentGist, currentFile, setCurrentFile, navigate, reload })}
            />
          </div>
        </div>
      ) : (
        <span></span>
      )}

      <div className="flex flex-wrap gap-4 justify-left pb-4">
        <SearchBar
          placeholder="Cari file..."
          data={Object.keys(currentGist?.files || {})}
          onSearch={setFilteredFiles}
        />
        <IconButton onClick={() => handleAddFile({ currentGist, updateGist, navigate, reload })} icon={AiOutlineFileText} label="Tambah File" color="blue" />
        <IconButton onClick={() => handleAddBatchFiles({ currentGist, reload })} icon={AiOutlineAppstoreAdd} label="Batch File" color="green" />
        <IconButton onClick={() => handleDeleteSelectedFiles({ selectedFiles, currentGist, setSelectedFiles, reload })}
          icon={AiOutlineDelete} label="Hapus File" color="red" />
      </div>

      <FileList
        filteredFiles={filteredFiles}
        selectedFiles={selectedFiles}
        handleSelectFile={handleSelectFile}
        handleLoadFile={handleLoadFile}
        handlePreview={handlePreview}
        setSelectedFiles={setSelectedFiles}
        currentFile={currentFile}
        currentGist={currentGist}
      />

    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-64">
      <p className="text-lg text-gray-500">Folder tidak ditemukan...</p>
      <Link to="/" className="mt-2 text-blue-500 hover:underline">
        Kembali ke daftar folder
      </Link>
    </div>
  );
}
