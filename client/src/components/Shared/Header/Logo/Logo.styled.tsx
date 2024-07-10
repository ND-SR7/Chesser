import styled from "styled-components";

const LogoStyled = styled.img`
  height: 64px;
  margin: auto 0px;
  border-radius: ${(props) => props.theme.borderRadius.big};
  cursor: pointer;
`;

export default LogoStyled;
