// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";
// import Navbar from "./components/Navbar";
// import FolderPage from "./pages/FolderPage";

// function App() {
//   return (
//     <Router>
//       <Navbar />
//       <Routes>
//         <Route path="/notes" element={<Home />} />
//         <Route path="/notes/:folderName" element={<FolderPage />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import FolderPage from "./pages/FolderPage";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Tambahkan route default agar "/" diarahkan ke "/notes" */}
        {/* <Route path="/" element={<Navigate to="/notes" />} /> */}
        <Route path="/" element={<Home />} />
        <Route path="/:folderName" element={<FolderPage />} />
      </Routes>
    </Router>
  );
}

export default App;