import { createGlobalStyle } from "styled-components";

import "react-circular-progressbar/dist/styles.css";

export default createGlobalStyle`
  :root {
    --background: #7159c1;
    --primary: #22b6b6;

    --white: #fff;
    --red: #c41717;
    --green: #41a511;
    --blue: #1791c4;
    --gray: #7f9097;

    --title: #3e4041;
    --text: #565757;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body, html, #root {
    height: 100vh;
  }

  body {
    font-size: 1rem;
    font-family: "Nunito", sans-serif;
    background: var(--background);
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased; 
  }

`;
