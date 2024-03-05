import type { EnterResponse } from "..";
import g from "@/game/utils/global";
import { EventBus } from "@/game/EventBus";
import { socket } from "@/game/utils/socket";
import type { Player } from "@/game/types/player";

export const enterGame = (nickname: string): void => {
  if (nickname.length > 0) {
    socket.emit("enter", { nickname }, (response: EnterResponse) => {
      g.myInfo = response.myInfo;
      g.playerList = response.playerList;
      EventBus.emit("change-scene");
    });
  } else {
    window.alert("이름을 입력해주세요.");
  }
};

export const onReceviedEnter = (newPlayer: Player): void => {
  g.playerList.push(newPlayer);
  g.eventQueue.append({
    key: "player-entered",
    data: newPlayer
  });
};
