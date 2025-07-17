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
    <>
    {gists.map((gist) => (
      <div
        key={gist.id}
        className="flex justify-between items-center my-2 p-3 bg-gray-100 rounded shadow-md hover:bg-blue-100 cursor-pointer"
        onClick={() => navigate(`/${gist.folderName}`)}
      >
        <button className="bg-blue-500 text-white p-2 m-2 rounded hover:bg-blue-600 cursor-pointer w-12 text-center"
          // onClick={(e) => e.stopPropagation()}
        >
          {Object.keys(gist.files).filter((fileName) => fileName !== ".placeholder").length < 10
            ? Object.keys(gist.files).filter((fileName) => fileName !== ".placeholder").length
            : "9+"}
        </button>
      
        <span className="w-full text-blue-600 text-lg font-medium hover:text-blue-800 truncate">
          📁 {gist.folderName}
        </span>
      
        <div className="flex items-center ml-auto">
          <button
            className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600 cursor-pointer mr-2"
            onClick={(e) => {
              e.stopPropagation();
              handleEditGist(gist.id, gist.folderName);
            }}
          >
            <FaEdit />
          </button>
      
          <button
            className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 cursor-pointer"
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
      {/* {gists.map((gist) => (
        <div key={gist.id} className="flex justify-between items-center my-2 p-3 bg-gray-100 rounded shadow-md hover:bg-blue-100">
          <button className="bg-blue-500 text-white p-2 m-2 rounded hover:bg-blue-600 cursor-pointer w-12 text-center">
            {Object.keys(gist.files).filter((fileName) => fileName !== ".placeholder").length < 10
              ? Object.keys(gist.files).filter((fileName) => fileName !== ".placeholder").length
              : "9+"}
          </button>
          
          <Link 
            to={`/${gist.folderName}`} 
            className="w-full text-blue-600 text-lg font-medium hover:text-blue-800 cursor-pointer truncate"
          >
            📁 {gist.folderName}
          </Link>
          <div className="flex items-center ml-auto">
            <button
              className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600 cursor-pointer mr-2"
              onClick={(e) => {
                e.stopPropagation();
                handleEditGist(gist.id, gist.folderName);
              }}
            >
              <FaEdit />
            </button>

            <button
              className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteGist(gist.id);
              }}
            >
              <FaTrashAlt />
            </button>
          </div>
        </div>
      ))} */}
    </>
  );
};

export default FolderList;
