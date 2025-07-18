import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import FolderPage from "./pages/FolderPage";
import NotFound from "./components/NotFound";

function App() {
  const links = [
    { name: "github", path: "https://github.com/ariafatah0711/notes" },
    { name: "Info", path: "ariaf.my.id/blog/notes" },
  ];

  return (
    <Router>
      {/* <Navbar /> */}
      <Navbar links={links} />
      <div className="pt-20 sm:pt-20"> {/* Tambahkan padding di sini */}
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