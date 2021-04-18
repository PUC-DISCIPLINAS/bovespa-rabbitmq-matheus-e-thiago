import { AppProps } from "next/app";
import { ThemeProvider } from "styled-components";
import { OperationList } from "../models/OperationList";
import { useRouter } from "next/router";

import GlobalStyle from "../share/styles/global";
import theme from "../share/styles/themes";

const AppMQ: React.FC<AppProps> = ({ Component, pageProps }) => {
  const router = useRouter();
  const startServer = async () => {
    try {
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
