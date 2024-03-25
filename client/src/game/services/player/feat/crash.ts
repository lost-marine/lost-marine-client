import g from "@/game/utils/global";
import { socket } from "@/game/utils/socket";
import type { PlayerCrashResponse, PlayerStatusInfo } from "../types/crash";
import { EventBus } from "@/game/EventBus";
import { speciesMap } from "@/game/constants/species";

type CrashService = {
  crash: (playerAId: number, playerBId: number) => void;
  onReceivedCrash: (playerStatusInfo: PlayerStatusInfo) => void;
};

const crashService: CrashService = {
  crash: (playerAId, playerBId) => {
    socket.emit("player-crash", { playerAId, playerBId }, ({ isSuccess, msg }: PlayerCrashResponse): void => {
      if (!isSuccess) {
        console.log(msg);
      }
    });
  },

  onReceivedCrash: (playerStatusInfo: PlayerStatusInfo) => {
    if (g.myInfo !== null && g.myInfo.playerId === playerStatusInfo.playerId) {
      g.myInfo.health = playerStatusInfo.health;
      g.myInfo.point = playerStatusInfo.point;

      // 글로벌 상태를 업데이트 한 후 진화 요청 프로세스로 넘어갑니다.
      const currentSpeciesInfo = speciesMap.get(g.myInfo.speciesId);
      if (currentSpeciesInfo !== undefined && g.myInfo.point >= currentSpeciesInfo.requirementPoint) {
        EventBus.emit("player-evolution-required");
      }
    }
    EventBus.emit("player-status-sync", playerStatusInfo);
  }
};

export default crashService;
