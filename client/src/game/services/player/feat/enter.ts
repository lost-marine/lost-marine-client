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

const nemoUrl = "https://static-image-buckets.s3.ap-northeast-2.amazonaws.com/Nemo.gif";
const mackerelUrl = "https://static-image-buckets.s3.ap-northeast-2.amazonaws.com/NormalFish.gif";

const enterService: EnterService = {
  enterGame: async (nickname: string): Promise<void> => {
    const regexp: RegExp = /^[ㄱ-ㅎㅏ-ㅣ가-힣A-Za-z0-9]{2,12}$/;
    const isValid: boolean = regexp.test(nickname);

    if (isValid) {
      socket.emit("nickname-validate", { nickname }, async (response: NameCertificateResponse) => {
        if (response.isSuccess) {
          await Swal.fire({
            title: "새로 탄생할 생명을 선택해주세요.",
            input: "radio",
            html: `
            <div style='display : flex; justify-content: space-around'>
               <div type="submit" onclick="console.log(setSpeciesId); setSpeciesId(1); ">
                <img src=${nemoUrl} />
                <h2>흰동가리</h2>
              </div>
              <div type="submit" onclick="speciesId=2; console.log(speciesId);">
                <img height=192 src=${mackerelUrl} />
                <h2>고등어</h2>
              </div>
            </div>
            `,
            icon: "question",
            allowEnterKey: false,
            showDenyButton: true,
            confirmButtonText: "흰동가리",
            denyButtonText: "고등어"
          }).then((result) => {
            if (result.isDismissed) {
              return;
            }
            let speciesId: number = 0;
            if (result.isConfirmed) {
              speciesId = 1;
            } else {
              speciesId = 2;
            }
            if (speciesId !== 0) {
              console.log(speciesId);
              socket.emit("player-enter", { nickname, speciesId }, async (response: NameCertificateResponse) => {
                if (response.isSuccess) {
                  await Swal.fire("게임에 입장하는 중", "게임에 입장하고 있습니다. 잠시만 기다려주세요.", "info");
                } else {
                  await Swal.fire("입장 실패", response.msg, "error");
                }
              });
            }
          });
        } else {
          await Swal.fire("앗!", response.msg, "error");
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
