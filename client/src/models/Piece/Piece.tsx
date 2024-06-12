type pieceID =
  `rb${number}` | `nb${number}` | `bb${number}` | `qb${number}` | `kb${number}` | `pb${number}` |
  `rw${number}` | `nw${number}` | `bw${number}` | `qw${number}` | `kw${number}` | `pw${number}`;

type pieceFENString = "r" | "n" | "b" | "q" | "k" | "p" | "R" | "N" | "B" | "Q" | "K" | "P";
type piecePGNString = "K" | "Q" | "R" | "B" | "N" | ""; // empty string for pawn movement

type Piece = {
  id: pieceID;
  imgSrc: string;
  FEN: pieceFENString;
  PGN: piecePGNString;
};

export default Piece;
