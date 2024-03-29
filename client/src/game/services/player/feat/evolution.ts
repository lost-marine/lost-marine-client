import g from "@/game/utils/global";
import { socket } from "@/game/utils/socket";
import { EventBus } from "@/game/EventBus";
import type { OthersEvolutionInfo, PlayerEvolutionInfo, PlayerEvolutionResponse } from "../types/evolution";
import { speciesMap } from "@/game/constants/species";

type EvolutionService = {
  evolve: (playerEvolutionInfo: PlayerEvolutionInfo) => Promise<boolean>;
  onReceivedEvolutionSync: (ohtersEvolutionInfo: OthersEvolutionInfo) => void;
};

const evolutionService: EvolutionService = {
  evolve: async ({ speciesId, playerId, nowExp }: PlayerEvolutionInfo) => {
    return await new Promise((resolve, reject) => {
      socket.emit("player-evolution", { speciesId, playerId, nowExp }, ({ isSuccess, msg, nowExp }: PlayerEvolutionResponse) => {
        if (isSuccess) {
          if (g.myInfo !== null) {
            g.myInfo.speciesId = speciesId;
            g.myInfo.nowExp = nowExp;
            const newHealth: number | undefined = speciesMap.get(speciesId)?.health;
            if (newHealth === undefined) {
              throw new Error("해당 개체 정보가 불완전합니다.");
            }
            g.myInfo.health = newHealth;
          }

          EventBus.emit("player-evolution"); // to `PlayerStatus.vue`
          g.eventQueue.append({ key: "player-evolution", data: speciesId });
          resolve(true);
        } else {
          // 실패 시
          reject(new Error(msg));
        }
      });
    });
  },

  onReceivedEvolutionSync: (ohtersEvolutionInfo: OthersEvolutionInfo) => {
    g.eventQueue.append({
      key: "others-evolution-sync",
      data: ohtersEvolutionInfo
    });
  }
};

export default evolutionService;
