import g from "@/game/utils/global";
import { socket } from "@/game/utils/socket";
import { EventBus } from "@/game/EventBus";
import type { OthersEvolutionInfo, PlayerEvolutionInfo, PlayerEvolutionResponse } from "../types/evolution";
import { speciesMap } from "@/game/constants/species";

type EvolutionService = {
  evolve: (playerEvolutionInfo: PlayerEvolutionInfo) => void;
  onReceivedEvolutionSync: (ohtersEvolutionInfo: OthersEvolutionInfo) => void;
};

const evolutionService: EvolutionService = {
  evolve: (playerEvolutionInfo: PlayerEvolutionInfo) => {
    socket.emit("player-evolution", playerEvolutionInfo, ({ isSuccess, msg }: PlayerEvolutionResponse): void => {
      if (isSuccess) {
        if (g.myInfo !== null) {
          g.myInfo.speciesId = playerEvolutionInfo.speciesId;
          const newHealth: number | undefined = speciesMap.get(playerEvolutionInfo.speciesId)?.health;
          if (newHealth === undefined) {
            throw new Error("해당 개체 정보가 불완전합니다.");
          }
          g.myInfo.health = newHealth;
          EventBus.emit("player-evolution", playerEvolutionInfo);
        }
      } else {
        EventBus.emit("player-evolution", msg);
      }
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
