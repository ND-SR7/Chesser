type GameState = {
  stalemate: boolean;
  mated: boolean;
  kingAttacked: boolean;
  draw: boolean;
  insufficientMaterial: boolean;
};

export default GameState;
