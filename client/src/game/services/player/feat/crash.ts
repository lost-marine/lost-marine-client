import g from "@/game/utils/global";
import { socket } from "@/game/utils/socket";
import type { PlayerCrashResult, PlayerStatusInfo } from "../types/crash";
import { EventBus } from "@/game/EventBus";

type CrashService = {
  crash: (playerAId: number, playerBId: number) => void;
  onReceivedStatusSync: (playerStatusInfo: PlayerStatusInfo) => void;
  onReceivedCrash: (crashResult: PlayerCrashResult) => void;
};

const crashService: CrashService = {
  crash: (playerAId, playerBId) => {
    socket.emit("player-crash", { playerAId, playerBId });
  },

  onReceivedStatusSync: (playerStatusInfo: PlayerStatusInfo) => {
    if (
      g.myInfo !== null &&
      g.myInfo.playerId === playerStatusInfo.playerId &&
      (g.myInfo.health !== playerStatusInfo.health || g.myInfo.nowExp !== playerStatusInfo.nowExp)
    ) {
      g.myInfo.health = playerStatusInfo.health;
      g.myInfo.nowExp = playerStatusInfo.nowExp;
    }
    EventBus.emit("player-status-sync", playerStatusInfo);
  },
  onReceivedCrash: (crashResult: PlayerCrashResult) => {
    if (g.playerMap.has(crashResult.playerId)) {
      g.eventQueue.append({
        key: "player-crash",
        data: crashResult
      });
    }
  }
};

export default crashService;
