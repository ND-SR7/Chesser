import TurnDisplayStyled from "./TurnDisplay.styled";

interface TurnDisplayProps {
  whiteTurn: boolean;
}

const TurnDisplay = ({whiteTurn}: TurnDisplayProps) => {
  return (
    <TurnDisplayStyled>
      {whiteTurn ? "WHITE TURN ⚪" : "BLACK TURN ⚫"}
    </TurnDisplayStyled>
  );
};

export default TurnDisplay;
