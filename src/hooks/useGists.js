import { useState, useEffect } from "react";
import { fetchGists } from "../services/api";

export const useGists = () => {
  const [gists, setGists] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadGists = async () => {
    setLoading(true);
    const data = await fetchGists();
    // Parse folderName dari description dan filter hanya yang punya folderName
    const parsed = (Array.isArray(data) ? data : [])
      .map((gist) => {
        let folderName = null;
        try {
          folderName = JSON.parse(gist.description)?.folderName || null;
        } catch {}
        return { ...gist, folderName };
      })
      .filter((gist) => gist.folderName);
    setGists(parsed);
    setLoading(false);
  };

  useEffect(() => {
    loadGists();
  }, []);

  return { gists, loading, reload: loadGists };
};
