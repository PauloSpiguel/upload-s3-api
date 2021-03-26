import React from "react";

import { FileProvider } from "./context/FilesContext";

import ReactDOM from "react-dom";
import App from "./App";
import GlobalStyle from "./styles/GlobalStyle";

ReactDOM.render(
  <FileProvider>
    <GlobalStyle />
    <App />
  </FileProvider>,
  document.getElementById("root")
);
