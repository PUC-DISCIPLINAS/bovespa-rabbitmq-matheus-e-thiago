import styled from "styled-components";

export const Container = styled.div`
  background-color: #eee;
  min-height: 100vh;
  min-width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 40px;
  div {
    margin-bottom: 30px;
    background-color: #fff;
    width: 300px;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition-duration: 0.5s;

    &:hover {
      background-color: #333;
    }

    &:hover a {
      color: #fff;
    }

    a {
      font-weight: 600;
      color: black;
      padding: 10px;
      text-decoration: none;
    }
  }
`;
