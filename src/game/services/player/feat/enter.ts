import type { EnterResponse } from "..";
import global from "@/game/utils/global";
import { EventBus } from "@/game/EventBus";
import { socket } from "@/game/utils/socket";

export const enterGame = (nickname: string) => {
  if (nickname.length > 0) {
    socket.emit("enter", { nickname }, (response: EnterResponse) => {
      global.userInfo = response.data;
      EventBus.emit("change-scene");
    });
  } else {
    window.alert("이름을 입력해주세요.");
  }
};
