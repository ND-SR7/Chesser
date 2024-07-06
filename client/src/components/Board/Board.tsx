import React from "react";

import FieldModel, { ColumnString } from "../../models/Field/Field";
import PieceModel from "../../models/Piece/Piece";

import BoardStyled, { DisabledStyle } from "./Board.styled";
import ColumnGuide from "./ColumnGuide/ColumnGuide";
import Field from "../Field/Field";
import { blackSideSort, whiteSideSort } from "../../services/client/PieceSortService";

export type SideString = "W" | "B";

interface BoardProps {
  playerSide: SideString;
  fields: FieldModel[];
  boardClick: (clickedOn: PieceModel | string) => void;
  disabled: boolean;
}

const Board = ({playerSide, fields, boardClick, disabled}: BoardProps) => {
  if (playerSide === "B") {
    fields.sort(blackSideSort);
  } else {
    fields.sort(whiteSideSort);
  }

  const breakLine = (field: FieldModel) => {
    return playerSide === "W" ?
      field.column === "H" && <div style={{ width: "100%" }} /> :
      field.column === "A" && <div style={{ width: "100%" }} />
  };

  const boardContent = fields.map((field, index) => (
    <React.Fragment key={`${field.row}-${field.column}-${index}`}>
      {index % 8 === 0 ? field.row : ""}
      
      <Field
        key={`${field.row}-${field.column}`}
        row={field.row}
        column={field.column as ColumnString}
        piece={field.piece}
        onClick={disabled ? ()=>{} : boardClick} />

      {breakLine(field)}
    </React.Fragment>
  ));

  return (
    <BoardStyled style={disabled ? DisabledStyle : {}}>
      {boardContent}
      <ColumnGuide side={playerSide}/>
    </BoardStyled>
  );
};

export default Board;
