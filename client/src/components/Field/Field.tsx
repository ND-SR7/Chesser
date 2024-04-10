import PieceModel from '../../models/Piece/Piece';
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
      {piece ? piece.id : column + row}
    </FieldStyled>
  );
};

export default Field;
