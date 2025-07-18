import { defaultAccounts } from "../config";

// Key untuk localStorage
const CUSTOM_ACCOUNTS_KEY = "github_tokens";
const ACTIVE_ACCOUNT_KEY = "github_token_active";
const WRITE_MODE_KEY = "write_mode";

// Ambil semua akun custom dari localStorage
export const getCustomAccounts = () => {
  try {
    return JSON.parse(localStorage.getItem(CUSTOM_ACCOUNTS_KEY)) || [];
  } catch {
    return [];
  }
};

// Simpan custom accounts ke localStorage
export const setCustomAccounts = (accounts) => {
  localStorage.setItem(CUSTOM_ACCOUNTS_KEY, JSON.stringify(accounts));
};

// Tambah custom account
export const addCustomAccount = (account) => {
  const accounts = getCustomAccounts();
  accounts.push(account);
  setCustomAccounts(accounts);
};

// Hapus custom account by index
export const removeCustomAccount = (index) => {
  const accounts = getCustomAccounts();
  accounts.splice(index, 1);
  setCustomAccounts(accounts);
};

// Tambah custom user (username+password, bukan token)
export const addCustomUser = (user) => {
  // user: { name, password, type: 'local' }
  const accounts = getCustomAccounts();
  accounts.push({ ...user, type: "local" });
  setCustomAccounts(accounts);
};

// Gabungkan semua akun (default + custom)
export const getAllAccounts = () => {
  return [
    ...defaultAccounts.map((acc) => ({ ...acc, source: "default" })),
    ...getCustomAccounts().map((acc) => ({ ...acc, source: "custom" })),
  ];
};

// Set akun aktif (index di getAllAccounts)
export const setActiveAccount = (index) => {
  localStorage.setItem(ACTIVE_ACCOUNT_KEY, index);
};

// Ambil index akun aktif
export const getActiveAccountIndex = () => {
  const idx = localStorage.getItem(ACTIVE_ACCOUNT_KEY);
  return idx !== null ? parseInt(idx, 10) : 0; // default ke 0
};

// Ambil akun aktif
export const getActiveAccount = () => {
  const all = getAllAccounts();
  const idx = getActiveAccountIndex();
  return all[idx] || all[0];
};

// Login: cek password ke defaultAccounts (bisa by password saja atau username+password), atau token ke custom
export const login = (input, username = null) => {
  // Cek ke defaultAccounts
  let idx = -1;
  if (username) {
    idx = defaultAccounts.findIndex((acc) => acc.name === username && acc.password === input);
  } else {
    idx = defaultAccounts.findIndex((acc) => acc.password === input);
  }
  if (idx !== -1) {
    setActiveAccount(idx);
    return { success: true, type: "default", idx };
  }
  // Cek ke custom token (harus format token github)
  if (input.length >= 30 && (input.startsWith("ghp_") || input.startsWith("github_pat_"))) {
    addCustomAccount({ name: `local${Date.now()}`, token: input.trim(), type: "github" });
    setActiveAccount(getAllAccounts().length - 1);
    return { success: true, type: "custom", idx: getAllAccounts().length - 1 };
  }
  return { success: false };
};

export const isLoggedIn = () => {
  return !!getActiveAccount();
};

export const logout = () => {
  // Hapus akun aktif (jika custom, hapus dari list)
  const idx = getActiveAccountIndex();
  const all = getAllAccounts();
  if (all[idx]?.source === "custom") {
    // Hitung index custom relatif (default duluan)
    const customIdx = idx - defaultAccounts.length;
    removeCustomAccount(customIdx);
  }
  // Reset ke akun default pertama
  setActiveAccount(0);
};

// Cek apakah write mode aktif (hash password)
export const setWriteMode = (password) => {
  // Hash sederhana (bisa diganti SHA256 jika mau lebih aman)
  const hash = btoa(unescape(encodeURIComponent(password)));
  localStorage.setItem("write_mode", hash);
};

export const clearWriteMode = () => {
  localStorage.removeItem("write_mode");
};

export const isWriteMode = (password) => {
  const hash = localStorage.getItem("write_mode");
  if (!hash) return false;
  return hash === btoa(unescape(encodeURIComponent(password)));
};

// Ambil object write mode dari localStorage
export const getWriteModeObj = () => {
  try {
    return JSON.parse(localStorage.getItem(WRITE_MODE_KEY)) || {};
  } catch {
    return {};
  }
};

export const setWriteModeForUser = (idx, password) => {
  const obj = getWriteModeObj();
  obj[idx] = btoa(unescape(encodeURIComponent(password)));
  localStorage.setItem(WRITE_MODE_KEY, JSON.stringify(obj));
};

export const clearWriteModeForUser = (idx) => {
  const obj = getWriteModeObj();
  obj[idx] = false;
  localStorage.setItem(WRITE_MODE_KEY, JSON.stringify(obj));
};

// Ubah isWriteModeForUser agar jika akun type 'local', selalu true
export const isWriteModeForUser = (idx, password) => {
  const obj = getWriteModeObj();
  const all = getAllAccounts();
  const acc = all[idx];
  if (acc?.type === "local") return true;
  if (!obj[idx]) return false;
  return obj[idx] === btoa(unescape(encodeURIComponent(password)));
};
