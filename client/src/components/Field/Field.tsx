import PieceModel from '../../models/Piece/Piece';
import PieceStyled from '../Piece/Piece.styled';
import FieldStyled from './Field.styled';

export type columnString = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";

interface FieldProps {
  row: number;
  column: columnString;
  piece?: PieceModel;
  onClick: (clickedOn: PieceModel | string) => void;
}

const Field = ({row, column, piece, onClick}: FieldProps) => {
  
  const fieldClicked = (clickedOn: PieceModel | string) => {
    onClick(clickedOn);
  }

  return (
    <FieldStyled id={column + row} onClick={() => fieldClicked(piece ? piece : column + row)}>
      <PieceStyled src={piece?.imgSrc} />
    </FieldStyled>
  );
};

export default Field;
