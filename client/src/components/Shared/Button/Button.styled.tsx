import styled from "styled-components";

export const DisabledStyle = {
  backgroundColor: "lightgray",
  border: "none",
  cursor: "not-allowed"
};

const ButtonStyled = styled.button`
  margin: ${(props) => props.theme.margins.standard};
  background-color: ${(props) => props.theme.colors.accent};
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.small};
  padding: ${(props) => props.theme.paddings.standard};
  color: ${(props) => props.theme.colors.background};
  cursor: pointer;
`;

export default ButtonStyled;
