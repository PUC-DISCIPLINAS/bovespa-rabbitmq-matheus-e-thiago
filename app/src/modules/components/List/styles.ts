import styled from "styled-components";
import theme from "../../../share/styles/themes";

export const Container = styled.div`
  width: 100vw;
  min-height: 100px;
  background-color: ${theme.colors.background};
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const OperationTable = styled.table`
  width: 90%;
  height: 90%;
  background-color: ${theme.colors.comment};
  caption-side: top;
  border: none;
  border-collapse: collapse;
  caption-side: bottom;

  td,
  th {
    border: none;
  }

  td {
    padding: 10px 20px;
    text-align: center;
  }

  th {
    padding: 20px 20px;
    text-align: center;
  }

  tr {
    color: ${theme.colors.background};
    font-weight: 700;
  }

  tbody tr {
    :nth-of-type(odd) {
      background-color: ${theme.colors.comment};
    }
    :nth-of-type(even) {
      background-color: ${theme.colors.class};
    }
    :hover {
      background-color: ${theme.colors.number};
    }
  }

  thead > tr {
    background-color: ${theme.colors.var};
  }

  caption {
    font-size: 0.9em;
    padding: 5px;
    font-weight: bold;
  }
`;
