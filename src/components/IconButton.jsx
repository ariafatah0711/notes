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

function IconButton({ onClick, icon: Icon, label, color = "blue", alwaysShowLabel = false }) {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 640);

  useEffect(() => {
    const updateScreenSize = () => {
      setIsDesktop(window.innerWidth >= 640);
    };

    window.addEventListener("resize", updateScreenSize);
    return () => window.removeEventListener("resize", updateScreenSize);
  }, []);

  const baseClasses = "text-white px-4 py-2 rounded cursor-pointer flex items-center gap-2 min-h-[45px]";
  const colorClasses = {
    gray: "bg-gray-500 hover:bg-gray-600",
    blue: "bg-blue-500 hover:bg-blue-600",
    green: "bg-green-500 hover:bg-green-600",
    yellow: "bg-yellow-500 hover:bg-yellow-600",
    purple: "bg-purple-500 hover:bg-purple-600",
    red: "bg-red-500 hover:bg-red-600",
  };

  return (
    <button className={`${baseClasses} ${colorClasses[color]}`} onClick={onClick}>
      <Icon className="text-xl" />
      {(alwaysShowLabel || isDesktop) && <span className="ml-2">{label}</span>}
    </button>
  );
}

export default IconButton;