import React from 'react';
import { Link } from 'react-router-dom';
import { FaTrashAlt, FaEdit } from 'react-icons/fa';

const FolderList = ({ gists, loading, handleEditGist, handleDeleteGist, navigate }) => {
  if (loading) return (
    <div className="flex flex-col m-2">
      <p className="text-gray-500">Loading</p>
    </div>
  )

  if (gists?.length == 0) return <p className="text-gray-500">Tidak ada folder, tambahkan folder baru!</p>;

  return (
    <div className="flex flex-col gap-3">
      {gists.map((gist) => (
        <div
          key={gist.id}
          className="flex items-center gap-4 bg-white rounded-xl shadow p-4 hover:bg-blue-50 transition cursor-pointer border border-gray-100"
          onClick={() => navigate(`/${gist.folderName}`)}
        >
          <div className="flex items-center justify-center bg-blue-500 text-white rounded-lg w-10 h-10 font-bold text-base">
            {Object.keys(gist.files).filter((fileName) => fileName !== ".placeholder").length < 10
              ? Object.keys(gist.files).filter((fileName) => fileName !== ".placeholder").length
              : "9+"}
          </div>
          <span className="flex-1 text-blue-700 text-lg font-semibold truncate">
            📁 {gist.folderName}
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <button
              className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors cursor-pointer"
              title="Edit Folder"
              onClick={(e) => {
                e.stopPropagation();
                handleEditGist(gist.id, gist.folderName);
              }}
            >
              <FaEdit />
            </button>
            <button
              className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors cursor-pointer"
              title="Hapus Folder"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteGist(gist.id);
              }}
            >
              <FaTrashAlt />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FolderList;
