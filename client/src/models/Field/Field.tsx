import Piece from "../Piece/Piece";

type Field = {
  row: number;
  column: string;
  piece?: Piece;
};

export default Field;
