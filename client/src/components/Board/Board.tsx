import FieldModel from "../../models/Field/Field";
import Field, { columnString } from "../Field/Field";
import BoardStyled from "./Board.styled";

type sideString = "WHITE" | "BLACK";

interface BoardProps {
  playerSide: sideString;
  fields: FieldModel[];
}

const Board = ({playerSide, fields}: BoardProps) => {
  if (playerSide === "BLACK") {
    const blackSideSort = (a: FieldModel, b: FieldModel) => {
      if (a.row !== b.row) {
        return a.row - b.row;
      }
      return b.column.localeCompare(a.column);
    }

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
      {fields.map((field) => (
        <>
          <Field row={field.row} column={field.column as columnString} piece={field.piece}/>
          {breakLine(field)}
        </>
      ))}
    </BoardStyled>
  );
};

export default Board;
