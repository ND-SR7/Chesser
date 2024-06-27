import { SideString } from "../components/Board/Board";
import Field from "../models/Field/Field";
import Piece from "../models/Piece/Piece";
import { LastMove } from "./ValidMoveService";

export type CheckStatus = {
  check: boolean;
  multipleCheck: boolean;
  checkmate: boolean;
};

export const getCheckStatus = (
  fields: Field[],
  movedPiecePosition: number,
  playerSide: SideString,
  lastMove: LastMove | undefined,
  response: boolean
): CheckStatus => {
  const movedPiece = fields[movedPiecePosition].piece!;
  const movedPieceColor = movedPiece.id.charAt(1);
  
  const checkStatus: CheckStatus = {
    check: false,
    multipleCheck: false,
    checkmate: false
  };

  let kingPosition = -1;

  if (movedPieceColor === "w") {
    const kingField = fields.find(field => field.piece?.id.includes("kb"))!;
    kingPosition = fields.indexOf(kingField);
  } else {
    const kingField = fields.find(field => field.piece?.id.includes("kw"))!;
    kingPosition = fields.indexOf(kingField);
  }

  const attackedFields: number[] = [];

  const addAttackedField = (index: number) => {
    // adding field if not contained or if it's attacking a king field
    // multiple king field appearances are used to check for multiple check
    if (!attackedFields.includes(index) || fields[index].piece?.PGN === "K") {
      attackedFields.push(index);
    }
  };

  fields.forEach((field, fromIndex) => {
    const piece = field.piece;
    if (piece?.id.charAt(1) === movedPieceColor) {

      const moveRook = (fromIndex: number) => {
        const moves = [-8, 8, -1, 1];

        moves.forEach((move) => {
          let tempPosition = fromIndex;
          while (true) {
            tempPosition += move;
            if (tempPosition < 0 || tempPosition >= 64) break;
            if (move === -1 && tempPosition % 8 === 7) break;
            if (move === 1 && tempPosition % 8 === 0) break;
            addAttackedField(tempPosition);
            if (fields[tempPosition].piece) break;
          }
        });
      };

      const moveBishop = (fromIndex: number) => {
        const moves = [-9, -7, 7, 9];
        
        moves.forEach((move) => {
          let tempPosition = fromIndex;
          while (true) {
            tempPosition += move;
            if (tempPosition < 0 || tempPosition >= 64) break;
            if ((move === -9 || move === 7) && tempPosition % 8 === 7) break;
            if ((move === -7 || move === 9) && tempPosition % 8 === 0) break;
            addAttackedField(tempPosition);
            if (fields[tempPosition].piece) break;
          }
        });
      };

      const moveKnight = (fromIndex: number) => {
        const moves = [-17, -15, -10, -6, 6, 10, 15, 17];

        moves.forEach((move) => {
          const tempPosition = fromIndex + move;
          if (tempPosition >= 0 && tempPosition < 64) {
            const fromRow = Math.floor(fromIndex / 8);
            const toRow = Math.floor(tempPosition / 8);
            if (Math.abs(fromRow - toRow) <= 2) {
              addAttackedField(tempPosition);
            }
          }
        });
      };

      const moveKing = (fromIndex: number) => {
        const moves = [-9, -8, -7, -1, 1, 7, 8, 9];

        moves.forEach((move) => {
          const tempPosition = fromIndex + move;
          if (tempPosition >= 0 && tempPosition < 64) {
            addAttackedField(tempPosition);
          }
        });
      };

      const movePawn = (fromIndex: number, pieceColor: string) => {
        const moveUpLeft = -9 * (pieceColor === "w" ? 1 : -1);
        const moveUpRight = -7 * (pieceColor === "w" ? 1 : -1);

        if (fromIndex + moveUpLeft >= 0 && fromIndex + moveUpLeft < 64) {
          addAttackedField(fromIndex + moveUpLeft);
        }
        if (fromIndex + moveUpRight >= 0 && fromIndex + moveUpRight < 64) {
          addAttackedField(fromIndex + moveUpRight);
        }
      };

      switch (piece.PGN) {
        case "R":
          moveRook(fromIndex);
          break;
        case "B":
          moveBishop(fromIndex);
          break;
        case "Q":
          moveRook(fromIndex);
          moveBishop(fromIndex);
          break;
        case "N":
          moveKnight(fromIndex);
          break;
        case "K":
          moveKing(fromIndex);
          break;
        case "":
          movePawn(fromIndex, piece.id.charAt(1));
          break;
      }
    }
  });

  if (attackedFields.includes(kingPosition)) {
    checkStatus.check = true;
    
    let kingAttacks = 0;
    attackedFields.forEach(fieldIndex => {
      if (fieldIndex === kingPosition) kingAttacks++;
    });

    // if multiple checks and king can't escape
    // it's checkmate
    if (kingAttacks > 1) {
      checkStatus.multipleCheck = true;

      const kingMoves = [-9, -8, -7, -1, 1, 7, 8, 9];
      let checkmate = true;

      kingMoves.forEach(move => {
        const newKingPosition = kingPosition + move;
        if (newKingPosition >= 0 &&
            newKingPosition < 64 &&
            !attackedFields.includes(newKingPosition) &&
            (!fields[newKingPosition].piece || fields[newKingPosition].piece?.id.charAt(1) === movedPieceColor)
        ) {
          checkmate = false;
        }
      });

      checkStatus.checkmate = checkmate;
      return checkStatus;
    }

    // getting check fields and finding a piece checking
    const directions = [-9, -8, -7, -1, 1, 7, 8, 9];
    const knightJumps = [-17, -15, -10, -6, 6, 10, 15, 17];

    let checkFields: Field[] = [];
    directions.forEach(direction => {
      let movement = 0;
      while (kingPosition + movement + direction >= 0 && kingPosition + movement + direction < 64) {
        if (fields[kingPosition + movement + direction].piece === undefined) {
          checkFields.push(fields[kingPosition + movement + direction]);
          movement += direction;
          continue;
        } else if (fields[kingPosition + movement + direction].piece!.id.charAt(1) === movedPieceColor) {
          checkFields.push(fields[kingPosition + movement + direction]);
          break;
        } else {
          break;
        }
      }
    });

    let pieceFound = false;
    checkFields.forEach(field => {
      if (field.piece !== undefined)
        pieceFound = true;
    });

    // if no piece checking in direction, check knight jumps
    if (!pieceFound) {
      knightJumps.forEach(jump => {
        const field = fields[kingPosition + jump];
        if (field !== undefined && field.piece?.PGN === "N" && field.piece.id.charAt(1) === movedPieceColor) {
          checkFields.push(fields[kingPosition + jump]);
          pieceFound = true;
        }
      });
    }

    // this should never happen
    if (!pieceFound) {
      console.error("King is checked but no checking pieces found");
      return checkStatus;
    }

    // check if there is a valid move
    // only if not checking the response to check
    if (!response) {
      let validMoveExists = false;

      fields.forEach(field => {
        if (field.piece === undefined || field.piece.id.charAt(1) === movedPieceColor) return;

        checkFields.forEach(checkField => {
          const validMove = isValidMove(fields, field, checkField, field.piece!, playerSide, lastMove!);
          if (validMove) validMoveExists = true;
        });
      });

      if (!validMoveExists) checkStatus.checkmate = true;
    }
  }

  return checkStatus;
};

