import PieceStyled from './Piece.styled';

type pieceID = 
  "r1" | "r2" | "n1" | "n2" | "b1" | "b2" | "q" | "k" |
  "p1" | "p2" | "p3" | "p4" | "p5" | "p6" | "p7" | "p8" |
  "R1" | "R2" | "N1" | "N2" | "B1" | "B2" | "Q" | "K" |
  "P1" | "P2" | "P3" | "P4" | "P5" | "P6" | "P7" | "P8";

type pieceFENString = "r" | "n" | "b" | "q" | "k" | "p" | "R" | "N" | "B" | "Q" | "K" | "P";
type piecePGNString = "K" | "Q" | "R" | "B" | "N" | ""; // empty string for pawn movement

interface PieceProps {
  id: pieceID;
  imgSrc: string;
  FEN: pieceFENString;
  PGN: piecePGNString;
  getFEN: (id: pieceID, FEN: pieceFENString) => void;
  getPGN: (id: pieceID, PGN: piecePGNString) => void;
}

const Piece = ({id, imgSrc, FEN, PGN, getFEN, getPGN}: PieceProps) => {

  const handleGetFEN = () => {
    getFEN(id, FEN);
  };

  const handleGetPGN = () => {
    getPGN(id, PGN);
  };

  return (
    <PieceStyled 
      id={id} 
      onClick={() => { handleGetFEN(); handleGetPGN() }}
      src={imgSrc} />
  );
};

export default Piece;
