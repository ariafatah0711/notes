import { AiOutlineHome, AiOutlineRight } from "react-icons/ai";

export default function Breadcrumb({ folderName, currentFile, navigate }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
      <button onClick={() => navigate('/')} className="hover:text-blue-600 flex items-center gap-1">
        <AiOutlineHome /> Home
      </button>
      {folderName && (
        <>
          <AiOutlineRight />
          <span className="font-semibold text-blue-700">{folderName}</span>
        </>
      )}
      {currentFile && (
        <>
          <AiOutlineRight />
          <span className="text-gray-700">{currentFile}</span>
        </>
      )}
    </div>
  );
} 