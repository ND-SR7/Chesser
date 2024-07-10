import { useNavigate } from "react-router-dom";

import Button from "../components/Shared/Button/Button";

const StartPage = () => {
  const navigate = useNavigate();
  
  return (
    <div>
      <h1>Welcome to Chesser♟️</h1>
      <Button buttonType="button" label="Start Solo/Two Player Game" onClick={() => navigate("/game/solo")} />
      <br />
      <Button buttonType="button" label="Start CPU Game" onClick={() => navigate("/game/cpu")} />
      <br />
    </div>
  );
};

export default StartPage;
