import { SyncRequestClient } from "ts-sync-request";
import CPUMove from "../../models/CPUMove/CPUMove";

const url = "http://localhost:8080/api/v1/cpu-move";

export const getCpuMove = (fen: string, depth: number): CPUMove => {
  return new SyncRequestClient().post(url, {fen, depth});
}
