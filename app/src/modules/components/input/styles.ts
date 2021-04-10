import styled from "styled-components";
import theme from "../../../share/styles/themes";

export const InputStyle = styled.input`
  border: none;
  border-bottom: solid 3px ${theme.colors.background};
  font-size: 22px;
  font-weight: 700px;
  color: ${theme.colors.background};
  background-color: ${theme.colors.comment};

  h1 {
    color: ${theme.colors.string};
  }

  &:focus {
    outline: none;
  }
`;
