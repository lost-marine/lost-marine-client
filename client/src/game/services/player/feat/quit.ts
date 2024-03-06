import g from "@/game/utils/global";

export const onReceviedQuit = (playerId: number): void => {
  g.playerMap.delete(playerId);
  g.eventQueue.append({
    key: "player-quit",
    data: playerId
  });
};
