import { Container, FileInfo, Preview, Loading } from "./styles";

import { CircularProgressbar } from "react-circular-progressbar";
import { MdLink, MdError, MdCheckCircle } from "react-icons/md";
import useFile from "../../context/FilesContext";

function FileList() {
  const { uploadedFiles, removeFile, isLoading } = useFile();

  if (!isLoading && !uploadedFiles.length) return null;

  return (
    <Container>
      {isLoading && <Loading>Loading...</Loading>}

      {uploadedFiles.map((file) => (
        <li key={file?.id}>
          <FileInfo>
            <Preview src={file?.preview} />
            <div>
              <strong>{file.name}</strong>
              <span>
                {file.readableSize}
                <button onClick={() => removeFile(file.id)}>Remove</button>
              </span>
            </div>
          </FileInfo>

          <div>
            {!file.uploaded && !file.error && (
              <CircularProgressbar
                value={file.progress}
                styles={{
                  root: { width: 24 },
                  path: { stroke: "var(--primary)" },
                }}
              />
            )}

            {file.url && (
              <a href={file.url} target='_black' rel='noopener noreferrer'>
                <MdLink color='#222' size={24} />
              </a>
            )}

            {file.uploaded && (
              <MdCheckCircle color='var(--primary)' size={24} />
            )}

            {file.error && <MdError color='var(--red)' size={24} />}
          </div>
        </li>
      ))}
    </Container>
  );
}

export default FileList;
