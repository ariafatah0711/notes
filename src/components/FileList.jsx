import FileItem from './FileList/FileItem';
import EmptyState from './FileList/EmptyState';

const FileList = ({ filteredFiles, selectedFiles, handleSelectFile, handleLoadFile, handlePreview, setSelectedFiles, currentFile, currentGist}) => {
  if (filteredFiles.length === 0) {
    return <EmptyState message="Tidak ada file yang ditemukan" />;
  }

  return (
    <div>
      {filteredFiles
        .filter((fileName) => fileName !== ".placeholder")
        .map((fileName) => (
          <FileItem
            key={fileName}
            fileName={fileName}
            isSelected={selectedFiles.includes(fileName)}
            onSelect={() => handleSelectFile(fileName, setSelectedFiles)}
            onLoad={() => handleLoadFile(fileName)}
            onPreview={() => handlePreview(null, fileName, currentGist)}
            isActive={currentFile === fileName}
            fileUrl={`https://gist.githubusercontent.com/${currentGist.owner.login}/${currentGist.id}/raw/${fileName}`}
          />
        ))}
    </div>
  );
};

export default FileList;
