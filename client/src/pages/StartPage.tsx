import { useNavigate } from "react-router-dom";

import Button from "../components/Shared/Button/Button";

const StartPage = () => {
  const navigate = useNavigate();
  
  return (
    <div>
      <h1>Welcome to Chesser♟️</h1>
      <Button buttonType="button" label="Start Game" onClick={() => navigate("/game")} />
      <br />
    </div>
  );
};

export default StartPage;
