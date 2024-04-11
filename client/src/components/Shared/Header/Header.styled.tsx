import styled from "styled-components";

const HeaderStyled = styled.header`
  color: blue;
  display: flex;
  justify-content: ${(props) => props.theme.flex.justify};
  padding: ${(props) => props.theme.paddings.standard};
  background-color: ${(props) => props.theme.colors.base};
  font-style: italic;
  font-weight: ${(props) => props.theme.fontWeights.heavyBold};
`;

export default HeaderStyled;
