import { CSS } from "@lib/utils";
import { Button, DropEvent, FileUpload } from "@patternfly/react-core";
import { useRef, useState } from "react";

interface FileUploaderProps {
  acceptedFileTypes: string[];
  existingFile?: File;
  style?: CSS;
  onUpload: (file: File) => void;
}

export const FileUploader = ({
  acceptedFileTypes,
  existingFile,
  style,
  onUpload,
}: FileUploaderProps) => {
  const [value, setValue] = useState(existingFile);
  const [filename, setFilename] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileInputChange = (_: DropEvent, file: File) => {
    setFilename(file.name);
    onUpload(file);
  };

  const handleClear = (
    _event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    setFilename("");
    setValue(undefined);
  };

  const handleFileReadStarted = (_event: DropEvent, _fileHandle: File) => {
    setIsLoading(true);
  };

  const handleFileReadFinished = (_event: DropEvent, _fileHandle: File) => {
    setIsLoading(false);
  };

  return (
    <FileUpload
      id="text-file-simple"
      value={value}
      filename={filename}
      filenamePlaceholder="Drag and drop a file or upload one"
      onFileInputChange={handleFileInputChange}
      onReadStarted={handleFileReadStarted}
      onReadFinished={handleFileReadFinished}
      onClearClick={handleClear}
      isLoading={isLoading}
      browseButtonText="Upload"
      dropzoneProps={{
        accept: { "video/*": acceptedFileTypes },
      }}
      style={style}
    />
  );
};
