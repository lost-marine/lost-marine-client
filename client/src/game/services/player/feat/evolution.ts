import g from "@/game/utils/global";
import { socket } from "@/game/utils/socket";
import { EventBus } from "@/game/EventBus";
import type { OthersEvolutionInfo, PlayerEvolutionInfo, PlayerEvolutionResponse } from "../types/evolution";

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
