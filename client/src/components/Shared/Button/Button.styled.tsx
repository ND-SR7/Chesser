import styled from "styled-components";

export const DisabledStyle = {
  backgroundColor: "lightgray",
  border: "none",
  cursor: "not-allowed"
};

const ButtonStyled = styled.button`
  margin: ${(props) => props.theme.margins.standard};
  padding: 6px 12px;
  background-color: ${(props) => props.theme.colors.accent};
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.medium};
  color: ${(props) => props.theme.colors.background};
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    ${DisabledStyle}
  }
`;

export default ButtonStyled;
