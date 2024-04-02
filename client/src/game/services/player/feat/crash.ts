import g from "@/game/utils/global";
import { socket } from "@/game/utils/socket";
import type { PlayerCrashResult, PlayerStatusInfo } from "../types/crash";
import { EventBus } from "@/game/EventBus";
import { speciesMap } from "@/game/constants/species";

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

      // 글로벌 상태를 업데이트 한 후 진화 요청 프로세스로 넘어갑니다.
      const currentSpeciesInfo = speciesMap.get(g.myInfo.speciesId);
      if (currentSpeciesInfo !== undefined && g.myInfo.nowExp >= currentSpeciesInfo.requirementPoint) {
        EventBus.emit("player-evolution-required");
      }
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
