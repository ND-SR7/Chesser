import styled from "styled-components";

const ColumnGuideStyled = styled.div`
  background-color: ${(props) => props.theme.colors.background} !important;
  width: 28vw;
  display: flex;
  justify-content: space-around;
  margin-left: 1px;

  @media (max-width: 700px) {
    display: none;
  }
`;

export default ColumnGuideStyled;
