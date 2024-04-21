import { useEffect, useState } from "react";
import Board from "../components/Board/Board";
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
import Button from "../components/Shared/Button/Button";
import Modal from "../components/Shared/Modal/Modal";
import TurnDisplay from "../components/Board/TurnDisplay/TurnDisplay";

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

  const [turnCounter, setTurnCounter] = useState(0);
  const [PGN, setPGN] = useState("");
  const [showExportPGNModal, setExportPGNModal] = useState(false);

  const [showExportFENModal, setExportFENModal] = useState(false);
  const [showImportFENModal, setImportFENModal] = useState(false);
  const fenInput = <input id="fenInput" type="text" maxLength={87} />
  const fenConfirmBtn = <Button buttonType="button" label="Confirm" onClick={() => setupFEN()} />

  const [selectedPiece, setSelectedPiece] = useState<PieceModel | null>(null);
  
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

  const exportFEN = () => {
    const whiteSideSort = (a: FieldModel, b: FieldModel) => {
      if (a.row !== b.row) {
          return b.row - a.row;
      }
      return a.column.localeCompare(b.column);
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

    // TODO: Remaining FEN structure

    return <p>{fen}</p>;
  };

  // TODO: Game setup based on FEN
  // rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2
  const setupFEN = () => {
    const fenInputElement = document.getElementById("fenInput") as HTMLInputElement | null;
    const fen = fenInputElement?.value || "";

    if (fen !== "") {
      console.log(fen);
      const temp = [...fields];
      
      setFields(temp);
      setImportFENModal(false);
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
      if (selectedField) selectedField.piece = selectedPiece;

      const previousField = findPreviousField();
      if (previousField) previousField.piece = undefined;

      if (!whiteTurn) {
        setPGN(`${PGN + selectedPiece.PGN + clickedOn.toLowerCase()} `);
      } else {
        setPGN(`${PGN + (turnCounter + 1)}. ${selectedPiece.PGN + clickedOn.toLowerCase()} `);
        setTurnCounter(turnCounter + 1);
      }
      console.log(PGN);

      setFields(temp);
      setSelectedPiece(null);
      playMoveSound();
      setWhiteTurn(!whiteTurn);
      
    } else if (typeof clickedOn !== "string" && selectedPiece === null) {
      if (whiteTurn !== (clickedOn.id.charAt(1) === "w")) return;
      setSelectedPiece(clickedOn);

    } else if (typeof clickedOn !== "string" && selectedPiece !== null) {
      if (clickedOn === selectedPiece) {
        setSelectedPiece(null);

      } else if (clickedOn !== selectedPiece) {
        if (clickedOn.id.charAt(1) === selectedPiece.id.charAt(1)) {
          setSelectedPiece(clickedOn);

        } else {
          const previousField = temp.find(field => field.piece === selectedPiece);
          if (previousField) previousField.piece = undefined;

          const selectedField = temp.find(field => field.piece === clickedOn);
          if (selectedField) selectedField.piece = selectedPiece;

          if (!whiteTurn) {
            const piecePGN = selectedPiece.PGN !== "" ? selectedPiece.PGN : previousField!.column.toLowerCase();
            setPGN(`${PGN + piecePGN}x${selectedField!.column.toLowerCase() + selectedField!.row} `);
          } else {
            const piecePGN = selectedPiece.PGN !== "" ? selectedPiece.PGN : previousField!.column.toLowerCase();
            setPGN(`${PGN + (turnCounter + 1)}. ${piecePGN }x${selectedField!.column.toLowerCase() + selectedField!.row} `);
            setTurnCounter(turnCounter + 1);
          }
          console.log(PGN);

          setFields(temp);
          setSelectedPiece(null);
          playCaptureSound();
          setWhiteTurn(!whiteTurn);
        }
      }
    }
  };

  return (
    <>
      <TurnDisplay whiteTurn={whiteTurn} />
      <Board playerSide={playerSide === "W" ? "WHITE" : "BLACK"} fields={fields} boardClick={boardClick} />
      <Modal heading="Select a side" content={[whiteBtn, blackBtn]} isVisible={showSideSelectModal} />

      <Button buttonType="button" label="Import FEN" onClick={() => setImportFENModal(true)} />
      <Button buttonType="button" label="Export FEN" onClick={() => {setExportFENModal(true);exportFEN()}} />
      <br />
      <Button buttonType="button" label="Export PGN" onClick={() => setExportPGNModal(true)} />
      <br />
      
      <Modal heading="Copy FEN" content={exportFEN()} isVisible={showExportFENModal} onClose={() => setExportFENModal(false)} />
      <Modal heading="Paste FEN" content={[fenInput, fenConfirmBtn]} isVisible={showImportFENModal} onClose={() => setImportFENModal(false)} />

      <Modal heading="Copy PGN" content={PGN} isVisible={showExportPGNModal} onClose={() => setExportPGNModal(false)} />
    </>
  );
};

export default GamePage;
