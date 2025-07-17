import { useState, useEffect } from "react";
import { FiLogIn, FiLogOut, FiUser, FiMenu, FiSettings } from "react-icons/fi";
import IconButton from "./IconButton";
import { login, logout, isLoggedIn } from "../utils/auth";
import packageJson from "../../package.json";
import GlobalSwal from "../utils/GlobalSwal";
import { useNavigate } from "react-router-dom";

const Swal = GlobalSwal;

const Navbar = ({ links }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginInput, setLoginInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const correctPassword = import.meta.env.VITE_NOTES_PASSWORD;
  const navigate = useNavigate();

  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, []);

  const handleLogin = () => {
    setShowLogin(true);
    setLoginInput("");
    setLoginError("");
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (loginInput === correctPassword) {
      // Login pakai password, token default
      if (login(loginInput)) {
        setLoggedIn(true);
        setShowLogin(false);
        setLoginInput("");
        setLoginError("");
        Swal.fire("Berhasil!", "Login sukses!", "success");
        navigate("/");
      } else {
        setLoginError("Password salah!");
      }
    } else if (loginInput.length >= 30 && (loginInput.startsWith("ghp_") || loginInput.startsWith("github_pat_"))) {
      // Anggap input sebagai token custom jika valid
      localStorage.setItem("github_token", loginInput.trim());
      setShowLogin(false);
      setLoginInput("");
      setLoginError("");
      Swal.fire("Berhasil!", "Token custom disimpan!", "success").then(() => {
        navigate("/");
        window.location.reload();
      });
      // window.location.reload(); // Tidak perlu reload, biarkan React handle state
    } else {
      setLoginError("Password/token tidak valid!");
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Konfirmasi",
      text: "Yakin ingin logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        setLoggedIn(false);
        localStorage.removeItem("github_token");
        Swal.fire("Logout!", "Anda telah logout.", "success");
        window.location.reload();
      }
    });
  };

  // Cek status token
  const isCustomToken = !!localStorage.getItem("github_token");

  return (
  <nav className="fixed top-0 left-0 w-full bg-gray-100 shadow-md p-4 flex items-center justify-between z-50">
    <div>
      <a href="/" className="text-blue-500 hover:underline">
        <h3 className="text-lg font-semibold">{packageJson.name} v{packageJson.version}</h3>
      </a>
    </div>

    <div className="absolute left-1/2 transform -translate-x-1/2 gap-6 hidden md:flex">
      {links.map((link) => (
        <a key={link.path} href={link.path} className="text-gray-700 hover:text-blue-500">
          {link.name}
        </a>
      ))}
    </div>

    <div className="items-center gap-4 hidden md:flex">
      {/* Status Login (Tetap Ada agar Navbar Stabil) */}
      <div className="flex justify-center">
        {loggedIn || isCustomToken ? (
          <span className="text-green-500 flex items-center">
            <FiUser className="h-5 w-5 mr-2" />
            <span className="hidden sm:block">{isCustomToken ? "Custom Token" : "Logged In"}</span>
          </span>
        ) : (
          <span className="opacity-0">Placeholder</span>
        )}
      </div>

      <button 
        onClick={loggedIn || isCustomToken ? handleLogout : handleLogin} 
        className="flex items-center justify-center gap-2 py-2 px-4 text-white rounded-md transition duration-200"
        style={{ backgroundColor: loggedIn || isCustomToken ? 'red' : 'blue' }}
      >
        {(loggedIn || isCustomToken) ? <FiLogOut className="h-5 w-5" /> : <FiLogIn className="h-5 w-5" />}
        <span>{(loggedIn || isCustomToken) ? 'Logout' : 'Login'}</span>
      </button>
    </div>

      {/* Button Menu Mobile */}
      <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-gray-700 cursor-pointer">
        <FiMenu className="h-6 w-6" />
      </button>

      {/* Links Mobile */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md p-4 flex flex-col gap-4 md:hidden">
          {links.map((link) => (
            <a key={link.path} href={link.path} className="text-gray-700 hover:text-blue-500">
              {link.name}
            </a>
          ))}
          <hr />
          <div className="flex flex-col gap-2">
            {(loggedIn || isCustomToken) && (
              <span className="text-green-500 flex items-center">
                <FiUser className="h-5 w-5 mr-2" />
                {isCustomToken ? "Custom Token" : "Logged In"}
              </span>
            )}
            <button
              onClick={loggedIn || isCustomToken ? handleLogout : handleLogin}
              className={`flex items-center gap-2 py-2 px-4 text-white rounded-md transition duration-200 ${loggedIn || isCustomToken ? 'bg-red-500' : 'bg-blue-500'}`}
            >
              {(loggedIn || isCustomToken) ? <FiLogOut className="h-5 w-5" /> : <FiLogIn className="h-5 w-5" />}
              <span>{(loggedIn || isCustomToken) ? 'Logout' : 'Login'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Modal Login */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <form onSubmit={handleLoginSubmit} className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowLogin(false)}
              type="button"
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl"
              title="Tutup"
            >
              &times;
            </button>
            <h3 className="text-lg font-bold mb-4 text-blue-700 flex items-center gap-2">
              <FiLogIn /> Login
            </h3>
            <label className="block mb-2 text-sm font-medium text-gray-700">Password atau Token GitHub</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Masukkan password atau token..."
              value={loginInput}
              onChange={e => setLoginInput(e.target.value)}
              autoFocus
            />
            {loginError && <div className="text-red-500 text-xs mb-2">{loginError}</div>}
            <div className="flex gap-2 mb-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Login
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Masukkan password (akses default) atau token GitHub (akses Gist sendiri).<br />
              Token hanya disimpan di browser kamu.<br />
              <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Buat token di sini</a> (beri scope <b>gist</b>).
            </p>
          </form>
        </div>
      )}
    </nav>
  );
};

export default Navbar;