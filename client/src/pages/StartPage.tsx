import { useNavigate } from "react-router-dom";

const StartPage = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h1>Welcome to Chesser♟️</h1>
      <button onClick={() => navigate("/game")}>Start Game</button>
      <br />
    </div>
  );
};

export default StartPage;
