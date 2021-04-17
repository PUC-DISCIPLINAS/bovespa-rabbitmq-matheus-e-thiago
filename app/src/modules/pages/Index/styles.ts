import styled from "styled-components";
import theme from "../../../share/styles/themes";

export const Container = styled.div`
  background-color: ${theme.colors.background};
  min-height: 70vh;
  min-width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 40px;
  h1 {
    color: ${theme.colors.string};
  }
  div {
    margin-bottom: 30px;
    background-color: ${theme.colors.var};
    width: 300px;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition-duration: 0.5s;

    &:hover {
      background-color: ${theme.colors.class};
      cursor: pointer;
    }

    a {
      font-weight: 600;
      color: ${theme.colors.background};
      padding: 10px;
      text-decoration: none;
    }
  }
`;
