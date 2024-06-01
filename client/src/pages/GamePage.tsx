import { useEffect, useState } from "react";

import Board from "../components/Board/Board";
import Button from "../components/Shared/Button/Button";
import Modal from "../components/Shared/Modal/Modal";
import TurnDisplay from "../components/Board/TurnDisplay/TurnDisplay";

import FieldModel from "../models/Field/Field";
import PieceModel from "../models/Piece/Piece";

import useSound from "use-sound";
import moveSound from "../sounds/move.mp3";
import checkSound from "../sounds/move-check.mp3";
import captureSound from "../sounds/capture.mp3";
import castleSound from "../sounds/castle.mp3";
import promoteSound from "../sounds/promote.mp3";

import bishopWhite from "../assets/bw.png";
import kingWhite from "../assets/kw.png";
import knightWhite from "../assets/nw.png";
import pawnWhite from "../assets/pw.png";
import queenWhite from "../assets/qw.png";
import rookWhite from "../assets/rw.png";
import bishopBlack from "../assets/bb.png";
import kingBlack from "../assets/kb.png";
import knightBlack from "../assets/nb.png";
import pawnBlack from "../assets/pb.png";
import queenBlack from "../assets/qb.png";
import rookBlack from "../assets/rb.png";

type LastMove = {
  from: number;
  to: number;
  piece: string;
};

type ValidMove = {
  valid: boolean;
  enPassantIndex: number;
};

