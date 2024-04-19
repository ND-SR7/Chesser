import styled from "styled-components";

const ModalContentBox = styled.div`
  background-color: ${(props) => props.theme.colors.background};
  margin: auto;
  padding: ${(props) => props.theme.paddings.large};
  border: 1px solid #888;
  width: 80%;
  position: relative;
`;

export default ModalContentBox;
