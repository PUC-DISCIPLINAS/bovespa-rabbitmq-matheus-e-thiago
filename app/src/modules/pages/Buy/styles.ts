import styled from "styled-components";
import theme from "../../../share/styles/themes";

export const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: ${theme.colors.background};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const FormContainer = styled.div`
  background-color: ${theme.colors.comment};
  width: 600px;
  height: 600px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 50px;
  border-radius: 50px;
  h1 {
    color: ${theme.colors.background};
  }
`;
