import { sideString } from "../components/Board/Board";

import Field from "../models/Field/Field";
import Piece from "../models/Piece/Piece";

export type LastMove = {
  from: number;
  to: number;
  piece: string;
};

export type ValidMove = {
  valid: boolean;
  enPassantIndex: number;
};

export const isValidMove = (
  fields: Field[],
  movingFrom: Field,
  movingTo: Field,
  selectedPiece: Piece,
  playerSide: sideString,
  lastMove: LastMove | undefined,
  castling: boolean[],
  updateCastling: React.Dispatch<React.SetStateAction<boolean[]>>
): boolean | ValidMove => {
  const fromIndex = fields.indexOf(movingFrom);
  const toIndex = fields.indexOf(movingTo);

  // used for pawn movement; it is only forward and board orientation affects it
  // other pieces move on an axis or circle-like, so no need for adjustment
  const playerSideMultiplier = playerSide === "W" ? 1 : -1;

  const rookMovementValid = (fromIndex: number, toIndex: number): boolean => {
    const moveUp = -8;
    const moveDown = 8;
    const moveLeft = -1;
    const moveRight = 1;
    let moveValid = false;

    let tempPosition = fromIndex;
    // up movement
    while (tempPosition + moveUp >= 0) {
      tempPosition += moveUp;
      if (tempPosition === toIndex) moveValid = true;
      if (fields[tempPosition].piece !== undefined) break;
    }
    tempPosition = fromIndex;

    // down movement
    while (tempPosition + moveDown < fields.length) {
      tempPosition += moveDown;
      if (tempPosition === toIndex) moveValid = true;
      if (fields[tempPosition].piece !== undefined) break;
    }
    tempPosition = fromIndex;

    // left movement
    while (tempPosition % 8 !== 0) {
      tempPosition += moveLeft;
      if (tempPosition === toIndex) moveValid = true;
      if (fields[tempPosition].piece !== undefined) break;
    }
    tempPosition = fromIndex;

    // right movement
    while (tempPosition % 8 !== 7) {
      tempPosition += moveRight;
      if (tempPosition === toIndex) moveValid = true;
      if (fields[tempPosition].piece !== undefined) break;
    }

    // disabling castling for used rook side
    if (moveValid) {
      switch (fields[fromIndex].column + fields[fromIndex].row) {
        case "H1":
          castling[1] = false;
          updateCastling(castling);
          break;
        case "A1":
          castling[2] = false;
          updateCastling(castling);
          break;
        case "H8":
          castling[4] = false;
          updateCastling(castling);
          break;
        case "A8":
          castling[5] = false;
          updateCastling(castling);
          break;
      }
    }

    return moveValid;
  };

  const bishopMovementValid = (fromIndex: number, toIndex: number): boolean => {
    const moveUpLeft = -9;
    const moveUpRight = -7;
    const moveDownLeft = 7;
    const moveDownRight = 9;

    let tempPosition = fromIndex;
    // up-left movement
    while (tempPosition + moveUpLeft >= 0 && (tempPosition % 8 !== 0)) {
      tempPosition += moveUpLeft;
      if (tempPosition === toIndex) return true;
      if (fields[tempPosition].piece !== undefined) break;
    }
    tempPosition = fromIndex;

    // up-right movement
    while (tempPosition + moveUpRight >= 0 && (tempPosition % 8 !== 7)) {
      tempPosition += moveUpRight;
      if (tempPosition === toIndex) return true;
      if (fields[tempPosition].piece !== undefined) break;
    }
    tempPosition = fromIndex;

    // down-left movement
    while (tempPosition + moveDownLeft < fields.length && (tempPosition % 8 !== 0)) {
      tempPosition += moveDownLeft;
      if (tempPosition === toIndex) return true;
      if (fields[tempPosition].piece !== undefined) break;
    }
    tempPosition = fromIndex;

    // down-right movement
    while (tempPosition + moveDownRight < fields.length && (tempPosition % 8 !== 7)) {
      tempPosition += moveDownRight;
      if (tempPosition === toIndex) return true;
      if (fields[tempPosition].piece !== undefined) break;
    }

    return false;
  };

  const knightMovementValid = (fromIndex: number, toIndex: number): boolean => {
    const knightMoves = [-17, -15, -10, -6, 6, 10, 15, 17];

    for (let move of knightMoves) {
      const tempPosition = fromIndex + move;
      if (tempPosition >= 0 && tempPosition < 64) {
        const fromRow = Math.floor(fromIndex / 8);
        const toRow = Math.floor(tempPosition / 8);

        if (Math.abs(fromRow - toRow) <= 2) {
          if (tempPosition === toIndex) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const kingMovementValid = (fromIndex: number, toIndex: number, pieceColor: string): boolean => {
    const kingMoves = [-9, -8, -7, -1, 1, 7, 8, 9];
    const castlingMoves = playerSide === "W" ? [2, -2] : [-2, 2]; // always checking kingside castling first
    const movedPiece = fields[fromIndex].piece;

    const disableCastling = () => {
      if (pieceColor === "w") {
        castling[0] = false;
        updateCastling(castling);
      } else if (pieceColor === "b") {
        castling[3] = false;
        updateCastling(castling);
      }
    };

    // basic movement
    for (let move of kingMoves) {
      const tempPosition = fromIndex + move;
      if (tempPosition >= 0 && tempPosition < 64) {
        if (tempPosition === toIndex) {
          for (let i of kingMoves) {
            if (fields[toIndex + i]?.piece?.PGN === "K" && fields[toIndex + i]?.piece?.id !== movedPiece?.id) {
              return false;
            }
          }
          disableCastling();
          return true;
        }
      }
    }

    // castling
    if (pieceColor === "w" && castling[0]) {
      for (let i = 0; i < 2; i++) {
        const tempPosition = fromIndex + castlingMoves[i];
        if (tempPosition >= 0 && tempPosition < 64) {
          if (tempPosition === toIndex && castling[1+i]) {
            disableCastling();
            return true;
          }
        }
      }
    } else if (pieceColor === "b" && castling[3]) {
      for (let i = 0; i < 2; i++) {
        const tempPosition = fromIndex + castlingMoves[i];
        if (tempPosition >= 0 && tempPosition < 64) {
          if (tempPosition === toIndex && castling[4+i]) {
            disableCastling();
            return true;
          }
        }
      }
    }

    return false;
  };

  const pawnMovementValid = (fromIndex: number, toIndex: number, pieceColor: string, lastMove: LastMove): ValidMove => {
    const moveUp = -8 * playerSideMultiplier;
    const moveDown = 8 * playerSideMultiplier;
    const moveUpLeft = -9 * playerSideMultiplier;
    const moveUpRight = -7 * playerSideMultiplier;
    const moveDownLeft = 7 * playerSideMultiplier;
    const moveDownRight = 9 * playerSideMultiplier;

    let initialRow;
    if (pieceColor === "w") {
      if (playerSide === "W") initialRow = 6;
      else initialRow = 1;
    } else {
      if (playerSide === "W") initialRow = 1;
      else initialRow = 6;
    }

    let enPassantRow;
    if (pieceColor === "w") {
      if (playerSide === "W") enPassantRow = 3;
      else enPassantRow = 4;
    } else {
      if (playerSide === "W") enPassantRow = 4;
      else enPassantRow = 3;
    }

    const enPassantMove = pieceColor === "w" ? 2 * moveDown : 2 * moveUp;

    if (pieceColor === "w") {
      // move up
      if (toIndex === fromIndex + moveUp && fields[toIndex].piece === undefined) {
        return {valid: true, enPassantIndex: -1};
      }
      // move up two
      if (Math.floor(fromIndex / 8) === initialRow) {
        if (toIndex === fromIndex + 2 * moveUp && fields[toIndex].piece === undefined && fields[fromIndex + moveUp].piece === undefined) {
          return {valid: true, enPassantIndex: -1};
        }
      }
      // diagonal capturing
      if (toIndex === fromIndex + moveUpLeft || toIndex === fromIndex + moveUpRight) {
        if (fields[toIndex].piece) {
          return {valid: true, enPassantIndex: -1};
        }
      }
      // en passant
      if (Math.floor(fromIndex / 8) === enPassantRow) {
        if (toIndex === fromIndex + moveUpLeft || toIndex === fromIndex + moveUpRight) {
          if (lastMove.piece === "" && lastMove.to === lastMove.from + enPassantMove && toIndex === lastMove.to + moveUp) {
            return {valid: true, enPassantIndex: lastMove.to};
          }
        }
      }
    } else {
      if (toIndex === fromIndex + moveDown && fields[toIndex].piece === undefined) {
        return {valid: true, enPassantIndex: -1};
      }
      if (Math.floor(fromIndex / 8) === initialRow) {
        if (toIndex === fromIndex + 2 * moveDown && fields[toIndex].piece === undefined && fields[fromIndex + moveDown].piece === undefined) {
          return {valid: true, enPassantIndex: -1};
        }
      }
      if (toIndex === fromIndex + moveDownLeft || toIndex === fromIndex + moveDownRight) {
        if (fields[toIndex].piece) {
          return {valid: true, enPassantIndex: -1};
        }
      }
      if (Math.floor(fromIndex / 8) === enPassantRow) {
        if (toIndex === fromIndex + moveDownLeft || toIndex === fromIndex + moveDownRight) {
          if (lastMove.piece === "" && lastMove.to === lastMove.from + enPassantMove && toIndex === lastMove.to + moveDown) {
            return {valid: true, enPassantIndex: lastMove.to};
          }
        }
      }
    }

    return {valid: false, enPassantIndex: -1};;
  };

  const pieceColor = selectedPiece!.id.charAt(1);

  if (selectedPiece!.PGN === "R") {
    return rookMovementValid(fromIndex, toIndex);
  } else if (selectedPiece!.PGN === "B") {
    return bishopMovementValid(fromIndex, toIndex);
  } else if (selectedPiece!.PGN === "Q") {
    return rookMovementValid(fromIndex, toIndex) || bishopMovementValid(fromIndex, toIndex);
  } else if (selectedPiece!.PGN === "N") {
    return knightMovementValid(fromIndex, toIndex);
  } else if (selectedPiece!.PGN === "K") {
    return kingMovementValid(fromIndex, toIndex, pieceColor);
  } else if (selectedPiece!.PGN === "") {
    return pawnMovementValid(fromIndex, toIndex, pieceColor, lastMove!);
  }
  return false;
};
