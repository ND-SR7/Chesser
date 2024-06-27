import { useCallback, useEffect, useState } from "react";

import Board, { SideString } from "../components/Board/Board";
import Button from "../components/Shared/Button/Button";
import Modal from "../components/Shared/Modal/Modal";
import TurnDisplay from "../components/Board/TurnDisplay/TurnDisplay";

import Field from "../models/Field/Field";
import Piece from "../models/Piece/Piece";

import useSound from "use-sound";
import moveSound from "../sounds/move.mp3";
import checkSound from "../sounds/move-check.mp3";
import captureSound from "../sounds/capture.mp3";
import castleSound from "../sounds/castle.mp3";
import promoteSound from "../sounds/promote.mp3";
import gameEndSound from "../sounds/game-end.mp3";

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

import { whiteSideSort } from "../services/PieceSortService";
import { LastMove, ValidMove, isValidMove } from "../services/ValidMoveService";
import { getCheckStatus } from "../services/CheckmateService";
import { fieldToString } from "../services/StringService";

type OutcomeString = "WIN" | "LOSS" | "DRAW" | "SURRENDER";

const GamePage = () => {
  const [fields, setFields] = useState<Field[]>([
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

  const pieces: Piece[] = [
    { id: "rw1", imgSrc: rookWhite, FEN: "R", PGN: "R" },
    { id: "nw1", imgSrc: knightWhite, FEN: "N", PGN: "N" },
    { id: "bw1", imgSrc: bishopWhite, FEN: "B", PGN: "B" },
    { id: "kw1", imgSrc: kingWhite, FEN: "K", PGN: "K" },
    { id: "qw1", imgSrc: queenWhite, FEN: "Q", PGN: "Q" },
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
    { id: "kb1", imgSrc: kingBlack, FEN: "k", PGN: "K" },
    { id: "qb1", imgSrc: queenBlack, FEN: "q", PGN: "Q" },
    { id: "bb2", imgSrc: bishopBlack, FEN: "b", PGN: "B" },
    { id: "nb2", imgSrc: knightBlack, FEN: "n", PGN: "N" },
    { id: "rb2", imgSrc: rookBlack, FEN: "r", PGN: "R" }
  ];

  const [playMoveSound] = useSound(moveSound);
  const [playCheckSound] = useSound(checkSound);
  const [playCaptureSound] = useSound(captureSound);
  const [playCastleSound] = useSound(castleSound);
  const [playPromoteSound] = useSound(promoteSound);
  const [playGameEndSound] = useSound(gameEndSound);

  const [playerSide, setPlayerSide] = useState<SideString>("B");
  const [whiteTurn, setWhiteTurn] = useState(true);

  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);
  const [selectedFieldColor, setSelectedFieldColor] = useState(""); // visualizing clicked-on field

  const [PGN, setPGN] = useState("");
  const [turnCounter, setTurnCounter] = useState(1);
  const [halfMove, setHalfMove] = useState<number>(0);
  const [lastMove, setLastMove] = useState<LastMove>();
  // checking if castling is legal
  // false if moved, in order, from white: king, kingside rook, queenside rook
  const [castling, setCastling] = useState<boolean[]>([true, true, true, true, true, true]);

  const [inputDisabled, setInputDisabled] = useState(false);
  const [disableFenBtn, setDisableFenBtn] = useState(false);

  const whiteBtn: JSX.Element = <Button key="btnWhite" buttonType="button" label="White" onClick={() => setupBoard("W")} />
  const blackBtn: JSX.Element = <Button key="btnBlack" buttonType="button" label="Black" onClick={() => setupBoard("B")} />
  const fenInput = <input id="fenInput" key="fenInput" type="text" maxLength={87} size={60} />
  const fenConfirmBtn = <Button key="importFenBtn" buttonType="button" label="Confirm" onClick={() => importFEN()} />
  const endGameModalContent = (outcome: OutcomeString) => {
    let outcomeMessage = "";

    switch(outcome) {
      case "WIN":
        outcomeMessage = "You have won";
        break;
      case "LOSS":
        outcomeMessage = "You have been defeated";
        break;
      case "DRAW":
        outcomeMessage = "Draw";
        break;
      case "SURRENDER":
        outcomeMessage = "You have surrendered";
        break;
    }

    return (
    <div>
      <p><b>{outcomeMessage}</b></p>
      <Button buttonType="button" label="Play Again" onClick={() => window.location.reload()} />
    </div>
    );
  };
  const promotionModalContent = (
    <div>
      <p><b>Select promotion type:</b></p>
      <Button buttonType="button" label="Queen" onClick={() => promotePiece("Q")} />
      <Button buttonType="button" label="Knight" onClick={() => promotePiece("N")} />
      <Button buttonType="button" label="Rook" onClick={() => promotePiece("R")} />
      <Button buttonType="button" label="Bishop" onClick={() => promotePiece("B")} />
    </div>
  );

  const [showModal, setModal] = useState(false);
  const [modalHeading, setModalHeading] = useState("Select a side");
  const [modalContent, setModalContent] = useState<any>([whiteBtn, blackBtn]);
  const [modalCloseable, setModalCloseable] = useState(false);
  const openModal = () => setModal(true);
  const closeModal = () => setModal(false);

  // PGN is missing info after promotion
  // used to correct it
  const syncPgnAfterPromote = useCallback(() => {
    const indexOfPromotion = PGN.lastIndexOf("= ");
    const promotionFieldString = PGN.substring(indexOfPromotion - 2, indexOfPromotion).toUpperCase();
    const promotionField = fields.find(field => fieldToString(field) === promotionFieldString);
    
    if (promotionField && promotionField.piece) {
      const updatedPGN = PGN.replace("= ", `=${promotionField.piece.PGN} `);
      setPGN(updatedPGN);
    }
  }, [fields, PGN]);

  useEffect(() => {
    if (fields[0].piece === undefined && turnCounter === 1) {
      setModalCloseable(false);
      openModal();
    } else {
      syncPgnAfterPromote();
    }
  }, [fields, syncPgnAfterPromote, turnCounter]);

  const exportFEN = () => {
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
    fen += ` ${halfMove} ${turnCounter}`;

    return <p>{fen}</p>;
  };

  // Test FEN: rnbqkbnr/pp1p1ppp/8/2pPp3/8/8/PPP1PPPP/RNBQKBNR w KQkq c6 0 3
  const importFEN = () => {
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
        let piece: Piece | undefined = undefined;

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

        const castlingFEN = fen.split(" ")[2];

        if (castlingFEN !== "-") {
          if (!castlingFEN.includes("K")) castling[1] = false;
          if (!castlingFEN.includes("Q")) castling[2] = false;
          if (!castlingFEN.includes("k")) castling[4] = false;
          if (!castlingFEN.includes("q")) castling[5] = false;
          setCastling(castling);
        } else {
          castling[0] = false;
          castling[3] = false;
          setCastling(castling);
        }

        // setting enPassant possibility
        const enPasasntFEN = fen.split(" ")[3].toUpperCase();
        if (enPasasntFEN !== "-") {
          const enPassantField = fields.find(field => fieldToString(field) === enPasasntFEN);
          const toIndex = fields.indexOf(enPassantField!) + (whiteTurnFEN ? 8 : -8);
          const fromIndex = whiteTurnFEN ? toIndex - 16 : toIndex + 16;
          
          if (playerSide === "W") setLastMove({from: fromIndex, to: toIndex, piece: ""});
          else setLastMove({from: toIndex, to: fromIndex, piece: ""}); // flipped when player is black
        }
        
        // setting half-move and turn counter
        setHalfMove(parseInt(fen.split(" ")[4]));
        setTurnCounter(parseInt(fen.split(" ")[5]));
        
        setFields(temp);
        closeModal();
        setDisableFenBtn(true);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const setupBoard = (playerSide: SideString) => {
    setPlayerSide(playerSide);
    setPieces();
    closeModal();
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

  // when two or more pieces of the same type can reach the same field
  // additional data is written to PGN to differentiate between them
  const getPieceDisambiguation = (previousField: Field, selectedField: Field): string => {
    const piecePGN = selectedPiece!.PGN;

    const sameTypePieces = fields.filter(field => field.piece?.PGN === piecePGN &&
      field.piece !== selectedPiece &&
      field.piece.id.charAt(1) === selectedPiece!.id.charAt(1));

    const sameMovePieces = sameTypePieces.filter(field => {
      const validMove = isValidMove(
        fields, field, selectedField, selectedPiece!, playerSide, lastMove!, castling, setCastling
      );

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
    if (whiteTurn) {
      const promotionField = temp.find(field => field.piece?.PGN === "" && field.row === 8);
      switch (promoteTo) {
        case "Q":
          promotionField!.piece = {id: `qw${turnCounter}`, FEN: "Q", PGN: "Q", imgSrc: queenWhite}
          break;
        case "N":
          promotionField!.piece = {id: `nw${turnCounter}`, FEN: "N", PGN: "N", imgSrc: knightWhite}
          break;
        case "R":
          promotionField!.piece = {id: `rw${turnCounter}`, FEN: "R", PGN: "R", imgSrc: rookWhite}
          break;
        case "B":
          promotionField!.piece = {id: `bw${turnCounter}`, FEN: "B", PGN: "B", imgSrc: bishopWhite}
          break;
      }
    } else {
      const promotionField = temp.find(field => field.piece?.PGN === "" && field.row === 1);
      switch (promoteTo) {
        case "Q":
          promotionField!.piece = {id: `qb${turnCounter}`, FEN: "q", PGN: "Q", imgSrc: queenBlack}
          break;
        case "N":
          promotionField!.piece = {id: `nb${turnCounter}`, FEN: "n", PGN: "N", imgSrc: knightBlack}
          break;
        case "R":
          promotionField!.piece = {id: `rb${turnCounter}`, FEN: "r", PGN: "R", imgSrc: rookBlack}
          break;
        case "B":
          promotionField!.piece = {id: `bb${turnCounter}`, FEN: "b", PGN: "B", imgSrc: bishopBlack}
          break;
      }
    }

    playPromoteSound();
    setFields(temp);
    closeModal();
  };

  const boardClick = (clickedOn: Piece | string) => {
    const temp = [...fields];

    syncPgnAfterPromote();
    
    if (typeof clickedOn === "string" && selectedPiece !== null) {
      handleFieldClick(temp, clickedOn);
    } else if (typeof clickedOn !== "string" && selectedPiece === null) {
      handlePieceSelection(temp, clickedOn);
    } else if (typeof clickedOn !== "string" && selectedPiece !== null) {
      handlePieceClick(temp, clickedOn);
    }
  };

  const blinkInvalidMove = (selectedField: Field) => {
    const fieldDiv = document.getElementById(selectedField.column+selectedField.row);
      
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
  };

  const updatePgnEnPassant = (temp: Field[], validMove: ValidMove, selectedPiece: Piece, previousField: Field, selectedField: Field): string => {
    const enPassantField = temp[validMove.enPassantIndex];
    enPassantField.piece = undefined;

    const pieceDisambiguation = getPieceDisambiguation(previousField, selectedField);

    if (!whiteTurn) {
      const piecePGN = selectedPiece.PGN !== "" ? selectedPiece.PGN : previousField!.column.toLowerCase();
      setTurnCounter(turnCounter + 1);
      return `${PGN + piecePGN + pieceDisambiguation}x${selectedField!.column.toLowerCase() + selectedField!.row} `;
    }

    const piecePGN = selectedPiece.PGN !== "" ? selectedPiece.PGN : previousField!.column.toLowerCase();
    return `${PGN + turnCounter}. ${piecePGN + pieceDisambiguation}x${selectedField!.column.toLowerCase() + selectedField!.row} `;
  };

  const updatePgnCastle = (selectedPiece: Piece, clickedOn: string, previousField: Field): string => {
    if (selectedPiece.id.charAt(1) === "w") {
      if (clickedOn === "G1" && previousField!.column === "E" && previousField!.row === 1) {
          const rookField = fields.find(field => fieldToString(field) === "H1");
          const jumpField = fields.find(field => fieldToString(field) === "F1");
          jumpField!.piece = rookField!.piece;
          rookField!.piece = undefined;

          return `${PGN + turnCounter}. O-O `;
      } else if (clickedOn === "C1" && previousField!.column === "E" && previousField!.row === 1) {
          const rookField = fields.find(field => fieldToString(field) === "A1");
          const jumpField = fields.find(field => fieldToString(field) === "D1");
          jumpField!.piece = rookField!.piece;
          rookField!.piece = undefined;

          return `${PGN + turnCounter}. O-O-O `;
      }
    } else if (selectedPiece.id.charAt(1) === "b") {
      setTurnCounter(turnCounter + 1);
      if (clickedOn === "G8" && previousField!.column === "E" && previousField!.row === 8) {
        const rookField = fields.find(field => fieldToString(field) === "H8");
        const jumpField = fields.find(field => fieldToString(field) === "F8");
        jumpField!.piece = rookField!.piece;
        rookField!.piece = undefined;

        return `${PGN} O-O `;
      } else if (clickedOn === "C8" && previousField!.column === "E" && previousField!.row === 8) {
        const rookField = fields.find(field => fieldToString(field) === "A8");
        const jumpField = fields.find(field => fieldToString(field) === "D8");
        jumpField!.piece = rookField!.piece;
        rookField!.piece = undefined;

        return `${PGN} O-O-O `;
      }
    }
    return "";
  };

  const updatePgnMove = (selectedPiece: Piece, clickedOn: string, previousField: Field, selectedField: Field): string => {
    const pieceDisambiguation = getPieceDisambiguation(previousField, selectedField);

    if (!whiteTurn) {
      setTurnCounter(turnCounter + 1);
      return `${PGN + selectedPiece.PGN + pieceDisambiguation + clickedOn.toLowerCase()} `;
    }

    return `${PGN + turnCounter}. ${selectedPiece.PGN + pieceDisambiguation + clickedOn.toLowerCase()} `;
  };

  const updatePgnCapture = (selectedPiece: Piece, previousField: Field, selectedField: Field): string => {
    const pieceDisambiguation = getPieceDisambiguation(previousField, selectedField);

    if (!whiteTurn) {
      const piecePGN = selectedPiece.PGN !== "" ? selectedPiece.PGN : previousField.column.toLowerCase();
      setTurnCounter(turnCounter + 1);
      return `${PGN + piecePGN + pieceDisambiguation}x${selectedField.column.toLowerCase() + selectedField.row} `;
    }

    const piecePGN = selectedPiece.PGN !== "" ? selectedPiece.PGN : previousField.column.toLowerCase();
    return `${PGN + turnCounter}. ${piecePGN + pieceDisambiguation}x${selectedField.column.toLowerCase() + selectedField.row} `;
  };

  const updatePgnPromote = (pgn: string): string => {
    const promotionField = fields.find(field =>
      (field.row === 8 && field.piece?.id.includes("pw")) ||
      (field.row === 1 && field.piece?.id.includes("pb"))
    );
    
    const promotedTo = promotionField!.piece!.PGN;
    pgn = pgn.substring(0, pgn.length - 1);

    return `${pgn}=${promotedTo} `;
  };

  const updatePgnCheck = (pgn: string): string => {
    pgn = pgn.substring(0, pgn.length - 1);

    return `${pgn}+ `;
  };

  const updatePgnCheckmate = (pgn: string): string => {
    let updatedPGN = "";
    playerSide === "W" ? updatedPGN = `${pgn}# 0-1` : updatedPGN = `${pgn}# 1-0`;
    
    return updatedPGN;
  };

  const handleFieldClick = (temp: Field[], clickedOn: string) => {
    if (selectedPiece === null) return;

    const fieldMatchesClick = (field: Field): boolean => {
      return field.column === clickedOn.charAt(0) && field.row === Number.parseInt(clickedOn.charAt(1));
    };

    const findPreviousField = (): Field | undefined => {
      return temp.find(field => field.piece === selectedPiece && !fieldMatchesClick(field));
    };

    const isCastlingMove = (field: Field): boolean => {
      let isCastling = false;
      
      if (selectedPiece.FEN === "K") {
        return fieldToString(field) === "G1" || fieldToString(field) === "C1";
      } else if (selectedPiece.FEN === "k") {
        return fieldToString(field) === "G8" || fieldToString(field) === "C8";
      }

      return isCastling;
    }

    const selectedField = temp.find(field => fieldMatchesClick(field));
    const previousField = findPreviousField();

    if (selectedField === undefined || previousField === undefined) return;

    const validMove = isValidMove(
      fields, previousField, selectedField, selectedPiece, playerSide, lastMove, castling, setCastling
    );

    if (
      (typeof validMove === "object" && !validMove.valid) || 
      (typeof validMove === "boolean" && !validMove)
    ) {
      blinkInvalidMove(selectedField);
      return;
    }

    selectedField.piece = selectedPiece;
    previousField.piece = undefined;
    
    const previousFieldDiv = document.getElementById(previousField.column+previousField.row);
    previousFieldDiv!.style.backgroundColor = selectedFieldColor;
    setSelectedFieldColor("");

    let pgnUpdate = "" 
    if (typeof validMove === "object" && validMove.enPassantIndex !== -1) {
      pgnUpdate += updatePgnEnPassant(temp, validMove, selectedPiece, previousField, selectedField);
      playCaptureSound();
    } else if (isCastlingMove(selectedField)) {
      pgnUpdate += updatePgnCastle(selectedPiece, clickedOn, previousField);
      playCastleSound();
    } else {
      pgnUpdate += updatePgnMove(selectedPiece, clickedOn, previousField, selectedField);
      playMoveSound();
    }

    if (
      (selectedPiece.FEN === "P" && selectedField?.row === 8) ||
      (selectedPiece.FEN === "p" && selectedField?.row === 1)
    ) {
      setModalHeading("Pawn Promotion");
      setModalContent(promotionModalContent);
      setModalCloseable(false);
      openModal();
      pgnUpdate = updatePgnPromote(pgnUpdate);
    }

    const checkStatus = getCheckStatus(fields, fields.indexOf(selectedField), playerSide, lastMove, false);
    if (checkStatus.checkmate) {
      pgnUpdate = updatePgnCheckmate(pgnUpdate);
      setInputDisabled(true);
      setModalHeading("Game Over");
      setModalContent(endGameModalContent("LOSS"));
      setModalCloseable(true);
      openModal();
      playGameEndSound();
    } else if (checkStatus.check) {
      pgnUpdate = updatePgnCheck(pgnUpdate);
      playCheckSound();
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
    setPGN(pgnUpdate);
    setWhiteTurn(!whiteTurn);
  };

  const handlePieceSelection = (temp: Field[], clickedOn: Piece) => {
    if (whiteTurn !== (clickedOn.id.charAt(1) === "w")) return;
      
      setSelectedPiece(clickedOn);

      const pieceField = temp.find(field => field.piece === clickedOn);
      const fieldDiv = document.getElementById(pieceField!.column+pieceField!.row);
      setSelectedFieldColor(fieldDiv!.style.backgroundColor);
      fieldDiv!.style.backgroundColor = "gold";
  };

  const handlePieceClick = (temp: Field[], clickedOn: Piece) => {
    if (selectedPiece === null) return;

    if (clickedOn === selectedPiece) {
      setSelectedPiece(null);
      
      const pieceField = temp.find(field => field.piece === clickedOn);
      const fieldDiv = document.getElementById(pieceField!.column+pieceField!.row);
      fieldDiv!.style.backgroundColor = selectedFieldColor;
      setSelectedFieldColor("");
    } else if (clickedOn !== selectedPiece) {
      if (clickedOn.id.charAt(1) === selectedPiece.id.charAt(1)) {    
        const prevPieceField = temp.find(field => field.piece === selectedPiece);
        const nextPieceField = temp.find(field => field.piece === clickedOn);

        if (prevPieceField === undefined || nextPieceField === undefined) return;

        const prevFieldDiv = document.getElementById(prevPieceField.column+prevPieceField.row);
        const nextFieldDiv = document.getElementById(nextPieceField.column+nextPieceField.row);

        if (prevFieldDiv === null || nextFieldDiv === null) return;
        
        setSelectedPiece(clickedOn);
        prevFieldDiv.style.backgroundColor = selectedFieldColor;
        setSelectedFieldColor(nextFieldDiv.style.backgroundColor);
        nextFieldDiv.style.backgroundColor = "gold";
      } else {
        const previousField = temp.find(field => field.piece === selectedPiece);
        const selectedField = temp.find(field => field.piece === clickedOn);

        if (previousField === undefined || selectedField === undefined) return;
        
        const validMove = isValidMove(
          fields, previousField, selectedField, selectedPiece, playerSide, lastMove, castling, setCastling
        );

        if (
          (typeof validMove === "object" && !validMove.valid) || 
          (typeof validMove === "boolean" && !validMove)
        ) {
          blinkInvalidMove(selectedField);
          return;
        }
        
        previousField.piece = undefined;
        const previousFieldDiv = document.getElementById(previousField.column+previousField.row);
        previousFieldDiv!.style.backgroundColor = selectedFieldColor;

        setSelectedFieldColor("");
        selectedField.piece = selectedPiece;

        let pgnUpdate = "";
        pgnUpdate += updatePgnCapture(selectedPiece, previousField, selectedField);
        playCaptureSound();

        if (
          (selectedPiece.FEN === "P" && selectedField?.row === 8) ||
          (selectedPiece.FEN === "p" && selectedField?.row === 1)
        ) {
          setModalHeading("Pawn Promotion");
          setModalContent(promotionModalContent);
          setModalCloseable(false);
          openModal();
          pgnUpdate = updatePgnPromote(pgnUpdate);
        }

        const checkStatus = getCheckStatus(fields, fields.indexOf(selectedField), playerSide, lastMove, false);
        if (checkStatus.checkmate) {
          pgnUpdate = updatePgnCheckmate(pgnUpdate);
          setInputDisabled(true);
          setModalHeading("Game Over");
          setModalContent(endGameModalContent("LOSS"));
          setModalCloseable(true);
          openModal();
          playGameEndSound();
        } else if (checkStatus.check) {
          pgnUpdate = updatePgnCheck(pgnUpdate);
          playCheckSound();
        }

        setLastMove({
          from: fields.indexOf(previousField!),
          to: fields.indexOf(selectedField!),
          piece: selectedPiece.PGN
        });
        setHalfMove(0);
        setFields(temp);
        setSelectedPiece(null);
        setPGN(pgnUpdate);
        setWhiteTurn(!whiteTurn);
      }
    }
  };

  const surrender = () => {
    playerSide === "W" ? setPGN(`${PGN}0-1`) : setPGN(`${PGN}1-0`);
    setInputDisabled(true);

    setModalHeading("Game Over");
    setModalContent(endGameModalContent("SURRENDER"));
    setModalCloseable(true);
    playGameEndSound()
    openModal();
  };

  const inputFEN = () => {
    setModalHeading("Paste FEN");
    setModalContent([fenInput, fenConfirmBtn]);
    setModalCloseable(true);
    openModal();
  };

  const displayFEN = () => {
    setModalHeading("Copy FEN");
    setModalContent(exportFEN());
    setModalCloseable(true);
    openModal();
  };

  const displayPGN = () => {
    setModalHeading("Copy PGN");
    setModalContent(PGN);
    setModalCloseable(true);
    openModal();
  };

  return (
    <>
      <TurnDisplay whiteTurn={whiteTurn} />
      <Button buttonType="button" label="Surrender" onClick={() => surrender()} disabled={inputDisabled} />

      <Board playerSide={playerSide} fields={fields} boardClick={boardClick} disabled={inputDisabled} />

      <Button buttonType="button" label="Import FEN" onClick={() => inputFEN()} disabled={disableFenBtn} />
      <br />
      <Button buttonType="button" label="Export FEN" onClick={() => displayFEN()} />
      <Button buttonType="button" label="Export PGN" onClick={() => displayPGN()} />
      <br />
      
      <Modal heading={modalHeading} content={modalContent} isVisible={showModal} onClose={() => closeModal()} closeable={modalCloseable} />
    </>
  );
};

export default GamePage;
