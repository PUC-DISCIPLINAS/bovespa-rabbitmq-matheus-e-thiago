import { AppProps } from "next/app";
import { ThemeProvider } from "styled-components";

import GlobalStyle from "../share/styles/global";
import theme from "../share/styles/themes";

const AppMQ: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Component {...pageProps} />
    </ThemeProvider>
  );
};

export default AppMQ;
