import { AppProps } from "next/app";
import { ThemeProvider } from "styled-components";
import { bind } from "../api/api";
import { OperationList } from "../models/OperationList";

import GlobalStyle from "../share/styles/global";
import theme from "../share/styles/themes";

const AppMQ: React.FC<AppProps> = ({ Component, pageProps }) => {
  const startServer = async () => {
    try {
      if (!localStorage.getItem("$$id")) {
        const response = await bind(["AMBEV","AMBE2"]);
        localStorage.setItem("$$id", response.toString());
      }
      await OperationList.initialize(localStorage.getItem("$$id"));
    } catch (error) {}
  };
  startServer();
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Component {...pageProps} />
    </ThemeProvider>
  );
};

export default AppMQ;
