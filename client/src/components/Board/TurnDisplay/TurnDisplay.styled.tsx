import styled from "styled-components";

const TurnDisplayStyled = styled.div`
  color: ${(props) => props.theme.colors.accent};
  font-size: ${(props) => props.theme.fontSizes.big};
  font-weight: ${(props) => props.theme.fontWeights.bold};
`;

export default TurnDisplayStyled;
