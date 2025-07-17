import { useState, useEffect } from "react";
import { FaSave, FaEdit, FaTrashAlt, FaEye } from "react-icons/fa"

export default function Editor({ folderName, gistId, fileName, content, onSave, onClose, onEdit, onPreview, onDeleteFile }) {
  const [value, setValue] = useState(content);

  useEffect(() => {
    // Hanya setValue jika content tidak '_'
    if (content == "_") {
      setValue(""); // Reset jika file kosong
    } else {
      setValue(content); // Update dengan content baru
    }
  }, [content]);  // Pastikan effect ini hanya dipicu ketika content berubah

  // console.log(content)

   // Tangani event Ctrl + S
   useEffect(() => {
    const handleKeyDown = (e) => {

      if (e.key === "Escape") {
        onClose(); // Tutup editor saat Esc ditekan
      } else if (e.ctrlKey && e.key === 's') {
        e.preventDefault(); // Mencegah aksi default browser
        onSave(value);
        // onSave(textareaRef.current.value);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [value, onSave]);

  // Kalau tidak ada gist & file
  if (!gistId) return null; 

  // console.log(fileName, folderName)
  const isDisabled = !fileName || !folderName;

 // Kalau file kosong, tampilkan info saja
 if (isDisabled) {
  return (
    <div className="p-4 border mt-4 rounded text-gray-500">
      <p>File tidak ditemukan.</p>
    </div>
  );
}

return (
  <div className="pt-1 flex flex-col h-full">
  <div className="flex justify-between items-center mb-4">
    <h4 className="text-xl font-semibold text-gray-700 hover:text-blue-800 cursor-pointer truncate">{folderName}/{fileName}</h4>
    <button
      onClick={onClose}
      className="text-red-500 hover:text-red-700 text-2xl cursor-pointer"
      title="Tutup Folder/File"
    >
      ❌
    </button>
  </div>

  <textarea
    id="text_gist"
    className="w-full flex-grow border-2 border-gray-300 rounded-lg p-4 text-base sm:text-sm md:text-lg lg:text-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
    style={{
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
      overflowWrap: 'break-word',
      resize: 'vertical',
    }}
    wrap="soft"
    value={value}
    onChange={(e) => setValue(e.target.value)}
    placeholder="Edit file ini..."
  />

    <div className="flex gap-4 mt-4 justify-end">
      <button
        onClick={() => onSave(value)}
        className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600 transition-colors cursor-pointer"
      >
        <FaSave />
      </button>

      <button
        onClick={() => onPreview(document.getElementById("text_gist").value)}
        className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition-colors cursor-pointer"
      >
        <FaEye />
      </button>

      <button
        onClick={() => onEdit(fileName)}
        className="bg-yellow-500 text-white p-3 rounded-full hover:bg-yellow-600 transition-colors cursor-pointer"
      >
        <FaEdit />
      </button>

      <button
        onClick={onDeleteFile}
        className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-colors cursor-pointer"
      >
        <FaTrashAlt />
      </button>
    </div>
  </div>
);
}