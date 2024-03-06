import type { EnterResponse } from "..";
import g from "@/game/utils/global";
import { EventBus } from "@/game/EventBus";
import { socket } from "@/game/utils/socket";
import type { Player } from "@/game/types/player";

export const enterGame = (nickname: string): void => {
  if (nickname.length > 0) {
    socket.emit("enter", { nickname }, (response: EnterResponse) => {
      g.myInfo = response.myInfo;
      g.playerMap = response.playerList.reduce((map, player) => {
        map.set(player.playerId, player);
        return map;
      }, new Map<number, Player>());
      EventBus.emit("change-scene");
    });
  } else {
    window.alert("이름을 입력해주세요.");
  }
};

export const onReceviedEnter = (newPlayer: Player): void => {
  // 서버에서 받은 newPlayer는 isFlipX가 없기 때문
  newPlayer.isFlipX = false;
  g.playerMap.set(newPlayer.playerId, newPlayer);
  g.eventQueue.append({
    key: "player-entered",
    data: newPlayer
  });
};
