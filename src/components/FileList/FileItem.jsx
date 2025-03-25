import { FaFileAlt, FaEye } from 'react-icons/fa';
import Checkbox from './Checkbox';

const FileItem = ({ fileName, isSelected, onSelect, onLoad, onPreview, isActive, fileUrl }) => {
  return (
    <div className="flex justify-between items-center my-2 p-3 bg-gray-100 rounded shadow-md hover:bg-blue-100">
      <Checkbox isChecked={isSelected} onChange={onSelect} />

      <button
        className={`ml-3 w-full text-blue-600 text-left text-lg font-medium hover:text-blue-800 cursor-pointer truncate ${
          isActive ? "font-bold text-blue-600" : ""
        }`}
        onClick={onLoad}
      >
        📄 {fileName}
      </button>

      <a
        href={fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="ml-2 p-3 rounded-full border border-gray-300 hover:border-blue-500 text-blue-600 hover:text-blue-800 transition-colors cursor-pointer inline-flex items-center justify-center"
      >
        <FaFileAlt />
      </a>

      <button
        onClick={onPreview}
        className="bg-blue-500 ml-2 text-white p-3 rounded-full hover:bg-blue-600 transition-colors cursor-pointer"
      >
        <FaEye />
      </button>
    </div>
  );
};

export default FileItem;
