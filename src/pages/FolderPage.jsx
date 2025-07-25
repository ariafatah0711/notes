/* react */
import { useEffect, useCallback, useRef } from "react";
import { AiOutlineFileText, AiOutlineAppstoreAdd, AiOutlineDelete, AiOutlineHome, AiOutlineRight } from "react-icons/ai";
import { useFileContext } from "../hooks/useFileContext";
import { fetchGist, updateGist } from "../services/api";

/* component */
import FileList from "../components/FileList";
import SearchBar from "../components/SearchBar";
import Editor from "../components/Editor";
import IconButton from "../components/IconButton";
import Breadcrumb from "../components/Breadcrumb";

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
import { getActiveAccountIndex, getActiveAccount, isWriteModeForUser } from "../utils/auth";

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

  // console.log(currentGist?.files || {})
  // console.log(filteredFiles)

  useEffect(() => {
    if (currentGist) {
      setFilteredFiles(Object.keys(currentGist.files || {}));
    }
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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;
  
      if (
        (e.ctrlKey && e.code === "KeyR") ||
        e.code === "F5" ||
        (e.ctrlKey && e.shiftKey && e.code === "KeyR")
      ) {
        return;
      }
  
      const actions = {
        KeyN: () => currentGist && handleAddFile({ currentGist, updateGist, navigate }),
        KeyB: () => currentGist && handleAddBatchFiles({ currentGist }),
        KeyD: () => currentGist && selectedFiles.length && handleDeleteSelectedFiles({ selectedFiles, currentGist, setSelectedFiles }),
      };
  
      if (actions[e.code]) {
        e.preventDefault();
        e.stopPropagation();
        actions[e.code]();
      }
    };
  
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentGist, updateGist, navigate, selectedFiles, setSelectedFiles, handleAddFile, handleAddBatchFiles, handleDeleteSelectedFiles]);

  const handleLoadFile = useCallback(async (fileName) => {
    if (fileName === currentFile) return;
    const gist = await fetchGist(currentGist.id);
    console.log(currentGist.id)
    console.log(gist)
    console.log(gist.files)
    console.log(fileName)

    if (!gist.files) {
      console.error(`File "${fileName}" not found in Gist.`);
      return;
    }

    setCurrentFile(fileName);
    setFileContent(gist.files[fileName]?.content || "");
    navigate(`#${encodeURIComponent(fileName)}`, { replace: true });
  }, [currentFile, currentGist, navigate]);

  return (
    <div className="main-content max-w-5xl mx-auto px-4">
      <Breadcrumb folderName={folderName} currentFile={currentFile} navigate={navigate} />
      {/* Jika currentFile ada, tampilkan Editor, jika tidak tampilkan FileList dan tombol */}
      {currentFile && currentGist?.files?.[currentFile] ? (
        isWriteModeForUser(getActiveAccountIndex(), getActiveAccount()?.password) ? (
          <Editor
            folderName={folderName}
            gistId={currentGist.id}
            fileName={currentFile}
            content={fileContent}
            onSave={(content) => handleSave(content, { currentGist, currentFile, setFileContent, reload })}
            onPreview={(value) => handlePreview(value)}
            onClose={() => {
              setCurrentFile("");
              navigate(".", { replace: true });
            }}
            onEdit={(fileName) => handleEdit(fileName, { id: currentGist?.id, navigate, reload })}
            onDeleteFile={() => handleDeleteFile({ currentGist, currentFile, setCurrentFile, navigate, reload })}
          />
        ) : (
          <PreviewReadOnly
            folderName={folderName}
            currentFile={currentFile}
            fileContent={fileContent}
            onClose={() => { setCurrentFile(""); navigate(".", { replace: true }); }}
          />
        )
      ) : (
        <>
          <div className="flex flex-wrap gap-4 justify-left pb-4">
            {typeof SearchBar !== "undefined" && (
              <SearchBar
                placeholder="Cari file..."
                data={Object.keys(currentGist?.files || {})}
                onSearch={setFilteredFiles}
              />
            )}
            <IconButton
              onClick={() => handleAddFile({ currentGist, updateGist, navigate, reload })}
              icon={AiOutlineFileText}
              label="Tambah File"
              color="blue"
              size="md"
            />
            <IconButton
              onClick={() => handleAddBatchFiles({ currentGist, reload })}
              icon={AiOutlineAppstoreAdd}
              label="Batch File"
              color="green"
              size="md"
            />
            <IconButton
              onClick={() => handleDeleteSelectedFiles({ selectedFiles, currentGist, setSelectedFiles, reload })}
              icon={AiOutlineDelete}
              label="Hapus File"
              color="red"
              size="md"
            />
          </div>
          {currentGist ? (
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
          ) : (
            <p className="text-gray-500">
              {gists?.ok
                ? `${gists.status}, ${gists.error}`
                : 'Folder Tidak Ditemukan'}
              {' '}
              <a href={import.meta.env.BASE_URL} className="text-blue-500 hover:underline">Back...</a>
            </p>
          )}
        </>
      )}
    </div>
  );
}

function PreviewReadOnly({ folderName, currentFile, fileContent, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="w-full bg-white shadow-lg rounded-xl p-6 mt-6 flex flex-col gap-4 min-h-[70vh]">
      <div className="flex items-center justify-between border-b pb-2 mb-4">
        <div>
          <span className="font-bold text-lg text-blue-700">{folderName}/{currentFile}</span>
          <span className="ml-2 text-xs text-gray-400">({fileContent.length} chars)</span>
        </div>
        <button onClick={onClose} className="text-red-500 hover:text-red-700 text-2xl" title="Tutup">✖</button>
      </div>
      <pre className="w-full flex-1 min-h-[400px] max-h-[60vh] bg-gray-50 border border-gray-300 rounded-lg p-4 font-mono text-base whitespace-pre-wrap break-words overflow-x-auto overflow-y-auto" style={{resize: 'vertical'}}>{fileContent || "(File kosong)"}</pre>
      <div className="text-xs text-gray-400 mt-1 flex justify-between">
        <span>Characters: {fileContent.length}</span>
        <span>Hanya mode baca (aktifkan Write Mode untuk edit)</span>
      </div>
    </div>
  );
}