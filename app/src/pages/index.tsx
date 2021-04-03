import Home from "../modules/pages/Index";
import { ThemeProvider } from "styled-components";

import GlobalStyle from "../share/styles/global";
import theme from "../share/styles/themes";

const HomePage: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Home />
    </ThemeProvider>
  );
};

export default HomePage;
