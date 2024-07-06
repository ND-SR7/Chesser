import { SyncRequestClient } from "ts-sync-request";
import GameState from "../../models/GameState/GameState";

const url = "http://localhost:8080/api/v1/game-state";

export const getGameState = (fen: string): GameState => {
  return new SyncRequestClient().post(url, {fen});
}
