import g from "@/game/utils/global";
import { socket } from "@/game/utils/socket";
import type { PlayerCrashResponse, PlayerStatusInfo } from "../types/crash";
import { EventBus } from "@/game/EventBus";

type CrashService = {
  crash: (playerId: number, attackedPlayerId: number) => void;
  onReceivedCrash: (playerStatusInfo: PlayerStatusInfo) => void;
};

const crashService: CrashService = {
  crash: (playerId, attackedPlayerId) => {
    socket.emit("player-crash", { playerId, attackedPlayerId }, ({ isSuccess, msg }: PlayerCrashResponse): void => {
      if (!isSuccess) {
        console.log(msg);
      }
    });
  },

  onReceivedCrash: (playerStatusInfo: PlayerStatusInfo) => {
    if (g.myInfo !== null && g.myInfo.playerId === playerStatusInfo.playerId) {
      g.myInfo.health = playerStatusInfo.health;
      g.myInfo.point = playerStatusInfo.point;
    }
    EventBus.emit("player-status-sync", playerStatusInfo);
  }
};

export default crashService;
