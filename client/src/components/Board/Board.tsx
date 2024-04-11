import FieldModel from "../../models/Field/Field";
import Field, { columnString } from "../Field/Field";
import PieceModel from "../../models/Piece/Piece";
import BoardStyled from "./Board.styled";
import React from "react";

type sideString = "WHITE" | "BLACK";

interface BoardProps {
  playerSide: sideString;
  fields: FieldModel[];
  boardClick: (clickedOn: PieceModel | string) => void;
}

const Board = ({playerSide, fields, boardClick}: BoardProps) => {
  if (playerSide === "BLACK") {
    const blackSideSort = (a: FieldModel, b: FieldModel) => {
      if (a.row !== b.row) {
        return a.row - b.row;
      }
      return b.column.localeCompare(a.column);
    };

    fields.sort(blackSideSort);
  } else {
    const whiteSideSort = (a: FieldModel, b: FieldModel) => {
        if (a.row !== b.row) {
            return b.row - a.row;
        }
        return a.column.localeCompare(b.column);
    };

    fields.sort(whiteSideSort);
  }

  const breakLine = (field: FieldModel) => {
    return playerSide === "WHITE" ?
      field.column === "H" && <div style={{ width: "100%" }} /> :
      field.column === "A" && <div style={{ width: "100%" }} />
  }

  return (
    <BoardStyled>
      {fields.map((field, index) => (
        <React.Fragment key={`${field.row}-${field.column}-${index}`}>
          <Field
            key={`${field.row}-${field.column}`}
            row={field.row}
            column={field.column as columnString}
            piece={field.piece}
            onClick={boardClick} />
          {breakLine(field)}
        </React.Fragment>
      ))}
    </BoardStyled>
  );
};

export default Board;
