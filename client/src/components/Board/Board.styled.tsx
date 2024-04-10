import styled from "styled-components";

const BoardStyled = styled.section`
  border: ${(props) => props.theme.borders.standardBlue};
  display: flex;
  flex-wrap: ${(props) => props.theme.flex.wrap};
  margin: ${(props) => props.theme.margins.bigger};
  padding: ${(props) => props.theme.paddings.bigger};
  text-align: center;
  justify-content: center;

  & > :nth-child(odd) {
    background-color: aliceblue;
  }
  & > :nth-child(even) {
    background-color: lightblue;
  }
`;

export default BoardStyled;
