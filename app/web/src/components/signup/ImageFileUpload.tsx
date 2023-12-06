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
import React from 'react';
import { FileUpload, FormHelperText, HelperText, HelperTextItem } from '@patternfly/react-core';
import FileUploadIcon from '@patternfly/react-icons/dist/esm/icons/file-upload-icon';

export const ImageFileUpload: React.FunctionComponent = () => {
  const [value, setValue] = React.useState<File | undefined>();
  const [filename, setFilename] = React.useState('');
  const [isRejected, setIsRejected] = React.useState(false);

  const handleFileInputChange = (_: any, file: File) => {
    if (!isValidFileType(file) || !isValidFileSize(file)) {
      setIsRejected(true);
    } else {
      setValue(file);
      setFilename(file.name);
      setIsRejected(false);
    }
  };

  const handleClear = (_event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setFilename('');
    setValue(undefined);
    setIsRejected(false);
  };

  const isValidFileType = (file: File): boolean => {
    const acceptedTypes = ['image/png', 'image/jpeg'];
    return acceptedTypes.includes(file.type);
  };

  const isValidFileSize = (file: File): boolean => {
    const maxSize = 1 * 1024 * 1024; // 1MB in bytes
    return file.size <= maxSize;
  };

  return (
    <FileUpload
      id="customized-preview-file"
      value={value}
      filename={filename}
      filenamePlaceholder="Upload Profile Picture"
      onFileInputChange={handleFileInputChange}
      onClearClick={handleClear}
      hideDefaultPreview
      browseButtonText="Upload"
      dropzoneProps={{
        accept: { 'image/png': ['.png'], 'image/jpeg': ['.jpg', '.jpeg'] },
        maxSize: 1 * 1024 * 1024, // 1MB in bytes
        onDropRejected: () => setIsRejected(true),
        onDropAccepted: () => setIsRejected(false),
      }}
    > <FormHelperText>
    <HelperText>
      <HelperTextItem>Drag or drop a file or upload one.</HelperTextItem>
    </HelperText>
  </FormHelperText>
      {value && (
        <div className="pf-v5-u-m-md">
          <FileUploadIcon width="2em" height="2em" />{value.name} - {value.size / 1000} Mb
        </div>
      )}

      {isRejected && (
        <HelperText>
          <HelperTextItem variant="error">
            The uploaded file must be a PNG or JPG image and should not exceed 1MB in size.
          </HelperTextItem>
        </HelperText>
      )}
    </FileUpload>
  );
};
