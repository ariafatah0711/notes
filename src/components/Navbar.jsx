import { useState, useEffect } from "react";
import { FiLogIn, FiLogOut, FiUser, FiMenu } from "react-icons/fi";
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
      localStorage.setItem("github_token", loginInput.trim());
      setShowLogin(false);
      setLoginInput("");
      setLoginError("");
      Swal.fire("Berhasil!", "Token custom disimpan!", "success").then(() => {
        navigate("/");
        window.location.reload();
      });
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

  const isCustomToken = !!localStorage.getItem("github_token");

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur shadow z-50 border-b border-gray-200">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-2"> 
        {/* Judul */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-blue-700 text-lg">{packageJson.name}</span>
          <span className="ml-2 text-xs text-gray-400">v{packageJson.version}</span>
        </div>
        {/* Link Navigasi */}
        <div className="hidden md:flex gap-6">
          {links.map(link => (
            <a key={link.path} href={link.path} className="text-gray-700 hover:text-blue-600 font-medium transition">{link.name}</a>
          ))}
        </div>
        {/* Status & Tombol */}
        <div className="flex items-center gap-3">
          {isCustomToken
            ? <span className="text-green-600 font-semibold text-xs bg-green-100 px-2 py-1 rounded">Custom Token</span>
            : loggedIn
              ? <span className="text-green-600 font-semibold text-xs bg-green-100 px-2 py-1 rounded">Logged In</span>
              : null
          }
          <button
            onClick={loggedIn || isCustomToken ? handleLogout : handleLogin}
            className={`flex items-center gap-2 px-4 py-2 rounded transition font-semibold ${loggedIn || isCustomToken ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
          >
            {loggedIn || isCustomToken ? <FiLogOut /> : <FiLogIn />}
            {loggedIn || isCustomToken ? 'Logout' : 'Login'}
          </button>
          {/* Hamburger menu for mobile */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-gray-700 ml-2">
            <FiMenu className="h-6 w-6" />
          </button>
        </div>
      </div>
      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow border-t border-gray-200 px-4 py-2">
          {links.map(link => (
            <a key={link.path} href={link.path} className="block py-2 text-gray-700 hover:text-blue-600 font-medium">{link.name}</a>
          ))}
          <button
            onClick={loggedIn || isCustomToken ? handleLogout : handleLogin}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2 mt-2 rounded transition font-semibold ${loggedIn || isCustomToken ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
          >
            {loggedIn || isCustomToken ? <FiLogOut /> : <FiLogIn />}
            {loggedIn || isCustomToken ? 'Logout' : 'Login'}
          </button>
        </div>
      )}
      {/* Modal Login */}
      {showLogin && (
        <>
          <form onSubmit={handleLoginSubmit} className="fixed top-20 right-6 z-50 bg-white rounded-lg shadow-lg p-6 max-w-xs w-full border border-gray-200 animate-slide-in">
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
        </>
      )}
    </nav>
  );
};

export default Navbar;