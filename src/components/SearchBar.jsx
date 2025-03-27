import React, { useState } from 'react';

const SearchBar = ({ placeholder, data, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const filteredData = searchTerm.trim()
        ? data.filter(item => item.toLowerCase().includes(searchTerm.toLowerCase()))
        : data;
      onSearch(filteredData);
    }
  };

  const handleKeyUp = (e) => {
    if (e.key === "Enter") {
      const filteredData = searchTerm.trim()
        ? data.filter(item => item.toLowerCase().includes(searchTerm.toLowerCase()))
        : data;
      onSearch(filteredData);
    }
  };

  return (
    <div className="w-full">
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        className="border p-2 rounded mb-4 w-full"
      />
    </div>
  );
};

export default SearchBar;