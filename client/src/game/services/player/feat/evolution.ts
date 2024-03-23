import g from "@/game/utils/global";
import { socket } from "@/game/utils/socket";
import { EventBus } from "@/game/EventBus";
import type { PlayerEvolutionInfo, PlayerEvolutionResponse } from "../types/evolution";

type EvolutionService = {
  evolve: (playerEvolutionInfo: PlayerEvolutionInfo) => void;
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
  }
};

export default evolutionService;
