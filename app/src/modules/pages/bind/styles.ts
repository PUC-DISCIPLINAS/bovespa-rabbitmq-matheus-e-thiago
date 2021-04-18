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
  overflow: hidden;
`;

export const FormContainer = styled.div`
  background-color: ${theme.colors.comment};
  width: 600px;
  height: 700px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  border-radius: 50px;
  h1 {
    color: ${theme.colors.background};
  }
  form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;

export const Label = styled.label`
  display: block;
  position: relative;
  padding-left: 35px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 20px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  align-self: flex-start;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 170px;
  input[type="checkbox"] {
    transform: scale(1.5);
  }
`;
