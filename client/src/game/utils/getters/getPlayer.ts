import type { Player } from "@/game/types/player";
import g from "../global";

/**
 *
 * @param playerId
 * @returns Player | null
 * global 에서 playerId로 player를 찾아서 반환하는 함수입니다.
 */
export const getPlayerByPlayerId = (playerId: number): Player | null => {
  const taragetPlayer = g.playerList.find((player) => player.playerId === playerId);
  return taragetPlayer ?? null;
};
