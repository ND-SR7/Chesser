import Field from "../../models/Field/Field";

export const fieldToString = (field: Field): string => {
  return field.column + field.row;
};
