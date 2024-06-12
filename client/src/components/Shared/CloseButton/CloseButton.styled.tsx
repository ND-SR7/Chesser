import styled from "styled-components";

const CloseButtonStyled = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: ${(props) => props.theme.fontSizes.big};
  color: ${(props) => props.theme.colors.accent};
  position: absolute;
  top: 10px;
  right: 10px;
`;

export default CloseButtonStyled;
