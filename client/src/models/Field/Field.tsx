import Piece from "../Piece/Piece";

export type ColumnString = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";

type Field = {
  row: number;
  column: ColumnString;
  piece?: Piece;
};

export default Field;
