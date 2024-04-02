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
      try {
        socket.emit(
          "player-evolution",
          { speciesId, playerId, nowExp },
          ({ isSuccess, msg, nowExp }: PlayerEvolutionResponse) => {
            if (isSuccess) {
              if (g.myInfo !== null) {
                // TODO: 콘솔 삭제 필요
                console.log("evolve Promise 내부: isSuccess true & g.myInfo not null");
                g.myInfo.speciesId = speciesId;
                g.myInfo.nowExp = nowExp;
                const newHealth: number | undefined = speciesMap.get(speciesId)?.health;
                if (newHealth === undefined) {
                  console.error("해당 개체 정보가 불완전합니다.");
                  return;
                }
                g.myInfo.health = newHealth;
              } else {
                console.error("내 정보가 없습니다.");
                return;
              }

              EventBus.emit("player-evolution", speciesId); // to `PlayerStatus.vue`
              g.eventQueue.append({ key: "player-evolution", data: speciesId });
              resolve(true);
            } else {
              // TODO: 콘솔 삭제 필요
              console.log("evolve Promise 내부: isSuccess false, nowExp: ", nowExp);
              console.log("서버 단 오류 메시지: ", msg);
              // 실패 시
              resolve(false);
            }
          }
        );
      } catch (e: unknown) {
        console.error("소켓 통신에서 에러 발생", e);
        reject(new Error("소켓 통신에서 에러 발생"));
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
