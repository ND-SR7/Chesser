import styled from "styled-components";

const LogoStyled = styled.img`
  height: 64px;
  margin: auto 0px;
  border-radius: ${(props) => props.theme.borderRadius.big};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 0 10px rgba(0, 0, 255, 0.2);
  }
`;

export default LogoStyled;
