import React, { useState, useEffect } from 'react';

const SearchBar = ({ placeholder, data, onSearch, renderItem }) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const filteredData = searchTerm.trim()
      ? data.filter(item => item.toLowerCase().includes(searchTerm.toLowerCase()))
      : data;
    onSearch(filteredData);
  }, [searchTerm, data, onSearch]);

  return (
    <div className="w-full">
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border p-2 rounded mb-4 w-full"
      />
      {/* <div>
        {data.length > 0 ? (
            data.map(renderItem)
            ) : (
            <p className="text-gray-500">Tidak ada hasil ditemukan</p>
        )}
      </div> */}
    </div>
  );
};

export default SearchBar;