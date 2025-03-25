import { login, logout, isLoggedIn } from "../utils/auth";
import { useState, useEffect } from "react";
import { FiLogIn, FiLogOut, FiUser } from 'react-icons/fi';

import IconButton from "./IconButton";

import { versionApp } from "../config";
import GlobalSwal from "../utils/GlobalSwal";
const Swal = GlobalSwal;

function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, []);

  const handleLogin = async () => {
    const { value: password } = await Swal.fire({
      title: "Login",
      input: "password",
      inputPlaceholder: "Masukkan password",
      showCancelButton: true,
      confirmButtonText: "Login",
      cancelButtonText: "Batal",
      inputAttributes: {
        autocapitalize: "off",
      },
    });

    if (password) {
      if (login(password)) {
        Swal.fire("Berhasil!", "Login sukses!", "success");
        setLoggedIn(true);
      } else {
        Swal.fire("Gagal!", "Password salah!", "error");
      }
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Konfirmasi",
      text: "Yakin ingin logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Logout",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        setLoggedIn(false);
        Swal.fire("Logout!", "Anda telah logout.", "success");
      }
    });
  };

  return (
<nav className="p-4 bg-gray-100 flex justify-between items-center shadow-md">
  <a href="/" className="text-blue-500 hover:underline">
    <h3 className="text-lg font-semibold">notes_aria v{versionApp}</h3>
  </a>
  {loggedIn ? (
    <div className="flex items-center gap-4">
      {/* Status pengguna dengan ikon */}
      <span className="flex items-center text-sm text-green-500">
        <FiUser className="h-5 w-5 mr-2" />
        <span className="hidden sm:block">Logged In</span>
        <span className="sm:hidden">✅</span>
      </span>
      {/* Ikon Logout */}
      {/* <button onClick={handleLogout} className="flex items-center p-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer gap-2">
        <FiLogOut className="h-6 w-6" />
        <span className="hidden sm:block">logout</span>
      </button> */}

      <IconButton onClick={handleLogout} icon={FiLogOut} label="Logout" color="red"/>
    </div>
  ) : (
    // <button onClick={handleLogin} className="flex items-center p-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer gap-2">
    //   <FiLogIn className="h-6 w-6" />
    //   <span className="hidden sm:block">login </span>
    // </button>
    <IconButton onClick={handleLogin} icon={FiLogIn} label="Login" color="blue"/>
  )}
</nav>
  );
}

export default Navbar;
