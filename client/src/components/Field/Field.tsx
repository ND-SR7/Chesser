import PieceStyled from '../Piece/Piece.styled';
import FieldStyled from './Field.styled';

import Piece from '../../models/Piece/Piece';
import { columnString } from '../../models/Field/Field';

interface FieldProps {
  row: number;
  column: columnString;
  piece?: Piece;
  onClick: (clickedOn: Piece | string) => void;
}

const Field = ({row, column, piece, onClick}: FieldProps) => {
  
  const fieldClicked = (clickedOn: Piece | string) => {
    onClick(clickedOn);
  };

  return (
    <FieldStyled id={column + row} onClick={() => fieldClicked(piece ? piece : column + row)}>
      <PieceStyled src={piece?.imgSrc} />
    </FieldStyled>
  );
};

export default Field;
