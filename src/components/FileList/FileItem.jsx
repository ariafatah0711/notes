import { FaFileAlt, FaEye } from 'react-icons/fa';
import Checkbox from './Checkbox';

const FileItem = ({ fileName, isSelected, onSelect, onLoad, onPreview, isActive, fileUrl }) => {
  return (
    <div
      className="flex items-center gap-4 bg-white rounded-xl shadow p-4 my-2 border border-gray-100 hover:bg-blue-50 transition cursor-pointer"
      onClick={onLoad}
    >
      {/* Checkbox dengan stopPropagation */}
      <label onClick={(e) => e.stopPropagation()} className="flex items-center">
        <Checkbox isChecked={isSelected} onChange={onSelect} />
      </label>
      {/* Nama File */}
      <span
        className={`ml-3 flex-1 text-blue-700 text-left text-base font-medium truncate ${
          isActive ? "font-bold text-blue-700" : ""
        }`}
      >
        📄 {fileName}
      </span>
      {/* Link untuk membuka file */}
      <a
        href={fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="ml-2 p-2 rounded-full border border-gray-300 hover:border-blue-500 text-blue-600 hover:text-blue-800 transition-colors cursor-pointer inline-flex items-center justify-center"
        title="Buka File di Gist"
      >
        <FaFileAlt />
      </a>
      {/* Tombol Preview */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPreview();
        }}
        className="bg-blue-500 ml-2 text-white p-2 rounded-full hover:bg-blue-600 transition-colors cursor-pointer"
        title="Preview File"
      >
        <FaEye />
      </button>
    </div>
  );
};

export default FileItem;
