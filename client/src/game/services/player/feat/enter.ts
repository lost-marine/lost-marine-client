import type { NameCertificateResponse } from "..";
import g from "@/game/utils/global";
// import { EventBus } from "@/game/EventBus";
import { socket } from "@/game/utils/socket";
import type { Player } from "@/game/types/player";
import Swal from "sweetalert2";

type EnterService = {
  enterGame: (nickname: string) => Promise<void>;
  onReceviedEnter: (newPlayer: Player) => void;
};

const enterService: EnterService = {
  enterGame: async (nickname: string): Promise<void> => {
    const regexp: RegExp = /^[ㄱ-ㅎㅏ-ㅣ가-힣A-Za-z0-9]{2,12}$/;
    const isValid: boolean = regexp.test(nickname);
    if (isValid) {
      socket.emit("nickname-validate", { nickname }, async (response: NameCertificateResponse) => {
        if (response.isSuccess) {
          socket.emit("player-enter", { nickname, speciesId: 1 }, async (response: NameCertificateResponse) => {
            await Swal.fire("게임에 입장하는 중", "게임에 입장하고 있습니다. 잠시만 기다려주세요.", "info");
          });
        } else {
          await Swal.fire("앗!", response.message, "error");
        }
      });
    } else {
      await Swal.fire("앗!", "닉네임은 2글자 이상 12글자 이하의 영어, 숫자, 특수문자만 입력가능합니다.", "warning");
    }
  },

  onReceviedEnter: (newPlayer: Player): void => {
    g.playerMap.set(newPlayer.playerId, newPlayer);
    g.eventQueue.append({
      key: "player-enter",
      data: newPlayer
    });
  }
};

export default enterService;
