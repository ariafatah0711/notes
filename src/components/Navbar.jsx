// import { login, logout, isLoggedIn } from "../utils/auth";
// import { useState, useEffect } from "react";
// import { FiLogIn, FiLogOut, FiUser } from 'react-icons/fi';

// import IconButton from "./IconButton";

// import packageJson from "../../package.json"
// import GlobalSwal from "../utils/GlobalSwal";
// const Swal = GlobalSwal;

// function Navbar() {
//   const [loggedIn, setLoggedIn] = useState(false);

//   useEffect(() => {
//     setLoggedIn(isLoggedIn());
//   }, []);

//   const handleLogin = async () => {
//     const { value: password } = await Swal.fire({
//       title: "Login",
//       input: "password",
//       inputPlaceholder: "Masukkan password",
//       showCancelButton: true,
//       confirmButtonText: "Login",
//       cancelButtonText: "Batal",
//       inputAttributes: {
//         autocapitalize: "off",
//       },
//     });

//     if (password) {
//       if (login(password)) {
//         Swal.fire("Berhasil!", "Login sukses!", "success");
//         setLoggedIn(true);
//       } else {
//         Swal.fire("Gagal!", "Password salah!", "error");
//       }
//     }
//   };

//   const handleLogout = () => {
//     Swal.fire({
//       title: "Konfirmasi",
//       text: "Yakin ingin logout?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Logout",
//       cancelButtonText: "Batal",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         logout();
//         setLoggedIn(false);
//         Swal.fire("Logout!", "Anda telah logout.", "success");
//       }
//     });
//   };

//   return (
// <nav className="p-4 bg-gray-100 flex justify-between items-center shadow-md">
//   <a href="/" className="text-blue-500 hover:underline">
//     <h3 className="text-lg font-semibold">{packageJson.name} v{packageJson.version}</h3>
//   </a>
//   {loggedIn ? (
//     <div className="flex items-center gap-4">
//       {/* Status pengguna dengan ikon */}
//       <span className="flex items-center text-sm text-green-500">
//         <FiUser className="h-5 w-5 mr-2" />
//         <span className="hidden sm:block">Logged In</span>
//         <span className="sm:hidden">✅</span>
//       </span>
//       {/* Ikon Logout */}
//       {/* <button onClick={handleLogout} className="flex items-center p-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer gap-2">
//         <FiLogOut className="h-6 w-6" />
//         <span className="hidden sm:block">logout</span>
//       </button> */}

//       <IconButton onClick={handleLogout} icon={FiLogOut} label="Logout" color="red"/>
//     </div>
//   ) : (
//     // <button onClick={handleLogin} className="flex items-center p-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer gap-2">
//     //   <FiLogIn className="h-6 w-6" />
//     //   <span className="hidden sm:block">login </span>
//     // </button>
//     <IconButton onClick={handleLogin} icon={FiLogIn} label="Login" color="blue"/>
//   )}
// </nav>
//   );
// }

// export default Navbar;

import { useState, useEffect } from "react";
import { FiLogIn, FiLogOut, FiUser, FiMenu } from "react-icons/fi";
import IconButton from "./IconButton";
import { login, logout, isLoggedIn } from "../utils/auth";
import packageJson from "../../package.json";
import GlobalSwal from "../utils/GlobalSwal";

const Swal = GlobalSwal;

const Navbar = ({ links }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
        {loggedIn ? (
          <span className="text-green-500 flex items-center">
            <FiUser className="h-5 w-5 mr-2" />
            <span className="hidden sm:block">Logged In</span>
          </span>
        ) : (
          <span className="opacity-0">Placeholder</span>
        )}
      </div>

      <button 
        onClick={loggedIn ? handleLogout : handleLogin} 
        className="flex items-center justify-center gap-2 py-2 px-4 text-white rounded-md transition duration-200"
        style={{ backgroundColor: loggedIn ? 'red' : 'blue' }}
      >
        {loggedIn ? <FiLogOut className="h-5 w-5" /> : <FiLogIn className="h-5 w-5" />}
        <span>{loggedIn ? 'Logout' : 'Login'}</span>
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
            {loggedIn && (
              <span className="text-green-500 flex items-center">
                <FiUser className="h-5 w-5 mr-2" />
                Logged In
              </span>
            )}
            {loggedIn ? (
              <IconButton onClick={handleLogout} icon={FiLogOut} label="Logout" color="red" alwaysShowLabel />
            ) : (
              <IconButton onClick={handleLogin} icon={FiLogIn} label="Login" color="blue" alwaysShowLabel />
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;