import styled from "styled-components";

export const ButtonStyle = styled.button`
  background-color: #fff;
  border: solid 3px black;
  color: black;
  font-size: 22px;
  border-radius: 30px;
  width: 200px;
  height: 40px;
  transition-duration: 0.5s;

  &:hover {
    cursor: pointer;
    background-color: black;
    color: #fff;
  }

  &:focus {
    outline: none;
  }
`;
