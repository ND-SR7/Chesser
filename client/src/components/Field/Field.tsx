import PieceModel from '../../models/Piece/Piece';
import PieceStyled from '../Piece/Piece.styled';
import FieldStyled from './Field.styled';

export type columnString = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";

interface FieldProps {
  row: number;
  column: columnString;
  piece?: PieceModel;
}

const Field = ({row, column, piece}: FieldProps) => {
  return (
    <FieldStyled id={column + row}>
      <PieceStyled src={piece?.imgSrc} />
    </FieldStyled>
  );
};

export default Field;
