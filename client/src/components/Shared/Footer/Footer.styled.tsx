import styled from "styled-components";

const FooterStyled = styled.footer`
  color: ${(props) => props.theme.colors.accent};
  background-color: ${(props) => props.theme.colors.base};
  font-weight: ${(props) => props.theme.fontWeights.semiBold};
  font-style: italic;
  margin-top: auto;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
`;

export default FooterStyled;
