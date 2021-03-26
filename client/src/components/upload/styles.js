import styled, { css } from "styled-components";

const dragActive = css`
  border-color: var(--green);
`;

const dragReject = css`
  border-color: var(--red);
`;

const messageColors = {
  default: "var(--gray)",
  error: "var(--red)",
  success: "var(--green)",
};

export const DropContainer = styled.div.attrs({
  className: "dropzone",
})`
  border: 1px dashed #ddd;
  min-height: 1px;
  border-radius: 4px;
  outline: 0;
  cursor: pointer;

  transition: height 0.2s ease;

  ${(props) => props.isDragActive && dragActive}
  ${(props) => props.isDragReject && dragReject}
`;

export const UploadMessage = styled.p`
  text-align: center;
  padding: 1rem;

  color: ${(props) => messageColors[props.active || "default"]};

  > b {
    color: var(--primary);
  }
`;
