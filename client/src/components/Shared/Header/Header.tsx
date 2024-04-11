import HeaderStyled from "./Header.styled";
import logo from "../../../logo.svg";
import LogoStyled from "./Logo/Logo.styled";

const Header = () => {
  return (
    <HeaderStyled>
      <LogoStyled src={logo} alt="Chesser Logo" />
      <h1 id="appName">Chesser</h1>
    </HeaderStyled>
  );
};

export default Header;
