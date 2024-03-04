import type { EnterResponse } from "..";
import global from "@/game/utils/global";
import { EventBus } from "@/game/EventBus";
import { socket } from "@/game/utils/socket";

export const enterGame = (nickname: string): void => {
  // TODO: 현재 socket 연결이 잘 안되어서 우선 enterGame이 호출되면 바로 scene을 교체하였음. 추후 삭제 필요
  EventBus.emit("change-scene");
  if (nickname.length > 0) {
    socket.emit("enter", { nickname }, (response: EnterResponse) => {
      global.userInfo = response.data;
      EventBus.emit("change-scene");
    });
  } else {
    window.alert("이름을 입력해주세요.");
  }
};
