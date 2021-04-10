import { createGlobalStyle } from "styled-components";
import theme from "./themes";

export default createGlobalStyle`
* {
    box-sizing: border-box;
  }
  html, body {
    margin: 0;
  }
  #__next{
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
  body {
    font: 400 18px Roboto, sans-serif;
    background-color: ${theme.colors.background}
  }
  `;
