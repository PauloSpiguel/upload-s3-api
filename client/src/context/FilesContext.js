/* eslint-disable react-hooks/exhaustive-deps */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";
import filesize from "filesize";

import api from "../services/api";

const FileContext = createContext({});

export const FileProvider = ({ children }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  function updateFile(fileId, data) {
    setUploadedFiles((files) =>
      files.map((uploadedFile) => {
        return fileId === uploadedFile.id
          ? { ...uploadedFile, ...data }
          : uploadedFile;
      })
    );
  }

  const progressUpload = useCallback((uploadedFile) => {
    const data = new FormData();

    data.append("file", uploadedFile.file, uploadedFile.name);

    api
      .patch("upload", data, {
        onUploadProgress: (e) => {
          const progress = parseInt(Math.round((e.loaded * 100) / e.total));

          updateFile(uploadedFile.id, { progress });
        },
      })
      .then((response) => {
        const { data } = response;
        updateFile(uploadedFile.id, {
          uploaded: true,
          id: data.uuid,
          url: data.url,
        });
      })
      .catch((error) => {
        // console.log(error);
        updateFile(uploadedFile.id, {
          error: true,
        });
      });
  }, []);

  const addFiles = useCallback(
    (files) => {
      const filesItems = files.map((file) => ({
        file,
        id: uuidv4(),
        name: file.name,
        readableSize: filesize(file.size),
        preview: URL.createObjectURL(file),
        progress: 0,
        uploaded: false,
        error: false,
        url: null,
      }));

      setUploadedFiles((oldFiles) => [...oldFiles, ...filesItems]);

      filesItems.forEach((files) => {
        progressUpload(files);
      });
    },
    [progressUpload]
  );

  const removeFile = useCallback(
    (id) => {
      api.delete(`files/${id}`).then(() => {
        setUploadedFiles((oldFiles) => {
          return oldFiles.filter((file) => file.id !== id);
        });
      });
    },
    [setUploadedFiles]
  );

  useEffect(() => {
    setIsLoading(true);

    api
      .get("files")
      .then(({ data }) => {
        setUploadedFiles(() => {
          return data.map((file) => ({
            id: file.uuid,
            name: file.name,
            readableSize: filesize(file.size),
            preview: file.url,
            uploaded: true,
            url: file.url,
          }));
        });
      })
      .catch((error) => {
        console.log(error);
      });

    setIsLoading(false);
  }, []);

  useEffect(() => {
    return () =>
      uploadedFiles.forEach((file) => URL.revokeObjectURL(file.preview));
  }, []);

  return (
    <FileContext.Provider
      value={{
        uploadedFiles,
        addFiles,
        removeFile,
        isLoading,
      }}
    >
      {children}
    </FileContext.Provider>
  );
};

const useFile = () => {
  const context = useContext(FileContext);

  if (!context) throw new Error("useFiles must be used within an FilesContext");

  return context;
};

export default useFile;
