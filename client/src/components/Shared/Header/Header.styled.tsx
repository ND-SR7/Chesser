import styled from "styled-components";

const HeaderStyled = styled.header`
  color: blue;
  display: flex;
  justify-content: ${(props) => props.theme.flex.justify};
  background-color: ${(props) => props.theme.colors.base};
  font-style: italic;
  font-weight: ${(props) => props.theme.fontWeights.heavyBold};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export default HeaderStyled;
