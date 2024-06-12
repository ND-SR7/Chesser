import Piece from "../Piece/Piece";

export type columnString = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";

type Field = {
  row: number;
  column: columnString;
  piece?: Piece;
};

export default Field;
