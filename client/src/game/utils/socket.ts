import { reactive } from "vue";
import { io } from "socket.io-client";
import type { Player } from "../types/player";
import { type EnterResponse } from "../services/player";
import type { PlayerPositionInfo } from "../services/player/types/position";
import { onReceviedOthersPositionSync } from "../services/player/feat/movement";
import { onReceviedQuit } from "../services/player/feat/quit";
import g from "./global";
import type { Plankton } from "../types/plankton";
import Swal from "sweetalert2";
import { EventBus } from "../EventBus";
import enterService from "./../services/player/feat/enter";
import type { ChatMessage } from "../components/ChatPanel.vue";

export const state = reactive({
  connected: false
});

// "undefined" means the URL will be computed from the `window.location` object
const URL: string = import.meta.env.VITE_URL;

export const socket = io(URL);

socket.on("connect", () => {
  state.connected = true;
});

socket.on("disconnect", () => {
  state.connected = false;
});

socket.on("game-start", async (response: EnterResponse) => {
  g.myInfo = response.myInfo;
  g.playerMap = response.playerList.reduce((map, player) => {
    map.set(player.playerId, player);
    return map;
  }, new Map<number, Player>());
  response.planktonList.forEach((plankton: Plankton) => {
    g.planktonMap.set(plankton.planktonId, plankton);
  });
  Swal.close();
  EventBus.emit("game-start");
});

// 다른 플레이어가 게임방 입장
socket.on("player-enter", (newPlayer: Player) => {
  enterService.onReceviedEnter(newPlayer);
});

// 다른 플레이어가 게임방 퇴장
socket.on("quit", (playerId: number) => {
  onReceviedQuit(playerId);
});

// 다른 플레이어들의 위치 동기화 신호 수신
socket.on("others-position-sync", (positionsInfo: PlayerPositionInfo[]) => {
  onReceviedOthersPositionSync(positionsInfo);
});

// 플레이어가 입력한 채팅 메시지 수신
socket.on("chat-message-receive", (message: ChatMessage) => {
  g.chatMessageList.value.push(message);
});
