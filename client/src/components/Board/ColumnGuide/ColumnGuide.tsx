import { sideString } from "../Board"
import ColumnGuideStyled from "./ColumnGuide.styled";

interface ColumnGuideProps {
  side: sideString;
}

const ColumnGuide = ({side} : ColumnGuideProps) => {
  const setLetters = () => {
    return (side === "WHITE" ?
      <><p>A</p><p>B</p><p>C</p><p>D</p><p>E</p><p>F</p><p>G</p><p>H</p></> :
      <><p>H</p><p>G</p><p>F</p><p>E</p><p>D</p><p>C</p><p>B</p><p>A</p></>
    );
  };

  return (
    <ColumnGuideStyled>
      {setLetters()}
    </ColumnGuideStyled>
  );
};

export default ColumnGuide;