import { useSound } from "use-sound";
import moveSound from "../../sounds/move.mp3";
import checkSound from "../../sounds/move-check.mp3";
import captureSound from "../../sounds/capture.mp3";
import castleSound from "../../sounds/castle.mp3";
import promoteSound from "../../sounds/promote.mp3";
import gameEndSound from "../../sounds/game-end.mp3";

const useGameSounds = () => {
  const [playMoveSound] = useSound(moveSound);
  const [playCheckSound] = useSound(checkSound);
  const [playCaptureSound] = useSound(captureSound);
  const [playCastleSound] = useSound(castleSound);
  const [playPromoteSound] = useSound(promoteSound);
  const [playGameEndSound] = useSound(gameEndSound);

  return {
    playMoveSound,
    playCheckSound,
    playCaptureSound,
    playCastleSound,
    playPromoteSound,
    playGameEndSound
  };
};

export default useGameSounds;
