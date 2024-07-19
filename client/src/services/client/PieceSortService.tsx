import Field from "../../models/Field/Field";

export const whiteSideSort = (a: Field, b: Field) => {
  if (a.row !== b.row) {
    return b.row - a.row;
  }
  return a.column.localeCompare(b.column);
};

export const blackSideSort = (a: Field, b: Field) => {
  if (a.row !== b.row) {
    return a.row - b.row;
  }
  return b.column.localeCompare(a.column);
};