// adjust fields as if the piece has been moved
// call getCheckStatus() to see if the check was resolved
export const isResponseToCheck = (fields: Field[], fromIndex: number, toIndex: number): boolean => {
  return false;
};

// modified function from ValidMoveService
// without unnecessary logic
const isValidMove = (
  fields: Field[],
  from: Field,
  to: Field,
  piece: Piece,
  playerSide: SideString,
  lastMove: LastMove
): boolean => {
  const fromIndex = fields.indexOf(from);
  const toIndex = fields.indexOf(to);

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
    const movedPiece = fields[fromIndex].piece;

    for (let move of kingMoves) {
      const tempPosition = fromIndex + move;
      if (tempPosition >= 0 && tempPosition < 64) {
        if (tempPosition === toIndex) {
          for (let i of kingMoves) {
            if (fields[toIndex + i]?.piece?.PGN === "K" && fields[toIndex + i]?.piece?.id !== movedPiece?.id) {
              return false;
            }
          }
          return true;
        }
      }
    }

    return false;
  };

  const pawnMovementValid = (fromIndex: number, toIndex: number, pieceColor: string, lastMove: LastMove): boolean => {
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
        return true;
      }
      // move up two
      if (Math.floor(fromIndex / 8) === initialRow) {
        if (toIndex === fromIndex + 2 * moveUp && fields[toIndex].piece === undefined && fields[fromIndex + moveUp].piece === undefined) {
          return true;
        }
      }
      // diagonal capturing
      if (toIndex === fromIndex + moveUpLeft || toIndex === fromIndex + moveUpRight) {
        if (fields[toIndex].piece) {
          return true;
        }
      }
      // en passant
      if (Math.floor(fromIndex / 8) === enPassantRow) {
        if (toIndex === fromIndex + moveUpLeft || toIndex === fromIndex + moveUpRight) {
          if (lastMove.piece === "" && lastMove.to === lastMove.from + enPassantMove && toIndex === lastMove.to + moveUp) {
            return true;
          }
        }
      }
    } else {
      if (toIndex === fromIndex + moveDown && fields[toIndex].piece === undefined) {
        return true;
      }
      if (Math.floor(fromIndex / 8) === initialRow) {
        if (toIndex === fromIndex + 2 * moveDown && fields[toIndex].piece === undefined && fields[fromIndex + moveDown].piece === undefined) {
          return true;
        }
      }
      if (toIndex === fromIndex + moveDownLeft || toIndex === fromIndex + moveDownRight) {
        if (fields[toIndex].piece) {
          return true;
        }
      }
      if (Math.floor(fromIndex / 8) === enPassantRow) {
        if (toIndex === fromIndex + moveDownLeft || toIndex === fromIndex + moveDownRight) {
          if (lastMove.piece === "" && lastMove.to === lastMove.from + enPassantMove && toIndex === lastMove.to + moveDown) {
            return true;
          }
        }
      }
    }

    return false;
  };

  const pieceColor = piece.id.charAt(1);

  if (piece.PGN === "R") {
    return rookMovementValid(fromIndex, toIndex);
  } else if (piece!.PGN === "B") {
    return bishopMovementValid(fromIndex, toIndex);
  } else if (piece!.PGN === "Q") {
    return rookMovementValid(fromIndex, toIndex) || bishopMovementValid(fromIndex, toIndex);
  } else if (piece!.PGN === "N") {
    return knightMovementValid(fromIndex, toIndex);
  } else if (piece!.PGN === "K") {
    return kingMovementValid(fromIndex, toIndex, pieceColor);
  } else if (piece!.PGN === "") {
    return pawnMovementValid(fromIndex, toIndex, pieceColor, lastMove!);
  }

  return false;
}
