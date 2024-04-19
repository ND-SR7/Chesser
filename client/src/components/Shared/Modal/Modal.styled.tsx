import styled from "styled-components";

const ModalStyled = styled.div`
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  padding-top: 20%;
  width: ${(props) => props.theme.widths.full};
  height: ${(props) => props.theme.heights.full};
  overflow: auto;
  background-color: ${(props) => props.theme.colors.backgroundModal};
`;

export default ModalStyled;
