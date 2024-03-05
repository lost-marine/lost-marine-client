import { socket } from "@/game/utils/socket";
import g from "@/game/utils/global";
import type { PlayerPositionInfo } from "@/game/services/player/types/position";

export const syncMyPosition = (positionInfo: PlayerPositionInfo): void => {
  socket.emit("my-position-sync", positionInfo);
};

export const onReceviedOthersPositionSync = (positionInfos: PlayerPositionInfo[]): void => {
  g.eventQueue.append({
    key: "others-position-sync",
    data: positionInfos
  });
};
