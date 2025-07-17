import { correctPassword } from "../config";

export const login = (password) => {
  if (password === correctPassword) {
    const token = btoa(password);
    localStorage.setItem("token", token);
    return true;
  }
  return false;
};

export const isLoggedIn = () => {
  // Anggap login jika ada token custom ATAU sudah login password
  return !!localStorage.getItem("github_token") || !!localStorage.getItem("token");
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("github_token");
};
