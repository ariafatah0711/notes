import React from 'react';

const IconButton = ({ onClick, icon: Icon, label, color = 'blue' }) => {
  const baseClasses = `text-white px-4 py-2 rounded cursor-pointer flex items-center gap-2 w-auto min-h-[45px] min-w-[20px] max-w-[300px]`;
  const colorClasses = {
    blue: 'bg-blue-500 hover:bg-blue-600',
    green: 'bg-green-500 hover:bg-green-600',
    red: 'bg-red-500 hover:bg-red-600',
  };

  return (
    <button className={`${baseClasses} ${colorClasses[color]}`} onClick={onClick}>
      <Icon className="text-xl" />
      <span className="hidden sm:block ml-2">{label}</span>
    </button>
  );
};

export default IconButton;
