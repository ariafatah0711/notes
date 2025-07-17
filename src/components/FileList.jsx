import FileItem from './FileList/FileItem';
import EmptyState from './FileList/EmptyState';

const FileList = ({ filteredFiles, selectedFiles, handleSelectFile, handleLoadFile, handlePreview, setSelectedFiles, currentFile, currentGist}) => {
  const hasFiles = Object.keys(currentGist?.files || {}).filter((file) => file !== ".placeholder").length > 0;

  if (!hasFiles) {
    return <EmptyState message="Tidak ada file dalam folder ini" />;
  }
  
  const displayFiles = (filteredFiles.length === 0
    ? Object.keys(currentGist.files || {})
    : filteredFiles
  ).filter((file) => file !== ".placeholder");
  
  if (displayFiles.length === 0) {
    return <EmptyState message="Tidak ada file yang cocok dengan pencarian" />;
  }

  // console.log(filteredFiles)
  // console.log(Object.keys(currentGist.files || {}).filter((file) => file !== ".placeholder"))

  return (
    <div>
      {displayFiles
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