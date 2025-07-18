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
  addCustomUser,
  removeCustomAccount,
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
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [addUserError, setAddUserError] = useState("");
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
  const [selectedDeleteUsers, setSelectedDeleteUsers] = useState([]);
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

  const handleAddCustomUser = (e) => {
    e.preventDefault();
    if (!newUserName || !newUserPassword) {
      setAddUserError("Username dan API wajib diisi!");
      return;
    }
    addCustomUser({ name: newUserName, api: newUserPassword, type: 'local' });
    setShowAddUserModal(false);
    setNewUserName("");
    setNewUserPassword("");
    setAddUserError("");
    refreshAccounts();
    setActiveAccount(getAllAccounts().length - 1);
    window.location.reload();
  };

  // Helper: ambil semua user lokal
  const localUsers = accounts.filter(acc => acc.type === 'local');

  // Handler hapus user lokal
  const handleDeleteSelectedUsers = async () => {
    if (selectedDeleteUsers.length === 0) return;
    const result = await Swal.fire({
      title: `Yakin ingin menghapus ${selectedDeleteUsers.length} user lokal?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Hapus',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#aaa',
    });
    if (!result.isConfirmed) return;
    // Hapus dari localStorage (index relatif ke custom/local)
    const customAccounts = getAllAccounts().filter(acc => acc.type === 'local');
    selectedDeleteUsers.forEach(name => {
      const idx = customAccounts.findIndex(acc => acc.name === name);
      if (idx !== -1) removeCustomAccount(idx);
    });
    setShowDeleteUserModal(false);
    setSelectedDeleteUsers([]);
    refreshAccounts();
    setActiveAccount(0); // fallback ke default
    window.location.reload();
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
        {/* <div className="hidden md:flex gap-6"> */}
        {/* </div> */}
        {/* Status & Tombol */}
        <div className="flex items-center gap-3">
          {/* Tombol Write Mode/Lock di kiri (desktop) */}
          {activeAccount && activeAccount.type === "api" && (
            writeMode ? (
              <button
                onClick={handleLockWrite}
                className="w-28 flex items-center gap-2 px-3 py-1 rounded bg-green-100 hover:bg-green-200 text-green-700 font-semibold text-xs border border-green-300"
                title="Kunci kembali ke read-only"
              >
                <FiUnlock /> Write Mode
              </button>
            ) : (
              <button
                onClick={() => { setShowWriteModal(true); setShowAddUserModal(false); setWritePassword(""); setWriteError(""); }}
                className="w-28 flex items-center gap-2 px-3 py-1 rounded bg-red-100 hover:bg-red-200 text-red-700 font-semibold text-xs border border-red-300"
                title="Aktifkan Write Mode"
              >
                <FiLock /> Read Only
              </button>
            )
          )}
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
                        <span className="text-xs text-gray-400">{acc.type === "api" ? "Default" : acc.type === "local" ? "Lokal" : "Custom"}</span>
                      </div>
                    </div>
                  ))}
                  {/* Tombol tambah user lokal di bawah list akun (dropdown) */}
                  <div className="px-4 py-2 flex flex-col gap-2">
                    <button
                      className="w-full px-2 py-1 rounded bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs border border-blue-300"
                      onClick={() => { setShowAddUserModal(true); setShowWriteModal(false); }}
                      title="Tambah User Lokal"
                    >
                      + User Lokal
                    </button>
                    {localUsers.length > 0 && (
                      <button
                        className="w-full px-2 py-1 rounded bg-red-100 hover:bg-red-200 text-red-700 text-xs border border-red-300"
                        onClick={() => { setShowDeleteUserModal(true); setShowAddUserModal(false); setShowWriteModal(false); }}
                        title="Hapus User Lokal"
                      >
                        Hapus User Lokal
                      </button>
                    )}
                  </div>
                </div>
              </div>
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
        <div className="md:hidden bg-white shadow border-t border-gray-200 px-4 py-8 flex flex-col gap-6">
          {/* Section: List akun untuk switch */}
          <div className="flex flex-col gap-1 mb-2">
            {accounts.length > 1 && accounts.map((acc, idx) => (
              <button
                key={idx}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm border transition font-medium shadow-sm ${activeAccount.name === acc.name && activeAccount.type === acc.type ? "bg-blue-100 text-blue-700 border-blue-300" : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-blue-50"}`}
                onClick={() => handleSwitchAccount(idx)}
              >
                {activeAccount.name === acc.name && activeAccount.type === acc.type ? <span className="text-green-500">●</span> : <span className="text-gray-300">○</span>}
                <span className="font-medium">{acc.name}</span>
                <span className="text-xs text-gray-400">{acc.type === "api" ? "Default" : acc.type === "local" ? "Lokal" : "Custom"}</span>
              </button>
            ))}
            {/* Tombol tambah user lokal di bawah list akun (mobile) */}
            <button
              className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold border border-blue-600 shadow transition"
              onClick={() => { setShowAddUserModal(true); setShowWriteModal(false); }}
              title="Tambah User Lokal"
            >
              <FiUser className="text-lg" /> + User Lokal
            </button>
            {localUsers.length > 0 && (
              <button
                className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 text-sm font-semibold border border-red-300 shadow transition"
                onClick={() => { setShowDeleteUserModal(true); setShowAddUserModal(false); setShowWriteModal(false); }}
                title="Hapus User Lokal"
              >
                <FiUser className="text-lg" /> Hapus User Lokal
              </button>
            )}
          </div>
        </div>
      )}
      {/* Modal Write Mode */}
      {showWriteModal && (
        <form
          onSubmit={handleUnlockWrite}
          className="fixed top-20 right-6 z-50 bg-white rounded-lg shadow-lg p-6 max-w-xs w-full border border-gray-200 animate-slide-in"
          onClick={e => e.stopPropagation()}
        >
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
      {/* Modal tambah user lokal: Username & API */}
      {showAddUserModal && (
        <form
          onSubmit={handleAddCustomUser}
          className="fixed top-20 right-6 z-50 bg-white rounded-lg shadow-lg p-6 max-w-xs w-full border border-gray-200 animate-slide-in"
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={() => setShowAddUserModal(false)}
            type="button"
            className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl"
            title="Tutup"
          >
            &times;
          </button>
          <h3 className="text-lg font-bold mb-4 text-blue-700 flex items-center gap-2">
            Tambah User Lokal
          </h3>
          <label className="block mb-2 text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Username..."
            value={newUserName}
            onChange={e => setNewUserName(e.target.value)}
            autoFocus
          />
          <label className="block mb-2 text-sm font-medium text-gray-700">API</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Personal Access Token..."
            value={newUserPassword}
            onChange={e => setNewUserPassword(e.target.value)}
          />
          {addUserError && <div className="text-red-500 text-xs mb-2">{addUserError}</div>}
          <div className="flex gap-2 mb-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Tambah
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            <b>API/Token harus dari GitHub</b> dengan scope <b>gist</b> saja.<br />
            <a href='https://github.com/settings/tokens/new?scopes=gist&description=notes-gist' target='_blank' rel='noopener noreferrer' className='text-blue-600 underline'>Buat token di sini</a>.<br />
            Jangan centang scope lain, cukup <b>gist</b>.<br />
            Token ini hanya untuk akses Gist, tidak bisa edit repo utama kamu.
          </p>
        </form>
      )}
      {/* Modal hapus user lokal */}
      {showDeleteUserModal && (
        <form
          className="fixed top-20 right-6 z-50 bg-white rounded-lg shadow-lg p-6 max-w-xs w-full border border-gray-200 animate-slide-in"
          onClick={e => e.stopPropagation()}
          onSubmit={e => { e.preventDefault(); handleDeleteSelectedUsers(); }}
        >
          <button
            onClick={() => setShowDeleteUserModal(false)}
            type="button"
            className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl"
            title="Tutup"
          >
            &times;
          </button>
          <h3 className="text-lg font-bold mb-4 text-red-700 flex items-center gap-2">
            <FiUser /> Hapus User Lokal
          </h3>
          {localUsers.length === 0 ? (
            <div className="text-gray-500 text-sm mb-2">Tidak ada user lokal.</div>
          ) : (
            <div className="flex flex-col gap-2 mb-4 max-h-40 overflow-y-auto">
              {localUsers.map((acc, idx) => (
                <label key={acc.name} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedDeleteUsers.includes(acc.name)}
                    onChange={e => {
                      if (e.target.checked) setSelectedDeleteUsers([...selectedDeleteUsers, acc.name]);
                      else setSelectedDeleteUsers(selectedDeleteUsers.filter(n => n !== acc.name));
                    }}
                  />
                  <span className="font-medium text-blue-700">{acc.name}</span>
                </label>
              ))}
            </div>
          )}
          <button
            type="submit"
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors disabled:opacity-50"
            disabled={selectedDeleteUsers.length === 0}
          >
            Hapus
          </button>
        </form>
      )}
    </nav>
  );
};

export default Navbar;