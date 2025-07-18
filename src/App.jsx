import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import FolderPage from "./pages/FolderPage";
import NotFound from "./components/NotFound";

function App() {
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