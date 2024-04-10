import { useEffect, useState } from "react";
import Board from "../components/Board/Board";
import FieldModel from "../models/Field/Field";
import PieceModel from "../models/Piece/Piece";

const GamePage = () => {
  const [playerSide, setPlayerSide] = useState("");
  let sideNotSet = true;
  
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
    setTimeout(() => {
      if (sideNotSet) {
        const prompt = window.prompt("Select side (W/B):");
      
        if (prompt !== "W" && prompt !== "B") {
          window.alert("Invalid input");
        } else {
          setPlayerSide(prompt);
          sideNotSet = false;
          setPieces();
        }
      }
    }, 500);
  }, []);

  const pieces: PieceModel[] = [
    { id: "R1", imgSrc: "rw.png", FEN: "R", PGN: "R" },
    { id: "N1", imgSrc: "nw.png", FEN: "N", PGN: "N" },
    { id: "B1", imgSrc: "bw.png", FEN: "B", PGN: "B" },
    { id: "K", imgSrc: "kw.png", FEN: "K", PGN: "K" },
    { id: "Q", imgSrc: "qw.png", FEN: "Q", PGN: "Q" },
    { id: "B2", imgSrc: "bw.png", FEN: "B", PGN: "B" },
    { id: "N2", imgSrc: "nw.png", FEN: "N", PGN: "N" },
    { id: "R2", imgSrc: "rw.png", FEN: "R", PGN: "R" },
    { id: "P1", imgSrc: "pw.png", FEN: "P", PGN: "" },
    { id: "P2", imgSrc: "pw.png", FEN: "P", PGN: "" },
    { id: "P3", imgSrc: "pw.png", FEN: "P", PGN: "" },
    { id: "P4", imgSrc: "pw.png", FEN: "P", PGN: "" },
    { id: "P5", imgSrc: "pw.png", FEN: "P", PGN: "" },
    { id: "P6", imgSrc: "pw.png", FEN: "P", PGN: "" },
    { id: "P7", imgSrc: "pw.png", FEN: "P", PGN: "" },
    { id: "P8", imgSrc: "pw.png", FEN: "P", PGN: "" },
    { id: "p1", imgSrc: "pb.png", FEN: "p", PGN: "" },
    { id: "p2", imgSrc: "pb.png", FEN: "p", PGN: "" },
    { id: "p3", imgSrc: "pb.png", FEN: "p", PGN: "" },
    { id: "p4", imgSrc: "pb.png", FEN: "p", PGN: "" },
    { id: "p5", imgSrc: "pb.png", FEN: "p", PGN: "" },
    { id: "p6", imgSrc: "pb.png", FEN: "p", PGN: "" },
    { id: "p7", imgSrc: "pb.png", FEN: "p", PGN: "" },
    { id: "p8", imgSrc: "pb.png", FEN: "p", PGN: "" },
    { id: "r1", imgSrc: "rb.png", FEN: "r", PGN: "R" },
    { id: "n1", imgSrc: "nb.png", FEN: "n", PGN: "N" },
    { id: "b1", imgSrc: "bb.png", FEN: "b", PGN: "B" },
    { id: "k", imgSrc: "kb.png", FEN: "k", PGN: "K" },
    { id: "q", imgSrc: "qb.png", FEN: "q", PGN: "Q" },
    { id: "b2", imgSrc: "bb.png", FEN: "b", PGN: "B" },
    { id: "n2", imgSrc: "nb.png", FEN: "n", PGN: "N" },
    { id: "r2", imgSrc: "rb.png", FEN: "r", PGN: "R" }
  ];

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

  return (
    <Board playerSide={playerSide === "W" ? "WHITE" : "BLACK"} fields={fields} />
  );
};

export default GamePage;