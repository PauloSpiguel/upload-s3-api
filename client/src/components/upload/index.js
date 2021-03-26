import React from "react";

import Dropzone from "react-dropzone";
import useFile from "../../context/FilesContext";

import { DropContainer, UploadMessage } from "./styles";

export default function Upload() {
  const renderDragMessage = (isDragActive, isDragReject) => {
    if (!isDragActive) {
      return (
        <UploadMessage>
          Drag & Drop yours file here or open <b>Browser</b>
        </UploadMessage>
      );
    }

    if (isDragReject) {
      return <UploadMessage active='error'>File not supported!</UploadMessage>;
    }

    if (isDragActive) {
      return <UploadMessage active='success'>Drop files here!</UploadMessage>;
    }

    if (!isDragActive) {
      return (
        <UploadMessage>
          Drag & Drop yours file here or open Browser
        </UploadMessage>
      );
    }
  };

  const { addFiles } = useFile();

  return (
    <Dropzone accept='image/*' onDropAccepted={addFiles}>
      {({ getRootProps, getInputProps, isDragActive, isDragReject }) => (
        <DropContainer
          {...getRootProps()}
          isDragActive={isDragActive}
          isDragReject={isDragReject}
        >
          <input {...getInputProps()} />
          {renderDragMessage(isDragActive, isDragReject)}
        </DropContainer>
      )}
    </Dropzone>
  );
}
