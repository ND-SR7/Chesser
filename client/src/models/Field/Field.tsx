import Piece from "../Piece/Piece";

export type ColumnString = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";
type RowNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

type Field = {
  row: RowNumber;
  column: ColumnString;
  piece?: Piece;
};

export default Field;
