import styled from "styled-components";
import theme from "../../../share/styles/themes";

export const ButtonStyle = styled.button`
  background-color: ${theme.colors.var};
  border: solid 3px ${theme.colors.background};
  color: ${theme.colors.background};
  font-weight: 700;
  font-size: 22px;
  border-radius: 30px;
  width: 200px;
  height: 40px;
  transition-duration: 0.5s;

  &:hover {
    cursor: pointer;
    background-color: ${theme.colors.class};
  }

  &:focus {
    outline: none;
  }
`;
