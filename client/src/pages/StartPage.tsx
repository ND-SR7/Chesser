import { useNavigate } from "react-router-dom";

import Button from "../components/Shared/Button/Button";
import HeadingStyled from "../components/Shared/Heading/Heading.styled";

const StartPage = () => {
  const navigate = useNavigate();
  
  return (
    <div>
      <HeadingStyled>Welcome to Chesser♟️</HeadingStyled>
      <Button buttonType="button" label="Start Solo/Two Player Game" onClick={() => navigate("/game/solo")} />
      <br />
      <Button buttonType="button" label="Start CPU Game" onClick={() => navigate("/game/cpu")} />
      <br />
    </div>
  );
};

export default StartPage;
