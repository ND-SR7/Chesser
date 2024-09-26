import ButtonStyled, { DisabledStyle } from "./Button.styled";

type ButtonType = 'button' | 'submit' | 'reset';
type ButtonFloatType = 'left' | 'right';

interface ButtonProps {
  id?: string;
  label: string;
  buttonType: ButtonType;
  disabled?: boolean;
  float?: ButtonFloatType;
  onClick?: () => void;
};

const Button = ({id, label, buttonType, disabled, float, onClick} : ButtonProps) => {
  const appliedStyle: any = disabled ?
  DisabledStyle : 
  { 
    float: float || "none", 
    marginLeft: float ? "-35px" : "none" 
  };

  return (
    <ButtonStyled 
      id={id ? id : ""}
      type={buttonType}
      onClick={onClick}
      disabled={disabled}
      style={appliedStyle}>
        {label}
    </ButtonStyled>
  );
};

export default Button;
