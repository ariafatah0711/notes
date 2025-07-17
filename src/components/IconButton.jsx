// import React from 'react';

// const IconButton = ({ onClick, icon: Icon, label, color = 'blue' }) => {
//   const baseClasses = `text-white px-4 py-2 rounded cursor-pointer flex items-center gap-2 w-auto min-h-[45px] min-w-[20px] max-w-[300px]`;
//   const colorClasses = {
//     blue: 'bg-blue-500 hover:bg-blue-600',
//     green: 'bg-green-500 hover:bg-green-600',
//     red: 'bg-red-500 hover:bg-red-600',
//   };

//   return (
//     <button className={`${baseClasses} ${colorClasses[color]}`} onClick={onClick}>
//       <Icon className="text-xl" />
//       <span className="hidden sm:block ml-2">{label}</span>
//     </button>
//   );
// };

// export default IconButton;

import { useState, useEffect } from "react";

function IconButton({ onClick, icon: Icon, label, color = "blue", alwaysShowLabel = false, size = "md" }) {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 640);

  useEffect(() => {
    const updateScreenSize = () => {
      setIsDesktop(window.innerWidth >= 640);
    };
    window.addEventListener("resize", updateScreenSize);
    return () => window.removeEventListener("resize", updateScreenSize);
  }, []);

  const sizeClasses = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };
  const baseClasses = `font-semibold rounded-lg shadow flex items-center gap-2 min-h-[40px] transition ${sizeClasses[size]}`;
  const colorClasses = {
    gray: "bg-gray-500 hover:bg-gray-600 text-white",
    blue: "bg-blue-500 hover:bg-blue-600 text-white",
    green: "bg-green-500 hover:bg-green-600 text-white",
    yellow: "bg-yellow-500 hover:bg-yellow-600 text-white",
    purple: "bg-purple-500 hover:bg-purple-600 text-white",
    red: "bg-red-500 hover:bg-red-600 text-white",
    white: "bg-white hover:bg-gray-100 text-gray-700 border border-gray-300",
  };

  return (
    <button className={`${baseClasses} ${colorClasses[color]}`} onClick={onClick}>
      <Icon className="text-xl" />
      {(alwaysShowLabel || isDesktop) && <span className="ml-2">{label}</span>}
    </button>
  );
}

export default IconButton;