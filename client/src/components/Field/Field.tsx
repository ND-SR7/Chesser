import FieldStyled from './Field.styled';

export type columnString = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";

interface FieldProps {
  row: number;
  column: columnString;
}

const Field = ({row, column}: FieldProps) => {
  return (
    <FieldStyled id={column + row}>
      {column}{row}
    </FieldStyled>
  );
};

export default Field;
