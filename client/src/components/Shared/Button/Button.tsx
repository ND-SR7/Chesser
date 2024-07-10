import ButtonStyled, { DisabledStyle } from "./Button.styled";

type ButtonType = 'button' | 'submit' | 'reset';

interface ButtonProps {
  id?: string;
  label: string;
  buttonType: ButtonType;
  disabled?: boolean;
  onClick?: () => void;
};

const Button = ({id, label, buttonType, disabled, onClick} : ButtonProps) => {
  return (
    <ButtonStyled 
      id={id ? id : ""}
      type={buttonType}
      onClick={onClick}
      disabled={disabled}
      style={disabled ? DisabledStyle : {}}>
        {label}
    </ButtonStyled>
  );
};

export default Button;
