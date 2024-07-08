import Field from "../../models/Field/Field";
import { whiteSideSort } from "./PieceSortService";
import { LastMove } from "./ValidMoveService";

export const buildFen = (fields: Field[], castling: boolean[], lastMove: LastMove | undefined, whiteTurn: boolean): string => {
  const castlingFEN = (): string => {
    let temp = "";
    
    if (fields[60].piece?.FEN === "K" && castling[0]) {
      if (fields[63].piece?.FEN === "R" && castling[1]) temp += "K";
      if (fields[56].piece?.FEN === "R" && castling[2]) temp += "Q";
    }
    if (fields[4].piece?.FEN === "k" && castling[3]) {
      if (fields[7].piece?.FEN === "r" && castling[4]) temp += "k";
      if (fields[0].piece?.FEN === "r" && castling[5]) temp += "q";
    }

    if (temp === "") temp = "-";

    return ` ${temp} `;
  };

  const enPassantFen = (): string => {
    const enPassantPossible = (): boolean => {
      return lastMove?.piece === "" && (
        (whiteTurn && (lastMove.to - lastMove.from) === 16 && Math.floor(lastMove.to / 8) === 3) ||
        (!whiteTurn && (lastMove.from - lastMove.to) === 16 && Math.floor(lastMove.to / 8) === 4)
      );
    };

    if (lastMove && enPassantPossible()) {
      const enPassantIndex = (lastMove.from + lastMove.to) / 2;
      const enPassantField = fields[enPassantIndex];
      return enPassantField.column.toLowerCase() + enPassantField.row;
    }
    return "-";
  };

  fields.sort(whiteSideSort);

  let fen = "";
  let emptySpaceCounter = 0;
  let newRowCounter = 0;

  fields.forEach(field => {
    if (field.piece) {
      if (emptySpaceCounter > 0) fen += emptySpaceCounter;
      fen += field.piece.FEN;
      
      emptySpaceCounter = 0;
      newRowCounter++;
    } else {
      emptySpaceCounter++;
      newRowCounter++;
    }

    if (emptySpaceCounter === 8) {
      fen += emptySpaceCounter;
      emptySpaceCounter = 0;
    }

    if (newRowCounter === 8) {
      if (emptySpaceCounter > 0) fen += emptySpaceCounter;
      emptySpaceCounter = 0;
      
      fen += "/";
      newRowCounter = 0;
    } 
  });

  fen = fen.substring(0, fen.length - 1);

  whiteTurn ? fen += " w" : fen += " b";

  fen += castlingFEN();
  fen += enPassantFen();
  fen += ` 0 ${whiteTurn ? "0" : "1"}`;

  return fen;
};
