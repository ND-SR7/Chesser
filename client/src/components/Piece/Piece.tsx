import PieceStyled from './Piece.styled';

type pieceID = 
  "rb1" | "rb2" | "nb1" | "nb2" | "bb1" | "bb2" | "qb" | "kb" |
  "pb1" | "pb2" | "pb3" | "pb4" | "pb5" | "pb6" | "pb7" | "pb8" |
  "rw1" | "rw2" | "nw1" | "nw2" | "bw1" | "bw2" | "qw" | "kw" |
  "pw1" | "pw2" | "pw3" | "pw4" | "pw5" | "pw6" | "pw7" | "pw8";

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
