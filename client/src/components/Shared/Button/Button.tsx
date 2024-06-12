import ButtonStyled, { DisabledStyle } from "./Button.styled";

type buttonType = 'button' | 'submit' | 'reset';

interface ButtonProps {
  id?: string;
  label: string;
  buttonType: buttonType;
  disabled?: boolean;
  onClick?: () => void;
}

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
