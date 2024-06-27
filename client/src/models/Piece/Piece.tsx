type PieceID =
  `rb${number}` | `nb${number}` | `bb${number}` | `qb${number}` | `kb${number}` | `pb${number}` |
  `rw${number}` | `nw${number}` | `bw${number}` | `qw${number}` | `kw${number}` | `pw${number}`;

type PieceFENString = "r" | "n" | "b" | "q" | "k" | "p" | "R" | "N" | "B" | "Q" | "K" | "P";
type PiecePGNString = "K" | "Q" | "R" | "B" | "N" | ""; // empty string for pawn movement

type Piece = {
  id: PieceID;
  imgSrc: string;
  FEN: PieceFENString;
  PGN: PiecePGNString;
};

export default Piece;
