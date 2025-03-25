import { useState, useEffect } from "react";
import { fetchGists } from "../services/api";

export const useGists = () => {
  const [gists, setGists] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadGists = async () => {
    setLoading(true);
    const data = await fetchGists();
    setGists(data);
    setLoading(false);
  };

  useEffect(() => {
    loadGists();
  }, []);

  return { gists, loading, reload: loadGists };
};
