import Piece from "../Piece/Piece";

export type ColumnString = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";
type RowNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
type ColorString = "aliceblue" | "lightblue";

type Field = {
  color: ColorString;
  row: RowNumber;
  column: ColumnString;
  piece?: Piece;
};

export default Field;
