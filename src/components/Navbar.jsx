import { useState, useEffect } from "react";
import { FiUser, FiMenu, FiChevronDown, FiUnlock, FiLock } from "react-icons/fi";
import IconButton from "./IconButton";
import {
  getAllAccounts,
  getActiveAccount,
  setActiveAccount,
  setWriteModeForUser,
  clearWriteModeForUser,
  isWriteModeForUser,
  getActiveAccountIndex,
} from "../utils/auth";
import packageJson from "../../package.json";
import GlobalSwal from "../utils/GlobalSwal";
import { useNavigate } from "react-router-dom";

const Swal = GlobalSwal;

const WRITE_MODE_KEY = "write_mode";

const Navbar = ({ links }) => {
  const [accounts, setAccounts] = useState([]);
  const [activeAccount, setActiveAccountState] = useState(null);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [writePassword, setWritePassword] = useState("");
  const [writeError, setWriteError] = useState("");
  const [writeMode, setWriteModeState] = useState(false);
  const navigate = useNavigate();

  // Load accounts, active account, and write mode
  useEffect(() => {
    setAccounts(getAllAccounts());
    setActiveAccountState(getActiveAccount());
    // Cek write mode per user
    const acc = getActiveAccount();
    const idx = getActiveAccountIndex();
    setWriteModeState(
      acc && isWriteModeForUser(idx, acc.password)
    );
  }, []);

  // Refresh accounts and active account
  const refreshAccounts = () => {
    setAccounts(getAllAccounts());
    setActiveAccountState(getActiveAccount());
  };

  // Switch akun aktif
  const handleSwitchAccount = (idx) => {
    setActiveAccount(idx);
    const acc = getAllAccounts()[idx];
    setWriteModeState(acc && isWriteModeForUser(idx, acc.password));
    refreshAccounts();
    window.location.reload();
  };

  // Unlock write mode
  const handleUnlockWrite = (e) => {
    e.preventDefault();
    if (!activeAccount) return;
    const idx = getActiveAccountIndex();
    if (writePassword === activeAccount.password) {
      setWriteModeForUser(idx, writePassword); // simpan hash password per user
      setWriteModeState(true);
      setShowWriteModal(false);
      setWritePassword("");
      setWriteError("");
      Swal.fire("Write Mode Aktif", "Sekarang kamu bisa menulis/mengedit file.", "success");
    } else {
      setWriteError("Password salah!");
    }
  };

  // Lock write mode
  const handleLockWrite = () => {
    const idx = getActiveAccountIndex();
    clearWriteModeForUser(idx);
    setWriteModeState(false);
    Swal.fire("Write Mode Dimatikan", "Sekarang hanya bisa read-only.", "info");
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur shadow z-50 border-b border-gray-200">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-2">
        {/* Judul */}
        <div className="flex items-center gap-2">
          <a href="https://ariaf.my.id" className="font-bold text-blue-700 text-lg hover:underline hover:text-blue-900 transition">
            {packageJson.name}
          </a>
          <span className="ml-2 text-xs text-gray-400">v{packageJson.version}</span>
        </div>
        {/* Link Navigasi */}
        <div className="hidden md:flex gap-6">
          {links.map(link => {
            let url = link.path;
            let isExternal = false;
            if (url.startsWith("http://") || url.startsWith("https://")) {
              isExternal = true;
            } else if (/^[\w.-]+\.[a-zA-Z]{2,}/.test(url)) {
              url = "https://" + url;
              isExternal = true;
            }
            return (
              <a
                key={link.path}
                href={url}
                className="text-gray-700 hover:text-blue-600 font-medium transition"
                {...(isExternal ? { rel: "noopener noreferrer" } : {})}
              >
                {link.name}
              </a>
            );
          })}
        </div>
        {/* Status & Tombol */}
        <div className="flex items-center gap-3">
          {/* Dropdown akun */}
          <div className="hidden md:flex items-center gap-3 relative">
            {activeAccount && (
              <button
                className="flex items-center gap-2 px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs border border-gray-300"
                onClick={() => setShowAccountDropdown(v => !v)}
              >
                <FiUser />
                {activeAccount.name || "Akun"}
                <FiChevronDown />
              </button>
            )}
            {showAccountDropdown && (
              <div className="absolute right-0 top-10 bg-white border border-gray-200 shadow-lg rounded w-56 z-50">
                <div className="max-h-60 overflow-y-auto divide-y divide-gray-100">
                  {accounts.map((acc, idx) => (
                    <div key={idx} className="flex items-center justify-between px-4 py-2 hover:bg-blue-50 cursor-pointer"
                      onClick={() => handleSwitchAccount(idx)}>
                      <div className="flex items-center gap-2">
                        {activeAccount.name === acc.name && activeAccount.type === acc.type ? <span className="text-green-500">●</span> : <span className="text-gray-300">○</span>}
                        <span className="font-medium text-sm">{acc.name}</span>
                        <span className="text-xs text-gray-400">{acc.type === "api" ? "Default" : "Custom"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Tombol Write Mode/Lock */}
            {activeAccount && activeAccount.type === "api" && (
              writeMode ? (
                <button
                  onClick={handleLockWrite}
                  className="flex items-center gap-2 px-3 py-1 rounded bg-green-100 hover:bg-green-200 text-green-700 font-semibold text-xs border border-green-300 ml-2"
                  title="Kunci kembali ke read-only"
                >
                  <FiUnlock /> Write Mode
                </button>
              ) : (
                <button
                  onClick={() => { setShowWriteModal(true); setWritePassword(""); setWriteError(""); }}
                  className="flex items-center gap-2 px-3 py-1 rounded bg-red-100 hover:bg-red-200 text-red-700 font-semibold text-xs border border-red-300 ml-2"
                  title="Aktifkan Write Mode"
                >
                  <FiLock /> Read Only
                </button>
              )
            )}
          </div>
          {/* Hamburger menu for mobile */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-gray-700 ml-2">
            <FiMenu className="h-6 w-6" />
          </button>
        </div>
      </div>
      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow border-t border-gray-200 px-4 py-2">
          {links.map(link => {
            let url = link.path;
            let isExternal = false;
            if (url.startsWith("http://") || url.startsWith("https://")) {
              isExternal = true;
            } else if (/^[\w.-]+\.[a-zA-Z]{2,}/.test(url)) {
              url = "https://" + url;
              isExternal = true;
            }
            return (
              <a
                key={link.path}
                href={url}
                className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
                {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {link.name}
              </a>
            );
          })}
        </div>
      )}
      {/* Modal Write Mode */}
      {showWriteModal && (
        <form onSubmit={handleUnlockWrite} className="fixed top-20 right-6 z-50 bg-white rounded-lg shadow-lg p-6 max-w-xs w-full border border-gray-200 animate-slide-in">
          <button
            onClick={() => setShowWriteModal(false)}
            type="button"
            className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl"
            title="Tutup"
          >
            &times;
          </button>
          <h3 className="text-lg font-bold mb-4 text-blue-700 flex items-center gap-2">
            <FiUnlock /> Masukkan Password
          </h3>
          <label className="block mb-2 text-sm font-medium text-gray-700">Password akun <b>{activeAccount?.name}</b></label>
          <input
            type="password"
            className="w-full border border-gray-300 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Password akun..."
            value={writePassword}
            onChange={e => setWritePassword(e.target.value)}
            autoFocus
          />
          {writeError && <div className="text-red-500 text-xs mb-2">{writeError}</div>}
          <div className="flex gap-2 mb-2">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
            >
              Unlock Write
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Masukkan password akun untuk mengaktifkan mode tulis (write mode).<br />
            Setelah aktif, kamu bisa menambah/mengedit file.<br />
            Jangan lupa lock kembali jika sudah selesai.
          </p>
        </form>
      )}
    </nav>
  );
};

export default Navbar;