import { correctPassword } from "../config";

export const login = (password) => {
  if (password === correctPassword) {
    const token = btoa(password);
    localStorage.setItem("token", token);
    return true;
  }
  return false;
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const isLoggedIn = () => {
  const token = localStorage.getItem("token");
  return token && atob(token) === correctPassword;
};