const GamePage = () => {
  const [playMoveSound] = useSound(moveSound);
  const [playMoveCheckSound] = useSound(checkSound);
  const [playCaptureSound] = useSound(captureSound);
  const [playCastleSound] = useSound(castleSound);
  const [playPromoteSound] = useSound(promoteSound);

  const [showSideSelectModal, setSideSelectModal] = useState(false);
  const closeSelectModal = () => setSideSelectModal(false);
  const whiteBtn: JSX.Element = <Button key="btnWhite" buttonType="button" label="White" onClick={() => setupBoard("W")} />
  const blackBtn: JSX.Element = <Button key="btnBlack" buttonType="button" label="Black" onClick={() => setupBoard("B")} />

  const [playerSide, setPlayerSide] = useState("");
  const [whiteTurn, setWhiteTurn] = useState(true);

  const [turnCounter, setTurnCounter] = useState(1);
  const [PGN, setPGN] = useState("");
  const [showExportPGNModal, setExportPGNModal] = useState(false);

  const [lastMove, setLastMove] = useState<LastMove>();
  const [halfMove, setHalfMove] = useState<number>(0);

  const [showExportFENModal, setExportFENModal] = useState(false);
  const [showImportFENModal, setImportFENModal] = useState(false);
  const [disableFenBtn, setDisableFenBtn] = useState(false);
  const fenInput = <input id="fenInput" key="fenInput" type="text" maxLength={87} size={60} />
  const fenConfirmBtn = <Button key="importFenBtn" buttonType="button" label="Confirm" onClick={() => setupFEN()} />

  const [selectedPiece, setSelectedPiece] = useState<PieceModel | null>(null);
  const [selectedFieldColor, setSelectedFieldColor] = useState(""); // visualizing clicked-on field

  const [inputDisabled, setInputDisabled] = useState(false);
  const [showEndGameModal, setEndGameModal] = useState(false);
  const endGameModalContent = (
    <div>
      <p><b>PGN:</b></p>
      <p>{PGN}</p>
      <Button buttonType="button" label="Play Again" onClick={() => window.location.reload()} />
    </div>
  );

  const [showPromotionModal, setPromotionModal] = useState(false);
  const promotionModalContent = (
    <div>
      <p><b>Select promotion type:</b></p>
      <Button buttonType="button" label="Queen" onClick={() => promotePiece("Q")} />
      <Button buttonType="button" label="Knight" onClick={() => promotePiece("N")} />
      <Button buttonType="button" label="Rook" onClick={() => promotePiece("R")} />
      <Button buttonType="button" label="Bishop" onClick={() => promotePiece("B")} />
    </div>
  );
  
  const [fields, setFields] = useState<FieldModel[]>([
    {row: 8, column: "A"}, {row: 8, column: "B"}, {row: 8, column: "C"}, {row: 8, column: "D"},
    {row: 8, column: "E"}, {row: 8, column: "F"}, {row: 8, column: "G"}, {row: 8, column: "H"},
    {row: 7, column: "A"}, {row: 7, column: "B"}, {row: 7, column: "C"}, {row: 7, column: "D"},
    {row: 7, column: "E"}, {row: 7, column: "F"}, {row: 7, column: "G"}, {row: 7, column: "H"},
    {row: 6, column: "A"}, {row: 6, column: "B"}, {row: 6, column: "C"}, {row: 6, column: "D"},
    {row: 6, column: "E"}, {row: 6, column: "F"}, {row: 6, column: "G"}, {row: 6, column: "H"},
    {row: 5, column: "A"}, {row: 5, column: "B"}, {row: 5, column: "C"}, {row: 5, column: "D"},
    {row: 5, column: "E"}, {row: 5, column: "F"}, {row: 5, column: "G"}, {row: 5, column: "H"},
    {row: 4, column: "A"}, {row: 4, column: "B"}, {row: 4, column: "C"}, {row: 4, column: "D"},
    {row: 4, column: "E"}, {row: 4, column: "F"}, {row: 4, column: "G"}, {row: 4, column: "H"},
    {row: 3, column: "A"}, {row: 3, column: "B"}, {row: 3, column: "C"}, {row: 3, column: "D"},
    {row: 3, column: "E"}, {row: 3, column: "F"}, {row: 3, column: "G"}, {row: 3, column: "H"},
    {row: 2, column: "A"}, {row: 2, column: "B"}, {row: 2, column: "C"}, {row: 2, column: "D"},
    {row: 2, column: "E"}, {row: 2, column: "F"}, {row: 2, column: "G"}, {row: 2, column: "H"},
    {row: 1, column: "A"}, {row: 1, column: "B"}, {row: 1, column: "C"}, {row: 1, column: "D"},
    {row: 1, column: "E"}, {row: 1, column: "F"}, {row: 1, column: "G"}, {row: 1, column: "H"}
  ]);

  useEffect(() => {
    setSideSelectModal(true);
  }, []);

  const pieces: PieceModel[] = [
    { id: "rw1", imgSrc: rookWhite, FEN: "R", PGN: "R" },
    { id: "nw1", imgSrc: knightWhite, FEN: "N", PGN: "N" },
    { id: "bw1", imgSrc: bishopWhite, FEN: "B", PGN: "B" },
    { id: "kw", imgSrc: kingWhite, FEN: "K", PGN: "K" },
    { id: "qw", imgSrc: queenWhite, FEN: "Q", PGN: "Q" },
    { id: "bw2", imgSrc: bishopWhite, FEN: "B", PGN: "B" },
    { id: "nw2", imgSrc: knightWhite, FEN: "N", PGN: "N" },
    { id: "rw2", imgSrc: rookWhite, FEN: "R", PGN: "R" },
    { id: "pw1", imgSrc: pawnWhite, FEN: "P", PGN: "" },
    { id: "pw2", imgSrc: pawnWhite, FEN: "P", PGN: "" },
    { id: "pw3", imgSrc: pawnWhite, FEN: "P", PGN: "" },
    { id: "pw4", imgSrc: pawnWhite, FEN: "P", PGN: "" },
    { id: "pw5", imgSrc: pawnWhite, FEN: "P", PGN: "" },
    { id: "pw6", imgSrc: pawnWhite, FEN: "P", PGN: "" },
    { id: "pw7", imgSrc: pawnWhite, FEN: "P", PGN: "" },
    { id: "pw8", imgSrc: pawnWhite, FEN: "P", PGN: "" },
    { id: "pb1", imgSrc: pawnBlack, FEN: "p", PGN: "" },
    { id: "pb2", imgSrc: pawnBlack, FEN: "p", PGN: "" },
    { id: "pb3", imgSrc: pawnBlack, FEN: "p", PGN: "" },
    { id: "pb4", imgSrc: pawnBlack, FEN: "p", PGN: "" },
    { id: "pb5", imgSrc: pawnBlack, FEN: "p", PGN: "" },
    { id: "pb6", imgSrc: pawnBlack, FEN: "p", PGN: "" },
    { id: "pb7", imgSrc: pawnBlack, FEN: "p", PGN: "" },
    { id: "pb8", imgSrc: pawnBlack, FEN: "p", PGN: "" },
    { id: "rb1", imgSrc: rookBlack, FEN: "r", PGN: "R" },
    { id: "nb1", imgSrc: knightBlack, FEN: "n", PGN: "N" },
    { id: "bb1", imgSrc: bishopBlack, FEN: "b", PGN: "B" },
    { id: "kb", imgSrc: kingBlack, FEN: "k", PGN: "K" },
    { id: "qb", imgSrc: queenBlack, FEN: "q", PGN: "Q" },
    { id: "bb2", imgSrc: bishopBlack, FEN: "b", PGN: "B" },
    { id: "nb2", imgSrc: knightBlack, FEN: "n", PGN: "N" },
    { id: "rb2", imgSrc: rookBlack, FEN: "r", PGN: "R" }
  ];

  // used for building and parsing FEN string
  // it is top to bottom, from white perspective
  const whiteSideSort = (a: FieldModel, b: FieldModel) => {
    if (a.row !== b.row) {
        return b.row - a.row;
    }
    return a.column.localeCompare(b.column);
  };

  const exportFEN = () => {
    const castlingFEN = (): string => {
      let temp = "";
      
      if (fields[60].piece?.FEN === "K") {
        if (fields[63].piece?.FEN === "R") temp += "K";
        if (fields[56].piece?.FEN === "R") temp += "Q";
      }
      if (fields[4].piece?.FEN === "k") {
        if (fields[7].piece?.FEN === "r") temp += "k";
        if (fields[0].piece?.FEN === "r") temp += "q";
      }

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
    fen += ` ${halfMove} ` + turnCounter;

    return <p>{fen}</p>;
  };

  // Test FEN: rnbqkbnr/pp1p1ppp/8/2pPp3/8/8/PPP1PPPP/RNBQKBNR w KQkq c6 0 3
  const setupFEN = () => {
    const fenInputElement = document.getElementById("fenInput") as HTMLInputElement | null;
    const fen = fenInputElement?.value.trim() || "";

    if (fen !== "") {
      try {
        let temp = [...fields];
        temp.sort(whiteSideSort);

        // clearing the board
        temp.forEach(field => field.piece = undefined);
        
        // setting up the board
        const boardFEN = fen.split(" ")[0];
        let fieldIndex = 0;
        let pieceIdCounter = 0;

      for (let i = 0; i < boardFEN.length; i++) {
        const char = boardFEN[i];
        let piece: PieceModel | undefined = undefined;

        switch (char) {
          case "r":
            piece = {id: `rb${pieceIdCounter++}`, PGN: "R", FEN: "r", imgSrc: rookBlack};
            break;
          case "n":
            piece = {id: `nb${pieceIdCounter++}`, PGN: "N", FEN: "n", imgSrc: knightBlack};
            break;
          case "b":
            piece = {id: `bb${pieceIdCounter++}`, PGN: "B", FEN: "b", imgSrc: bishopBlack};
            break;
          case "q":
            piece = {id: `qb${pieceIdCounter++}`, PGN: "Q", FEN: "q", imgSrc: queenBlack};
            break;
          case "k":
            piece = {id: `kb${pieceIdCounter++}`, PGN: "K", FEN: "k", imgSrc: kingBlack};
            break;
          case "p":
            piece = {id: `pb${pieceIdCounter++}`, PGN: "", FEN: "p", imgSrc: pawnBlack};
            break;
          case "R":
            piece = {id: `rw${pieceIdCounter++}`, PGN: "R", FEN: "R", imgSrc: rookWhite};
            break;
          case "N":
            piece = {id: `nw${pieceIdCounter++}`, PGN: "N", FEN: "N", imgSrc: knightWhite};
            break;
          case "B":
            piece = {id: `bw${pieceIdCounter++}`, PGN: "B", FEN: "B", imgSrc: bishopWhite};
            break;
          case "Q":
            piece = {id: `qw${pieceIdCounter++}`, PGN: "Q", FEN: "Q", imgSrc: queenWhite};
            break;
          case "K":
            piece = {id: `kw${pieceIdCounter++}`, PGN: "K", FEN: "K", imgSrc: kingWhite};
            break;
          case "P":
            piece = {id: `pw${pieceIdCounter++}`, PGN: "", FEN: "P", imgSrc: pawnWhite};
            break;
          case "/":
            continue;
          default:
            const emptyFields = parseInt(char);
            fieldIndex += emptyFields;
            continue;
        }

        if (piece) {
          temp[fieldIndex].piece = piece;
          fieldIndex++;
        }
      }

        // setting the turn
        const whiteTurnFEN = fen.split(" ")[1] === "w" ? true : false;
        setWhiteTurn(whiteTurnFEN);

        // TODO: disable castling if not present in FEN string

        // setting enPassant possibility
        const enPasasntFEN = fen.split(" ")[3].toUpperCase();
        if (enPasasntFEN !== "-") {
          const enPassantField = fields.find(field => field.column + field.row === enPasasntFEN);
          const toIndex = fields.indexOf(enPassantField!) + (whiteTurnFEN ? 8 : -8);
          const fromIndex = whiteTurnFEN ? toIndex - 16 : toIndex + 16;
          
          if (playerSide === "W") setLastMove({from: fromIndex, to: toIndex, piece: ""});
          else setLastMove({from: toIndex, to: fromIndex, piece: ""}); // flipped when player is black
        }
        
        // setting half-move and turn counter
        setHalfMove(parseInt(fen.split(" ")[4]));
        setTurnCounter(parseInt(fen.split(" ")[5]));
        
        setFields(temp);
        setImportFENModal(false);
        setDisableFenBtn(true);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const setupBoard = (playerSide: string) => {
    setPlayerSide(playerSide);
    setPieces();
    closeSelectModal();
  }

  const setPieces = () => {
    const temp = [...fields];

    for (let i = 0; i < 64; i++) {
      if (i >= 48)
        temp[i].piece = pieces[i - 32];

      if (i < 16)
        temp[i].piece = pieces[i];
    }

    setFields(temp);
  };

  const isValidMove = (movingFrom: FieldModel, movingTo: FieldModel): boolean | ValidMove => {
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
  
      let tempPosition = fromIndex;
      // up movement
      while (tempPosition + moveUp >= 0) {
        tempPosition += moveUp;
        if (tempPosition === toIndex) return true;
        if (fields[tempPosition].piece !== undefined) break;
      }
      tempPosition = fromIndex;
  
      // down movement
      while (tempPosition + moveDown < fields.length) {
        tempPosition += moveDown;
        if (tempPosition === toIndex) return true;
        if (fields[tempPosition].piece !== undefined) break;
      }
      tempPosition = fromIndex;
  
      // left movement
      while (tempPosition % 8 !== 0) {
        tempPosition += moveLeft;
        if (tempPosition === toIndex) return true;
        if (fields[tempPosition].piece !== undefined) break;
      }
      tempPosition = fromIndex;
  
      // right movement
      while (tempPosition % 8 !== 7) {
        tempPosition += moveRight;
        if (tempPosition === toIndex) return true;
        if (fields[tempPosition].piece !== undefined) break;
      }
  
      return false;
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

    const kingMovementValid = (fromIndex: number, toIndex: number): boolean => {
      const kingMoves = [-9, -8, -7, -1, 1, 7, 8, 9];

      for (let move of kingMoves) {
        const tempPosition = fromIndex + move;
        if (tempPosition >= 0 && tempPosition < 64) {
          if (tempPosition === toIndex) {
            return true;
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
      return kingMovementValid(fromIndex, toIndex);
    } else if (selectedPiece!.PGN === "") {
      return pawnMovementValid(fromIndex, toIndex, pieceColor, lastMove!);
    }
    return false;
  };

  // when two or more pieces of the same type can reach the same field
  // additional data is written to PGN to differentiate between them
  const getPieceDisambiguation = (previousField: FieldModel, selectedField: FieldModel): string => {
    const piecePGN = selectedPiece!.PGN;

    const sameTypePieces = fields.filter(field => field.piece?.PGN === piecePGN &&
      field.piece !== selectedPiece &&
      field.piece.id.charAt(1) === selectedPiece!.id.charAt(1));

    const sameMovePieces = sameTypePieces.filter(field => {
      const validMove = isValidMove(field, selectedField);

      if (typeof validMove === "object") return validMove.valid;
      
      return validMove;
    });

    let disambiguation = "";
    
    if (piecePGN !== "" && sameMovePieces.length > 0) {
      const sameColumn = sameMovePieces.some(field => field.column === previousField.column);
      const sameRow = sameMovePieces.some(field => field.row === previousField.row);

      if (sameColumn && sameRow) {
        disambiguation += previousField.column.toLowerCase() + previousField.row;
      } else if (sameColumn) {
        disambiguation += previousField.row;
      } else if (sameRow) {
        disambiguation += previousField.column.toLowerCase();
      } else {
        disambiguation += previousField.column.toLowerCase();
      }
    }

    return disambiguation;
  };

  const promotePiece = (promoteTo: string) => {
    const temp = [...fields];
    if (!whiteTurn) {
      const promotionField = temp.find(field => field.piece?.PGN === "" && field.row === 8);
      switch (promoteTo) {
        case "Q":
          promotionField!.piece = {id: "qw" + turnCounter, FEN: "Q", PGN: "Q", imgSrc: queenWhite}
          break;
        case "N":
          promotionField!.piece = {id: "nw" + turnCounter, FEN: "N", PGN: "N", imgSrc: knightWhite}
          break;
        case "R":
          promotionField!.piece = {id: "rw" + turnCounter, FEN: "R", PGN: "R", imgSrc: rookWhite}
          break;
        case "B":
          promotionField!.piece = {id: "bw" + turnCounter, FEN: "B", PGN: "B", imgSrc: bishopWhite}
          break;
      }
    } else {
      const promotionField = temp.find(field => field.piece?.PGN === "" && field.row === 1);
      switch (promoteTo) {
        case "Q":
          promotionField!.piece = {id: "qb" + turnCounter, FEN: "q", PGN: "Q", imgSrc: queenBlack}
          break;
        case "N":
          promotionField!.piece = {id: "nb" + turnCounter, FEN: "n", PGN: "N", imgSrc: knightBlack}
          break;
        case "R":
          promotionField!.piece = {id: "rb" + turnCounter, FEN: "r", PGN: "R", imgSrc: rookBlack}
          break;
        case "B":
          promotionField!.piece = {id: "bb" + turnCounter, FEN: "b", PGN: "B", imgSrc: bishopBlack}
          break;
      }
    }

    const updatedPGN = `${PGN.slice(0, PGN.length - 1)}=${promoteTo} `;
    setPGN(updatedPGN);

    playPromoteSound();
    setFields(temp);
    setPromotionModal(false);
  };

  const boardClick = (clickedOn: PieceModel | string) => {
    const temp = [...fields];
    if (typeof clickedOn === "string" && selectedPiece !== null) {

      const fieldMatchesClick = (field: FieldModel): boolean => {
        return field.column === clickedOn.charAt(0) && field.row === Number.parseInt(clickedOn.charAt(1));
      };

      const findPreviousField = (): FieldModel | undefined => {
        return temp.find(field => field.piece === selectedPiece && !fieldMatchesClick(field));
      };

      const selectedField = temp.find(field => fieldMatchesClick(field));
      const previousField = findPreviousField();

      const validMove = isValidMove(previousField!, selectedField!);
      if (
        (typeof validMove === "object" && !validMove.valid) || 
        (typeof validMove === "boolean" && !validMove)
      ) {
        const fieldDiv = document.getElementById(selectedField!.column+selectedField!.row);
        
        if (fieldDiv) {
          let blinkCount = 0;
          const originalColor = fieldDiv.style.backgroundColor;
      
          const blinkRed = () => {
            if (blinkCount < 6) {
              fieldDiv.style.backgroundColor = blinkCount % 2 === 0 ? "red" : originalColor;
              blinkCount++;
              setTimeout(blinkRed, 100);
            }
          };
      
          blinkRed();
        }
        return;
      }

      const pieceDisambiguation = getPieceDisambiguation(previousField!, selectedField!);

      selectedField!.piece = selectedPiece;
      previousField!.piece = undefined;
      
      const previousFieldDiv = document.getElementById(previousField!.column+previousField!.row);
      previousFieldDiv!.style.backgroundColor = selectedFieldColor;
      setSelectedFieldColor("");

      if (typeof validMove === "object" && validMove.enPassantIndex !== -1) {
        const enPassantField = temp[validMove.enPassantIndex];
        enPassantField.piece = undefined;

        if (!whiteTurn) {
          const piecePGN = selectedPiece.PGN !== "" ? selectedPiece.PGN : previousField!.column.toLowerCase();
          setPGN(`${PGN + piecePGN + pieceDisambiguation}x${selectedField!.column.toLowerCase() + selectedField!.row} `);
          setTurnCounter(turnCounter + 1);
        } else {
          const piecePGN = selectedPiece.PGN !== "" ? selectedPiece.PGN : previousField!.column.toLowerCase();
          setPGN(`${PGN + (turnCounter)}. ${piecePGN + pieceDisambiguation}x${selectedField!.column.toLowerCase() + selectedField!.row} `);
        }
        playCaptureSound();
      } else {
        if (!whiteTurn) {
          setPGN(`${PGN + selectedPiece.PGN + pieceDisambiguation + clickedOn.toLowerCase()} `);
          setTurnCounter(turnCounter + 1);
        } else {
          setPGN(`${PGN + (turnCounter)}. ${selectedPiece.PGN + pieceDisambiguation + clickedOn.toLowerCase()} `);
        }
        playMoveSound();
      }

      if (
        (selectedPiece.FEN === "P" && selectedField?.row === 8) ||
        (selectedPiece.FEN === "p" && selectedField?.row === 1)
      ) {
        setPromotionModal(true);
      }

      if (selectedPiece.PGN === "") {
        setHalfMove(0);
      } else {
        setHalfMove(halfMove + 1);
      }
      
      setLastMove({
        from: fields.indexOf(previousField!),
        to: fields.indexOf(selectedField!),
        piece: selectedPiece.PGN
      });
      setFields(temp);
      setSelectedPiece(null);
      setWhiteTurn(!whiteTurn);
      
    } else if (typeof clickedOn !== "string" && selectedPiece === null) {
      if (whiteTurn !== (clickedOn.id.charAt(1) === "w")) return;
      
      setSelectedPiece(clickedOn);

      const pieceField = temp.find(field => field.piece === clickedOn);
      const fieldDiv = document.getElementById(pieceField!.column+pieceField!.row);
      setSelectedFieldColor(fieldDiv!.style.backgroundColor);
      fieldDiv!.style.backgroundColor = "gold";

    } else if (typeof clickedOn !== "string" && selectedPiece !== null) {
      if (clickedOn === selectedPiece) {
        setSelectedPiece(null);
        
        const pieceField = temp.find(field => field.piece === clickedOn);
        const fieldDiv = document.getElementById(pieceField!.column+pieceField!.row);
        fieldDiv!.style.backgroundColor = selectedFieldColor;
        setSelectedFieldColor("");

      } else if (clickedOn !== selectedPiece) {
        if (clickedOn.id.charAt(1) === selectedPiece.id.charAt(1)) {
          setSelectedPiece(clickedOn);

          const prevPieceField = temp.find(field => field.piece === selectedPiece);
          const nextPieceField = temp.find(field => field.piece === clickedOn);
          const prevFieldDiv = document.getElementById(prevPieceField!.column+prevPieceField!.row);
          const nextFieldDiv = document.getElementById(nextPieceField!.column+nextPieceField!.row);

          prevFieldDiv!.style.backgroundColor = selectedFieldColor;
          setSelectedFieldColor(nextFieldDiv!.style.backgroundColor);
          nextFieldDiv!.style.backgroundColor = "gold";

        } else {
          const selectedField = temp.find(field => field.piece === clickedOn);
          const previousField = temp.find(field => field.piece === selectedPiece);
          
          const validMove = isValidMove(previousField!, selectedField!);
          if (
            (typeof validMove === "object" && !validMove.valid) || 
            (typeof validMove === "boolean" && !validMove)
          ) {
            const fieldDiv = document.getElementById(selectedField!.column+selectedField!.row);
            
            if (fieldDiv) {
              let blinkCount = 0;
              const originalColor = fieldDiv.style.backgroundColor;
          
              const blinkRed = () => {
                if (blinkCount < 6) {
                  fieldDiv.style.backgroundColor = blinkCount % 2 === 0 ? "red" : originalColor;
                  blinkCount++;
                  setTimeout(blinkRed, 100);
                }
              };
          
              blinkRed();
            }
            return;
          }

          const pieceDisambiguation = getPieceDisambiguation(previousField!, selectedField!);
          
          previousField!.piece = undefined;
          const previousFieldDiv = document.getElementById(previousField!.column+previousField!.row);
          previousFieldDiv!.style.backgroundColor = selectedFieldColor;

          setSelectedFieldColor("");
          selectedField!.piece = selectedPiece;

          if (!whiteTurn) {
            const piecePGN = selectedPiece.PGN !== "" ? selectedPiece.PGN : previousField!.column.toLowerCase();
            setPGN(`${PGN + piecePGN + pieceDisambiguation}x${selectedField!.column.toLowerCase() + selectedField!.row} `);
            setTurnCounter(turnCounter + 1);
          } else {
            const piecePGN = selectedPiece.PGN !== "" ? selectedPiece.PGN : previousField!.column.toLowerCase();
            setPGN(`${PGN + (turnCounter)}. ${piecePGN + pieceDisambiguation}x${selectedField!.column.toLowerCase() + selectedField!.row} `);
          }

          if (
            (selectedPiece.FEN === "P" && selectedField?.row === 8) ||
            (selectedPiece.FEN === "p" && selectedField?.row === 1)
          ) {
            setPromotionModal(true);
          }

          setLastMove({
            from: fields.indexOf(previousField!),
            to: fields.indexOf(selectedField!),
            piece: selectedPiece.PGN
          });
          setHalfMove(0);
          setFields(temp);
          setSelectedPiece(null);
          playCaptureSound();
          setWhiteTurn(!whiteTurn);
        }
      }
    }
  };

  const surrender = () => {
    playerSide === "W" ? setPGN(PGN + "0-1") : setPGN(PGN + "1-0");
    setInputDisabled(true);
    setEndGameModal(true);
  };

  return (
    <>
      <TurnDisplay whiteTurn={whiteTurn} />
      <Button buttonType="button" label="Surrender" onClick={() => surrender()} disabled={inputDisabled} />

      <Board playerSide={playerSide === "W" ? "WHITE" : "BLACK"} fields={fields} boardClick={boardClick} disabled={inputDisabled} />
      <Modal heading="Select a side" content={[whiteBtn, blackBtn]} isVisible={showSideSelectModal} />

      <Button buttonType="button" label="Import FEN" onClick={() => setImportFENModal(true)} disabled={disableFenBtn} />
      <Button buttonType="button" label="Export FEN" onClick={() => {setExportFENModal(true);exportFEN()}} />
      <br />
      <Button buttonType="button" label="Export PGN" onClick={() => setExportPGNModal(true)} />
      <br />
      
      <Modal heading="Copy FEN" content={exportFEN()} isVisible={showExportFENModal} onClose={() => setExportFENModal(false)} />
      <Modal heading="Paste FEN" content={[fenInput, fenConfirmBtn]} isVisible={showImportFENModal} onClose={() => setImportFENModal(false)} />

      <Modal heading="Copy PGN" content={PGN} isVisible={showExportPGNModal} onClose={() => setExportPGNModal(false)} />

      <Modal heading="Pawn Promotion" content={promotionModalContent} isVisible={showPromotionModal} />

      <Modal heading="Game Over" content={endGameModalContent} isVisible={showEndGameModal} onClose={() => setEndGameModal(false)} />
    </>
  );
};

export default GamePage;
