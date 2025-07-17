import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useGists } from "./useGists";

export function useFileContext() {
  const { folderName } = useParams();
  const { gists, loading, reload } = useGists();
  const navigate = useNavigate();
  const location = useLocation();

  const [currentGist, setCurrentGist] = useState(null);
  const [currentFile, setCurrentFile] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);

  useEffect(() => {
    if (!Array.isArray(gists)) return;

    // Cari gist berdasarkan folderName hasil parsing
    const gist = gists.find((g) => g.folderName === folderName);
    setCurrentGist(gist || null);
    setFilteredFiles(Object.keys(gist?.files || {}));
  }, [gists, folderName]);

  return {
    gists,
    loading,
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
  };
}
