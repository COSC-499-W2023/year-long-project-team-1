/*
 * Copyright [2023] [Privacypal Authors]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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
