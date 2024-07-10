import { useNavigate } from "react-router-dom";

import HeaderStyled from "./Header.styled";
import LogoStyled from "./Logo/Logo.styled";

import logo from "../../../logo.svg";

const Header = () => {
  const navigate = useNavigate();

  return (
    <HeaderStyled>
      <LogoStyled src={logo} alt="Chesser Logo" onClick={() => navigate("/")} />
      <h1 id="appName">Chesser</h1>
    </HeaderStyled>
  );
};

export default Header;
