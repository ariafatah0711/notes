import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import FolderPage from "./pages/FolderPage";
import NotFound from "./components/NotFound";
import { setActiveAccountByQuery } from "./utils/auth";
import React from "react";

function App() {
  React.useEffect(() => {
    // Panggil sekali saat mount
    setActiveAccountByQuery();
    // Panggil setiap kali URL berubah (query param berubah)
    const onUrlChange = () => setActiveAccountByQuery();
    window.addEventListener("popstate", onUrlChange);
    window.addEventListener("hashchange", onUrlChange);
    return () => {
      window.removeEventListener("popstate", onUrlChange);
      window.removeEventListener("hashchange", onUrlChange);
    };
  }, []);
  return (
    <Router>
      {/* <Navbar /> */}
      <Navbar />
      <div className="pt-15 sm:pt-15"> {/* Tambahkan padding di sini */}
        <Routes>
          {/* Tambahkan route default agar "/" diarahkan ke "/notes" */}
          {/* <Route path="/" element={<Navigate to="/notes" />} /> */}
          <Route path="/" element={<Home />} />
          <Route path=":folderName" element={<FolderPage />} />
          <Route path=":folderName/:fileName" element={<FolderPage />} />
          <Route path="*" element={<NotFound />} />
       </Routes>
      </div>
    </Router>
  );
}

export default App;