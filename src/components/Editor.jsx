import { useState, useEffect } from "react";
import { FaSave, FaEdit, FaTrashAlt, FaEye } from "react-icons/fa"
import GlobalSwal from "../utils/GlobalSwal";

export default function Editor({ folderName, gistId, fileName, content, onSave, onClose, onEdit, onPreview, onDeleteFile }) {
  const [value, setValue] = useState(content);
  const [showPreview, setShowPreview] = useState(false);
  const [previewContent, setPreviewContent] = useState("");
  const [showDetailsPreview, setShowDetailsPreview] = useState(false);

  useEffect(() => {
    if (content == "_") {
      setValue("");
    } else {
      setValue(content);
    }
  }, [content]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        onSave(value);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [value, onSave]);

  if (!gistId) return null;
  // Hanya tampilkan pesan error jika fileName/folderName tidak ada
  if (!fileName || !folderName) {
    return (
      <div className="p-4 border mt-4 rounded text-gray-500 bg-white shadow max-w-2xl mx-auto">
        <p>File tidak ditemukan.</p>
      </div>
    );
  }

  const Swal = GlobalSwal;

  // Handler preview
  const handlePreviewClick = async () => {
    if (!value.trim()) {
      // Jika file kosong, tampilkan info Swal dan jangan buka preview
      Swal.fire("Info", "File ini kosong!", "info");
      return;
    }
    if (onPreview) {
      const result = await onPreview(value);
      setPreviewContent(result || value);
      setShowDetailsPreview(true);
      setTimeout(() => {
        const details = document.getElementById('details-preview');
        if (details) details.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  };

  return (
    <div className="w-full bg-white shadow-lg rounded-xl p-6 mt-6 flex flex-col gap-4 min-h-[70vh]">
      <div className="flex items-center justify-between border-b pb-2 mb-4">
        <div>
          <span className="font-bold text-lg text-blue-700">{folderName}/{fileName}</span>
          <span className="ml-2 text-xs text-gray-400">({value.length} chars)</span>
        </div>
        <button onClick={onClose} className="text-red-500 hover:text-red-700 text-2xl" title="Tutup">✖</button>
      </div>
      <textarea
        id="text_gist"
        className="w-full flex-1 min-h-[400px] max-h-[60vh] bg-gray-50 border border-gray-300 rounded-lg p-4 font-mono text-base focus:ring-2 focus:ring-blue-400 resize-vertical overflow-y-auto"
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
      <div className="flex gap-3 justify-end mt-2 flex-wrap">
        <button
          onClick={() => onSave(value)}
          className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600 transition-colors cursor-pointer flex items-center gap-2"
        >
          <FaSave /> <span className="hidden sm:inline">Save</span>
        </button>
        <button
          onClick={handlePreviewClick}
          className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition-colors cursor-pointer flex items-center gap-2"
        >
          <FaEye /> <span className="hidden sm:inline">Preview</span>
        </button>
        <button
          onClick={() => onEdit(fileName)}
          className="bg-yellow-500 text-white p-3 rounded-full hover:bg-yellow-600 transition-colors cursor-pointer flex items-center gap-2"
        >
          <FaEdit /> <span className="hidden sm:inline">Rename</span>
        </button>
        <button
          onClick={onDeleteFile}
          className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-colors cursor-pointer flex items-center gap-2"
        >
          <FaTrashAlt /> <span className="hidden sm:inline">Delete</span>
        </button>
      </div>
      {/* Status bar */}
      <div className="text-xs text-gray-400 mt-1 flex justify-between">
        <span>Characters: {value.length}</span>
        <span>Ctrl+S to save, Esc to close</span>
      </div>
    </div>
  );
}